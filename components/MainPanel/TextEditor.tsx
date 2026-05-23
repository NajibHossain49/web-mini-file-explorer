"use client";

import { useState } from "react";
import { FileText, Save, X, CheckCircle2 } from "lucide-react";

interface TextEditorProps {
  fileId: string;
  fileName: string;
  content: string;
  onChange: (content: string) => void;
  onSave: (id: string, content: string) => void;
  onClose: () => void;
}

export default function TextEditor({ fileId, fileName, content, onChange, onSave, onClose }: TextEditorProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(fileId, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const t = e.target as HTMLTextAreaElement;
      const s = t.selectionStart;
      const end = t.selectionEnd;
      const newVal = content.substring(0, s) + "  " + content.substring(end);
      onChange(newVal);
      setTimeout(() => { t.selectionStart = t.selectionEnd = s + 2; }, 0);
    }
  };

  const lines = content.split("\n");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1e1e2e", minHeight: 0 }}>
      {/* Editor topbar */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
          <div style={{
            width: "28px", height: "28px",
            borderRadius: "8px",
            background: "rgba(137,220,235,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <FileText size={13} color="#89dceb" />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#cdd6f4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {fileName}
            </p>
            <p style={{ fontSize: "10px", color: "#45475a", marginTop: "0px" }}>Plain Text</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <button
            onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "6px 12px",
              borderRadius: "7px",
              border: `1px solid ${saved ? "rgba(166,227,161,0.3)" : "rgba(137,180,250,0.3)"}`,
              background: saved ? "rgba(166,227,161,0.08)" : "rgba(137,180,250,0.08)",
              color: saved ? "#a6e3a1" : "#89b4fa",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {saved ? <CheckCircle2 size={11} /> : <Save size={11} />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "28px", height: "28px",
              borderRadius: "7px",
              border: "none",
              background: "transparent",
              color: "#6c7086",
              cursor: "pointer",
              transition: "all 0.12s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#313244"; (e.currentTarget as HTMLElement).style.color = "#cdd6f4"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6c7086"; }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}>
        {/* Line numbers */}
        <div style={{
          width: "52px",
          background: "#181825",
          borderRight: "1px solid #313244",
          padding: "16px 0",
          flexShrink: 0,
          overflowY: "hidden",
          userSelect: "none",
        }}>
          {lines.map((_, i) => (
            <div key={i} style={{ fontSize: "12px", lineHeight: "24px", color: "#45475a", textAlign: "right", paddingRight: "14px" }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          style={{
            flex: 1,
            background: "#1e1e2e",
            color: "#cdd6f4",
            fontSize: "13px",
            lineHeight: "24px",
            padding: "16px 20px",
            resize: "none",
            outline: "none",
            border: "none",
            fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
            caretColor: "#89b4fa",
          }}
          placeholder="Start typing..."
        />
      </div>

      {/* Status bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "28px",
        background: "#181825",
        borderTop: "1px solid #313244",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "11px", color: "#45475a" }}>
          {lines.length} {lines.length === 1 ? "line" : "lines"} &nbsp;·&nbsp; {content.length} chars
        </span>
        <span style={{ fontSize: "11px", color: "#45475a" }}>
          Ctrl+S to save
        </span>
      </div>
    </div>
  );
}
