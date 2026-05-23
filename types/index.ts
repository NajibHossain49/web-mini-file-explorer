export type NodeType = "folder" | "text";

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  content?: string;
  children?: FileNode[];
  parentId: string | null;
}

export interface FileSystemState {
  root: FileNode;
  selectedFolderId: string;
  openFileId: string | null;
  expandedIds: string[];
  editingContent: string;
}

export type FileSystemAction =
  | { type: "CREATE_NODE"; parentId: string; name: string; nodeType: NodeType }
  | { type: "RENAME_NODE"; id: string; newName: string }
  | { type: "DELETE_NODE"; id: string }
  | { type: "SELECT_FOLDER"; id: string }
  | { type: "OPEN_FILE"; id: string; content: string }
  | { type: "CLOSE_FILE" }
  | { type: "SAVE_FILE"; id: string; content: string }
  | { type: "SET_EDITING_CONTENT"; content: string }
  | { type: "TOGGLE_EXPAND"; id: string }
  | { type: "LOAD_STATE"; state: FileSystemState };
