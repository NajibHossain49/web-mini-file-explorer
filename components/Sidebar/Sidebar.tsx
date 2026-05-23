"use client";

import { FileNode } from "@/types";
import { HardDrive, Plus } from "lucide-react";
import TreeNode from "./TreeNode";

interface SidebarProps {
  root: FileNode;
  expandedIds: string[];
  selectedFolderId: string;
  openFileId: string | null;
  onToggleExpand: (id: string) => void;
  onSelectFolder: (id: string) => void;
  onOpenFile: (node: FileNode) => void;
  onRename: (node: FileNode) => void;
  onDelete: (node: FileNode) => void;
  onCreate: (parentId: string) => void;
  isOpen?: boolean;
}

export default function Sidebar({
  root,
  expandedIds,
  selectedFolderId,
  openFileId,
  onToggleExpand,
  onSelectFolder,
  onOpenFile,
  onRename,
  onDelete,
  onCreate,
  isOpen = false,
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        width: "232px",
        flexShrink: 0,
        background: "#181825",
        borderRight: "1px solid #313244",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{ padding: "16px 14px 12px", borderBottom: "1px solid #313244" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            marginBottom: "12px",
          }}
        >
          <HardDrive size={12} color="#6c7086" />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#6c7086",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Explorer
          </span>
        </div>
        <button
          onClick={() => onCreate(selectedFolderId)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #313244",
            background: "transparent",
            color: "#89b4fa",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(137,180,250,0.08)";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(137,180,250,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "#313244";
          }}
        >
          <Plus size={12} /> New Item
        </button>
      </div>

      {/* Tree */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 6px" }}>
        <TreeNode
          node={root}
          depth={0}
          isExpanded={expandedIds.includes(root.id)}
          isSelected={selectedFolderId === root.id}
          isOpenFile={false}
          onToggleExpand={onToggleExpand}
          onSelectFolder={onSelectFolder}
          onOpenFile={onOpenFile}
          onRename={onRename}
          onDelete={onDelete}
          onCreate={onCreate}
          expandedIds={expandedIds}
          selectedFolderId={selectedFolderId}
          openFileId={openFileId}
        />
      </div>
    </aside>
  );
}
