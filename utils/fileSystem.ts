import { FileNode, NodeType } from "@/types";

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function findNode(root: FileNode, id: string): FileNode | null {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

export function findParent(root: FileNode, targetId: string): FileNode | null {
  if (root.children) {
    for (const child of root.children) {
      if (child.id === targetId) return root;
      const found = findParent(child, targetId);
      if (found) return found;
    }
  }
  return null;
}

export function addNode(
  root: FileNode,
  parentId: string,
  newNode: FileNode,
): FileNode {
  if (root.id === parentId) {
    return {
      ...root,
      children: [...(root.children || []), newNode],
    };
  }
  return {
    ...root,
    children: root.children?.map((child) => addNode(child, parentId, newNode)),
  };
}

export function renameNode(
  root: FileNode,
  id: string,
  newName: string,
): FileNode {
  if (root.id === id) return { ...root, name: newName };
  return {
    ...root,
    children: root.children?.map((child) => renameNode(child, id, newName)),
  };
}

export function deleteNode(root: FileNode, id: string): FileNode {
  return {
    ...root,
    children: root.children
      ?.filter((child) => child.id !== id)
      .map((child) => deleteNode(child, id)),
  };
}

export function updateFileContent(
  root: FileNode,
  id: string,
  content: string,
): FileNode {
  if (root.id === id) return { ...root, content };
  return {
    ...root,
    children: root.children?.map((child) =>
      updateFileContent(child, id, content),
    ),
  };
}

export function createNewNode(
  name: string,
  nodeType: NodeType,
  parentId: string,
): FileNode {
  return {
    id: generateId(),
    name,
    type: nodeType,
    parentId,
    ...(nodeType === "folder" ? { children: [] } : { content: "" }),
  };
}

export const INITIAL_DATA: FileNode = {
  id: "root",
  name: "Root",
  type: "folder",
  parentId: null,
  children: [
    {
      id: "folder-1",
      name: "Documents",
      type: "folder",
      parentId: "root",
      children: [
        {
          id: "file-1",
          name: "readme.txt",
          type: "text",
          parentId: "folder-1",
          content: "# Every file is a memory drifting through LocalStorage ",
        },
        {
          id: "file-2",
          name: "notes.txt",
          type: "text",
          parentId: "folder-1",
          content:
            "Meeting notes:\n- Discuss Q3 targets\n- Review design mockups\n- Team sync at 3 PM",
        },
        {
          id: "folder-2",
          name: "Projects",
          type: "folder",
          parentId: "folder-1",
          children: [
            {
              id: "file-3",
              name: "project-plan.txt",
              type: "text",
              parentId: "folder-2",
              content: "Eid Mubarak",
            },
          ],
        },
      ],
    },
    {
      id: "folder-3",
      name: "Images",
      type: "folder",
      parentId: "root",
      children: [],
    },
    {
      id: "folder-4",
      name: "Downloads",
      type: "folder",
      parentId: "root",
      children: [
        {
          id: "file-4",
          name: "todo.txt",
          type: "text",
          parentId: "folder-4",
          content:
            "TODO List:\n1. Buy groceries\n2. Fix the bug in production\n3. Call the client\n4. Submit invoice",
        },
      ],
    },
    {
      id: "file-5",
      name: "welcome.txt",
      type: "text",
      parentId: "root",
      content: "Eid Mubarak",
    },
  ],
};
