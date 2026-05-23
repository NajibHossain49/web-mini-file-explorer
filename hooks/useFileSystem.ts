"use client";

import { useReducer, useEffect } from "react";
import {
  FileSystemState,
  FileSystemAction,
  FileNode,
  NodeType,
} from "@/types";
import {
  addNode,
  renameNode,
  deleteNode,
  updateFileContent,
  createNewNode,
  findNode,
  INITIAL_DATA,
} from "@/utils/fileSystem";

const STORAGE_KEY = "webbly-file-explorer";

const initialState: FileSystemState = {
  root: INITIAL_DATA,
  selectedFolderId: "root",
  openFileId: null,
  expandedIds: ["root"],
  editingContent: "",
};

function reducer(
  state: FileSystemState,
  action: FileSystemAction
): FileSystemState {
  switch (action.type) {
    case "LOAD_STATE":
      return action.state;

    case "CREATE_NODE": {
      const newNode = createNewNode(
        action.name,
        action.nodeType,
        action.parentId
      );
      return {
        ...state,
        root: addNode(state.root, action.parentId, newNode),
        expandedIds: state.expandedIds.includes(action.parentId)
          ? state.expandedIds
          : [...state.expandedIds, action.parentId],
      };
    }

    case "RENAME_NODE":
      return {
        ...state,
        root: renameNode(state.root, action.id, action.newName),
      };

    case "DELETE_NODE": {
      const newRoot = deleteNode(state.root, action.id);
      return {
        ...state,
        root: newRoot,
        openFileId:
          state.openFileId === action.id ? null : state.openFileId,
        selectedFolderId:
          state.selectedFolderId === action.id
            ? "root"
            : state.selectedFolderId,
        editingContent:
          state.openFileId === action.id ? "" : state.editingContent,
      };
    }

    case "SELECT_FOLDER":
      return { ...state, selectedFolderId: action.id, openFileId: null, editingContent: "" };

    case "OPEN_FILE":
      return {
        ...state,
        openFileId: action.id,
        editingContent: action.content,
      };

    case "CLOSE_FILE":
      return { ...state, openFileId: null, editingContent: "" };

    case "SAVE_FILE":
      return {
        ...state,
        root: updateFileContent(state.root, action.id, action.content),
        editingContent: action.content,
      };

    case "SET_EDITING_CONTENT":
      return { ...state, editingContent: action.content };

    case "TOGGLE_EXPAND":
      return {
        ...state,
        expandedIds: state.expandedIds.includes(action.id)
          ? state.expandedIds.filter((id) => id !== action.id)
          : [...state.expandedIds, action.id],
      };

    default:
      return state;
  }
}

export function useFileSystem() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "LOAD_STATE", state: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  // Derived: get selected folder node
  const selectedFolder = findNode(state.root, state.selectedFolderId);
  const openFile = state.openFileId
    ? findNode(state.root, state.openFileId)
    : null;

  // Actions
  const createNode = (parentId: string, name: string, nodeType: NodeType) => {
    dispatch({ type: "CREATE_NODE", parentId, name, nodeType });
  };

  const renameNodeAction = (id: string, newName: string) => {
    dispatch({ type: "RENAME_NODE", id, newName });
  };

  const deleteNodeAction = (id: string) => {
    dispatch({ type: "DELETE_NODE", id });
  };

  const selectFolder = (id: string) => {
    dispatch({ type: "SELECT_FOLDER", id });
  };

  const openFile_action = (node: FileNode) => {
    dispatch({ type: "OPEN_FILE", id: node.id, content: node.content || "" });
  };

  const closeFile = () => {
    dispatch({ type: "CLOSE_FILE" });
  };

  const saveFile = (id: string, content: string) => {
    dispatch({ type: "SAVE_FILE", id, content });
  };

  const setEditingContent = (content: string) => {
    dispatch({ type: "SET_EDITING_CONTENT", content });
  };

  const toggleExpand = (id: string) => {
    dispatch({ type: "TOGGLE_EXPAND", id });
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "LOAD_STATE", state: initialState });
  };

  return {
    state,
    selectedFolder,
    openFile,
    createNode,
    renameNode: renameNodeAction,
    deleteNode: deleteNodeAction,
    selectFolder,
    openFileAction: openFile_action,
    closeFile,
    saveFile,
    setEditingContent,
    toggleExpand,
    resetToDefault,
  };
}
