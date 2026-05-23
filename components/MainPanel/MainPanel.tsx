"use client";

import { useState } from "react";
import { FileNode } from "@/types";
import FileItem from "./FileItem";
import TextEditor from "./TextEditor";
import { FolderOpen, Plus, LayoutGrid, List, ChevronRight } from "lucide-react";

interface MainPanelProps {
  selectedFolder: FileNode | null;
  openFile: FileNode | null;
  editingContent: string;
  root: FileNode;
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
  onOpenFile: (node: FileNode) => void;
  onCloseFile: () => void;
  onSaveFile: (id: string, content: string) => void;
  onSetEditingContent: (content: string) => void;
  onRename: (node: FileNode) => void;
  onDelete: (node: FileNode) => void;
  onCreate: (parentId: string) => void;
}

function getBreadcrumb(root: FileNode, targetId: string): FileNode[] {
  const path: FileNode[] = [];
  function dfs(node: FileNode): boolean {
    path.push(node);
    if (node.id === targetId) return true;
    if (node.children) for (const c of node.children) if (dfs(c)) return true;
    path.pop();
    return false;
  }
  dfs(root);
  return path;
}

export default function MainPanel({
  selectedFolder, openFile, editingContent, root, selectedFolderId,
  onSelectFolder, onOpenFile, onCloseFile, onSaveFile, onSetEditingContent,
  onRename, onDelete, onCreate,
}: MainPanelProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const breadcrumb = getBreadcrumb(root, selectedFolderId);
  const children = selectedFolder?.children || [];
  const folders = children.filter(n => n.type === "folder");
  const files = children.filter(n => n.type === "text");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#1e1e2e" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "48px",
        background: "#181825",
        borderBottom: "1px solid #313244",
        flexShrink: 0,
        gap: "12px",
      }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1, minWidth: 0, overflow: "hidden" }}>
          {breadcrumb.map((node, i) => (
            <div key={node.id} style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: i < breadcrumb.length - 1 ? 0 : 1, minWidth: i === breadcrumb.length - 1 ? 0 : "auto" }}>
              {i > 0 && <ChevronRight size={11} color="#45475a" style={{ flexShrink: 0 }} />}
              <button
                onClick={() => onSelectFolder(node.id)}
                style={{
                  fontSize: "13px",
                  fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
                  color: i === breadcrumb.length - 1 ? "#cdd6f4" : "#6c7086",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 3px",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                  transition: "color 0.12s",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: i === breadcrumb.length - 1 ? "180px" : "80px",
                }}
                onMouseEnter={e => { if (i < breadcrumb.length - 1) (e.currentTarget as HTMLElement).style.color = "#89b4fa"; }}
                onMouseLeave={e => { if (i < breadcrumb.length - 1) (e.currentTarget as HTMLElement).style.color = "#6c7086"; }}
              >
                {node.name}
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <button
            onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
            title="Toggle view"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "32px", height: "32px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: "#6c7086",
              cursor: "pointer",
              transition: "all 0.12s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#313244"; (e.currentTarget as HTMLElement).style.color = "#cdd6f4"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6c7086"; }}
          >
            {viewMode === "grid" ? <List size={14} /> : <LayoutGrid size={14} />}
          </button>
          <button
            onClick={() => onCreate(selectedFolderId)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#89b4fa",
              color: "#1e1e2e",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#b4befe"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#89b4fa"}
          >
            <Plus size={12} /> New
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {openFile ? (
          <TextEditor
            fileId={openFile.id}
            fileName={openFile.name}
            content={editingContent}
            onChange={onSetEditingContent}
            onSave={onSaveFile}
            onClose={onCloseFile}
          />
        ) : (
          <div
            style={{ flex: 1, overflowY: "auto", padding: "20px" }}
            onClick={() => setSelectedItemId(null)}
          >
            {children.length === 0 ? (
              /* Empty state */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", textAlign: "center" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "#181825", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FolderOpen size={32} color="#45475a" />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#6c7086", marginBottom: "6px" }}>This folder is empty</p>
                  <p style={{ fontSize: "12px", color: "#45475a", lineHeight: "1.6" }}>Click &ldquo;New&rdquo; to add a file or folder</p>
                </div>
                <button
                  onClick={() => onCreate(selectedFolderId)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(137,180,250,0.3)",
                    background: "rgba(137,180,250,0.06)",
                    color: "#89b4fa",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(137,180,250,0.12)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(137,180,250,0.06)"}
                >
                  <Plus size={12} /> Create Something
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid view */
              <div>
                {folders.length > 0 && (
                  <div style={{ marginBottom: files.length > 0 ? "24px" : 0 }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#45475a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
                      Folders &nbsp;<span style={{ fontWeight: 400 }}>({folders.length})</span>
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))", gap: "4px" }}>
                      {folders.map(node => (
                        <FileItem key={node.id} node={node} isSelected={selectedItemId === node.id}
                          onClick={() => setSelectedItemId(node.id)}
                          onDoubleClick={() => { onSelectFolder(node.id); setSelectedItemId(null); }}
                          onRename={() => onRename(node)} onDelete={() => onDelete(node)} />
                      ))}
                    </div>
                  </div>
                )}
                {files.length > 0 && (
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#45475a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
                      Files &nbsp;<span style={{ fontWeight: 400 }}>({files.length})</span>
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))", gap: "4px" }}>
                      {files.map(node => (
                        <FileItem key={node.id} node={node} isSelected={selectedItemId === node.id}
                          onClick={() => setSelectedItemId(node.id)}
                          onDoubleClick={() => { onOpenFile(node); }}
                          onRename={() => onRename(node)} onDelete={() => onDelete(node)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* List view */
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {children.map(node => {
                  const isFolder = node.type === "folder";
                  const isActive = selectedItemId === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedItemId(node.id)}
                      onDoubleClick={() => isFolder ? onSelectFolder(node.id) : onOpenFile(node)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        background: isActive ? "#313244" : "transparent",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#181825"; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: isFolder ? "rgba(250,179,135,0.1)" : "rgba(137,220,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isFolder ? <Folder24 /> : <File24 />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "#cdd6f4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</p>
                        <p style={{ fontSize: "11px", color: "#6c7086", marginTop: "1px" }}>
                          {isFolder ? `${node.children?.length ?? 0} item${(node.children?.length ?? 0) !== 1 ? "s" : ""}` : "Text file"}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "4px" }} onClick={e => e.stopPropagation()}>
                        <ActionBtn onClick={() => onRename(node)} color="#cdd6f4" label="✏" />
                        <ActionBtn onClick={() => onDelete(node)} color="#f38ba8" label="🗑" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      {!openFile && (
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          height: "28px",
          background: "#181825",
          borderTop: "1px solid #313244",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "11px", color: "#45475a" }}>
            {folders.length} folder{folders.length !== 1 ? "s" : ""} &nbsp;·&nbsp; {files.length} file{files.length !== 1 ? "s" : ""}
            {selectedItemId ? " &nbsp;·&nbsp; 1 selected" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

function Folder24() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fab387" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
}

function File24() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#89dceb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
}

function ActionBtn({ onClick, color, label }: { onClick: () => void; color: string; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "28px", height: "28px",
        borderRadius: "7px",
        border: "none",
        background: "transparent",
        color,
        fontSize: "12px",
        cursor: "pointer",
        transition: "background 0.1s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#313244"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
    >
      {label}
    </button>
  );
}
