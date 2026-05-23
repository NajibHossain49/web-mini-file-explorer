"use client";

import { useState, useRef, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

import { FileNode } from "@/types";

interface FileItemProps {
  node: FileNode;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function FileItem({
  node,
  isSelected,
  onClick,
  onDoubleClick,
  onRename,
  onDelete,
}: FileItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const isFolder = node.type === "folder";

  // Floating UI
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-end",
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handler);
    }

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [showMenu]);

  const bg = isSelected
    ? "#313244"
    : hovered
    ? "#1e1e2e"
    : "transparent";

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "14px 8px 12px",
        borderRadius: "12px",
        cursor: "pointer",
        userSelect: "none",
        background: bg,
        outline: isSelected
          ? "2px solid rgba(137,180,250,0.25)"
          : "none",
        outlineOffset: "0px",
        transition: "background 0.12s, outline 0.12s",
      }}
    >
      {/* Icon container */}
      <div
        style={{
          position: "relative",
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: isFolder
            ? "rgba(250,179,135,0.1)"
            : "rgba(137,220,235,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.12s",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        {isFolder ? (
          isSelected ? (
            <FolderOpen size={28} color="#fab387" />
          ) : (
            <Folder size={28} color="#fab387" />
          )
        ) : (
          <FileText size={28} color="#89dceb" />
        )}

        {isFolder &&
          node.children &&
          node.children.length > 0 && (
            <span
              style={{
                position: "absolute",
                bottom: "-3px",
                right: "-3px",
                width: "18px",
                height: "18px",
                background: "#45475a",
                borderRadius: "50%",
                fontSize: "9px",
                color: "#cdd6f4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                border: "2px solid #181825",
              }}
            >
              {node.children.length > 9
                ? "9+"
                : node.children.length}
            </span>
          )}
      </div>

      {/* Name */}
      <span
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: isSelected ? "#cdd6f4" : "#a6adc8",
          textAlign: "center",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: "1.3",
        }}
      >
        {node.name}
      </span>

      {/* Context menu button */}
      <div
        ref={menuRef}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={refs.setReference}
          onClick={() => setShowMenu((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            border: "none",
            background: showMenu
              ? "#45475a"
              : "transparent",
            color: showMenu ? "#cdd6f4" : "#6c7086",
            cursor: "pointer",
            opacity: showMenu || hovered ? 1 : 0,
            transition: "all 0.12s",
          }}
        >
          <MoreVertical size={11} />
        </button>

        {showMenu && (
          <div
            ref={refs.setFloating}
            className="animate-slide-down"
            style={{
              ...floatingStyles,
              zIndex: 100,
              background: "#11111b",
              border: "1px solid #313244",
              borderRadius: "10px",
              padding: "4px",
              minWidth: "148px",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <button
              onClick={() => {
                onRename();
                setShowMenu(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 10px",
                borderRadius: "7px",
                border: "none",
                background: "transparent",
                color: "#cdd6f4",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "#1e1e2e")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "transparent")
              }
            >
              <Pencil size={11} />
              Rename
            </button>

            <button
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 10px",
                borderRadius: "7px",
                border: "none",
                background: "transparent",
                color: "#f38ba8",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "#1e1e2e")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "transparent")
              }
            >
              <Trash2 size={11} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}