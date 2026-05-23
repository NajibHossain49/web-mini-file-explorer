"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, Folder, FolderOpen, FileText, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { FileNode } from "@/types";

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isOpenFile: boolean;
  onToggleExpand: (id: string) => void;
  onSelectFolder: (id: string) => void;
  onOpenFile: (node: FileNode) => void;
  onRename: (node: FileNode) => void;
  onDelete: (node: FileNode) => void;
  onCreate: (parentId: string) => void;
  expandedIds: string[];
  selectedFolderId: string;
  openFileId: string | null;
}

export default function TreeNode({
  node, depth, isExpanded, isSelected, isOpenFile,
  onToggleExpand, onSelectFolder, onOpenFile,
  onRename, onDelete, onCreate,
  expandedIds, selectedFolderId, openFileId,
}: TreeNodeProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isFolder = node.type === "folder";
  const isActive = isFolder ? isSelected : isOpenFile;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleClick = () => {
    if (isFolder) { onSelectFolder(node.id); onToggleExpand(node.id); }
    else onOpenFile(node);
  };

  const rowPadding = depth * 14 + 10;

  return (
    <div>
      <div
        className="group"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          paddingLeft: `${rowPadding}px`,
          paddingRight: "8px",
          paddingTop: "5px",
          paddingBottom: "5px",
          borderRadius: "8px",
          cursor: "pointer",
          userSelect: "none",
          transition: "background 0.12s",
          background: isActive ? "#313244" : "transparent",
          color: isActive ? "#cdd6f4" : "#7f849c",
          marginBottom: "1px",
          position: "relative",
        }}
        onClick={handleClick}
        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#1e1e2e"; }}
        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        {/* Chevron */}
        {isFolder ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "14px",
              flexShrink: 0,
              transition: "transform 0.15s",
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              color: "#45475a",
            }}
            onClick={e => { e.stopPropagation(); onToggleExpand(node.id); }}
          >
            <ChevronRight size={11} />
          </span>
        ) : (
          <span style={{ width: "14px", flexShrink: 0 }} />
        )}

        {/* Icon */}
        {isFolder ? (
          isExpanded
            ? <FolderOpen size={13} style={{ color: "#fab387", flexShrink: 0 }} />
            : <Folder size={13} style={{ color: "#fab387", flexShrink: 0 }} />
        ) : (
          <FileText size={13} style={{ color: "#89dceb", flexShrink: 0 }} />
        )}

        {/* Name */}
        <span style={{ fontSize: "13px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: isActive ? 500 : 400 }}>
          {node.name}
        </span>

        {/* Context menu */}
        {node.id !== "root" && (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "20px", height: "20px", borderRadius: "5px",
                border: "none", background: showMenu ? "#45475a" : "transparent",
                color: showMenu ? "#cdd6f4" : "#6c7086",
                cursor: "pointer",
                opacity: showMenu ? 1 : 0,
                transition: "all 0.12s",
              }}
              className="group-hover:!opacity-100"
            >
              <MoreHorizontal size={11} />
            </button>

            {showMenu && (
              <div
                className="animate-slide-down"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 4px)",
                  zIndex: 100,
                  background: "#11111b",
                  border: "1px solid #313244",
                  borderRadius: "10px",
                  padding: "4px",
                  minWidth: "160px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                {isFolder && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); onCreate(node.id); setShowMenu(false); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "7px", border: "none", background: "transparent", color: "#a6e3a1", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "background 0.1s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#1e1e2e"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      <Plus size={11} /> New Item
                    </button>
                    <div style={{ height: "1px", background: "#313244", margin: "4px 0" }} />
                  </>
                )}
                <button
                  onClick={e => { e.stopPropagation(); onRename(node); setShowMenu(false); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "7px", border: "none", background: "transparent", color: "#cdd6f4", fontSize: "12px", fontWeight: 400, cursor: "pointer", fontFamily: "inherit", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#1e1e2e"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <Pencil size={11} /> Rename
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(node); setShowMenu(false); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "7px", border: "none", background: "transparent", color: "#f38ba8", fontSize: "12px", fontWeight: 400, cursor: "pointer", fontFamily: "inherit", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#1e1e2e"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isExpanded={expandedIds.includes(child.id)}
              isSelected={selectedFolderId === child.id}
              isOpenFile={openFileId === child.id}
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
          ))}
          {node.children.length === 0 && (
            <p style={{ paddingLeft: `${(depth + 1) * 14 + 28}px`, paddingTop: "4px", paddingBottom: "4px", fontSize: "11px", color: "#45475a", fontStyle: "italic" }}>
              Empty
            </p>
          )}
        </div>
      )}
    </div>
  );
}
