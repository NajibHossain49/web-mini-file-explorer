"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="animate-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="animate-modal w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#1e1e2e",
          border: "1px solid #313244",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between"
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #313244",
          }}
        >
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#cdd6f4", letterSpacing: "-0.02em" }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: "12px", color: "#6c7086", marginTop: "2px" }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              marginTop: "1px",
              padding: "4px",
              borderRadius: "8px",
              color: "#6c7086",
              transition: "all 0.15s",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#313244"; (e.currentTarget as HTMLElement).style.color = "#cdd6f4"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6c7086"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
