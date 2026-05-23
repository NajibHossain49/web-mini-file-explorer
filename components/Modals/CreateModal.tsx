"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { NodeType } from "@/types";
import { Folder, FileText } from "lucide-react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, type: NodeType) => void;
  parentName: string;
}

export default function CreateModal({ isOpen, onClose, onConfirm, parentName }: CreateModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<NodeType>("folder");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed, type);
    setName("");
    setType("folder");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setType("folder");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Item"
      subtitle={`Inside "${parentName}"`}
    >
      {/* Type Selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {(["folder", "text"] as NodeType[]).map((t) => {
          const active = type === t;
          const isFolder = t === "folder";
          const activeColor = isFolder ? "#fab387" : "#89dceb";
          const activeBg = isFolder ? "rgba(250,179,135,0.08)" : "rgba(137,220,235,0.08)";
          return (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                padding: "18px 12px",
                borderRadius: "14px",
                border: `1.5px solid ${active ? activeColor : "#313244"}`,
                background: active ? activeBg : "transparent",
                color: active ? activeColor : "#6c7086",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {isFolder ? <Folder size={22} /> : <FileText size={22} />}
              <span style={{ fontSize: "12px", fontWeight: 500 }}>
                {isFolder ? "Folder" : "Text File"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input */}
      <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7f849c", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
        Name
      </label>
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={type === "folder" ? "e.g. My Documents" : "e.g. notes.txt"}
        style={{
          width: "100%",
          background: "#11111b",
          border: "1.5px solid #313244",
          borderRadius: "10px",
          padding: "10px 14px",
          fontSize: "14px",
          color: "#cdd6f4",
          outline: "none",
          fontFamily: "inherit",
          transition: "border-color 0.15s",
          marginBottom: "20px",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = "#89b4fa")}
        onBlur={e => (e.currentTarget.style.borderColor = "#313244")}
      />

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleClose}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "1.5px solid #313244",
            background: "transparent",
            color: "#7f849c",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#313244"; (e.currentTarget as HTMLElement).style.color = "#cdd6f4"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#7f849c"; }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: name.trim() ? "#89b4fa" : "#313244",
            color: name.trim() ? "#1e1e2e" : "#45475a",
            fontSize: "13px",
            fontWeight: 600,
            cursor: name.trim() ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
        >
          Create
        </button>
      </div>
    </Modal>
  );
}
