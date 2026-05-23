"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  currentName: string;
}

export default function RenameModal({ isOpen, onClose, onConfirm, currentName }: RenameModalProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => { setName(currentName); }, [currentName, isOpen]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === currentName) { onClose(); return; }
    onConfirm(trimmed);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename" subtitle={`Renaming "${currentName}"`}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#7f849c", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
        New Name
      </label>
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
        onFocus={e => (e.currentTarget.style.borderColor = "#cba6f7")}
        onBlur={e => (e.currentTarget.style.borderColor = "#313244")}
      />
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
          onClick={handleSubmit}
          disabled={!name.trim()}
          style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: name.trim() ? "#cba6f7" : "#313244", color: name.trim() ? "#1e1e2e" : "#45475a", fontSize: "13px", fontWeight: 600, cursor: name.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.15s" }}
        >
          Rename
        </button>
      </div>
    </Modal>
  );
}
