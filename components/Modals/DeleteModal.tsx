"use client";

import Modal from "@/components/ui/Modal";
import { Trash2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nodeName: string;
  nodeType: "folder" | "text";
}

export default function DeleteModal({ isOpen, onClose, onConfirm, nodeName, nodeType }: DeleteModalProps) {
  const handleConfirm = () => { onConfirm(); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Permanently">
      {/* Icon + message */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", marginBottom: "28px" }}>
        <div style={{
          width: "56px", height: "56px",
          borderRadius: "16px",
          background: "rgba(243,139,168,0.1)",
          border: "1px solid rgba(243,139,168,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Trash2 size={24} color="#f38ba8" />
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#cdd6f4", marginBottom: "6px" }}>
            Delete &ldquo;{nodeName}&rdquo;?
          </p>
          <p style={{ fontSize: "12px", color: "#6c7086", lineHeight: "1.6" }}>
            {nodeType === "folder"
              ? "This will permanently delete this folder and all its contents. This action cannot be undone."
              : "This file will be permanently deleted. This action cannot be undone."}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onClose}
          style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #313244", background: "transparent", color: "#7f849c", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#313244"; (e.currentTarget as HTMLElement).style.color = "#cdd6f4"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#7f849c"; }}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "#f38ba8", color: "#1e1e2e", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#eba0ac"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#f38ba8"}
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </Modal>
  );
}
