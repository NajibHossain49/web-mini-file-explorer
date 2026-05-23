"use client";

import MainPanel from "@/components/MainPanel/MainPanel";
import CreateModal from "@/components/Modals/CreateModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import RenameModal from "@/components/Modals/RenameModal";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useFileSystem } from "@/hooks/useFileSystem";
import { FileNode, NodeType } from "@/types";
import { HardDrive, Menu, RotateCcw, X } from "lucide-react";
import { useState } from "react";

export default function FileExplorer() {
  const {
    state,
    selectedFolder,
    openFile,
    createNode,
    renameNode,
    deleteNode,
    selectFolder,
    openFileAction,
    closeFile,
    saveFile,
    setEditingContent,
    toggleExpand,
    resetToDefault,
  } = useFileSystem();

  const [createParentId, setCreateParentId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<FileNode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileNode | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreateConfirm = (name: string, type: NodeType) => {
    if (!createParentId) return;
    createNode(createParentId, name, type);
    setCreateParentId(null);
  };

  const handleRenameConfirm = (newName: string) => {
    if (!renameTarget) return;
    renameNode(renameTarget.id, newName);
    setRenameTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteNode(deleteTarget.id);
    setDeleteTarget(null);
  };

  const createParentNode = createParentId
    ? state.root.id === createParentId
      ? state.root
      : selectedFolder
    : null;

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#11111b",
        color: "#cdd6f4",
      }}
    >
      {/* Title Bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: "52px",
          background: "#181825",
          borderBottom: "1px solid #313244",
          flexShrink: 0,
          gap: "12px",
        }}
      >
        {/* Left: logo + mobile toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: "#6c7086",
              cursor: "pointer",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#313244";
              (e.currentTarget as HTMLElement).style.color = "#cdd6f4";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#6c7086";
            }}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #89b4fa 0%, #74c7ec 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HardDrive size={14} color="#1e1e2e" />
            </div>
            <div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#cdd6f4",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                Web File Explorer
              </p>
            </div>
          </div>
        </div>

        {/* Right: reset + window dots */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={resetToDefault}
            title="Reset to default data"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "7px",
              border: "1px solid #313244",
              background: "transparent",
              color: "#6c7086",
              fontSize: "11px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#313244";
              (e.currentTarget as HTMLElement).style.color = "#cdd6f4";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#6c7086";
            }}
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>

          {/* macOS-style dots */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              paddingLeft: "4px",
            }}
          >
            {["#f38ba8", "#f9e2af", "#a6e3a1"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  background: c,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* App body */}
      <div
        style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 30,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
            className="md:hidden"
          />
        )}

        {/* Sidebar wrapper — always visible on desktop */}
        <div
          style={{
            position: "relative",
            zIndex: 40,
            display: "flex",
          }}
        >
          <Sidebar
            root={state.root}
            expandedIds={state.expandedIds}
            selectedFolderId={state.selectedFolderId}
            openFileId={state.openFileId}
            onToggleExpand={toggleExpand}
            onSelectFolder={(id) => {
              selectFolder(id);
              setSidebarOpen(false);
            }}
            onOpenFile={(node) => {
              openFileAction(node);
              setSidebarOpen(false);
            }}
            onRename={setRenameTarget}
            onDelete={setDeleteTarget}
            onCreate={setCreateParentId}
          />
        </div>

        {/* Main panel */}
        <MainPanel
          selectedFolder={selectedFolder}
          openFile={openFile}
          editingContent={state.editingContent}
          root={state.root}
          selectedFolderId={state.selectedFolderId}
          onSelectFolder={selectFolder}
          onOpenFile={openFileAction}
          onCloseFile={closeFile}
          onSaveFile={saveFile}
          onSetEditingContent={setEditingContent}
          onRename={setRenameTarget}
          onDelete={setDeleteTarget}
          onCreate={setCreateParentId}
        />
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={createParentId !== null}
        onClose={() => setCreateParentId(null)}
        onConfirm={handleCreateConfirm}
        parentName={createParentNode?.name ?? "Root"}
      />
      <RenameModal
        isOpen={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        onConfirm={handleRenameConfirm}
        currentName={renameTarget?.name ?? ""}
      />
      <DeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        nodeName={deleteTarget?.name ?? ""}
        nodeType={deleteTarget?.type ?? "folder"}
      />
    </div>
  );
}
