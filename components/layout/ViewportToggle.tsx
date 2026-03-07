"use client";

import { useState, ReactNode } from "react";

interface ViewportToggleProps {
  children: ReactNode;
}

export default function ViewportToggle({ children }: ViewportToggleProps) {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <>
      {/* Toggle button - always fixed, outside any container */}
      <div
        style={{
          position: "fixed",
          top: 8,
          left: 8,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 0,
          background: "#ffffff",
          borderRadius: 9999,
          boxShadow: "0 1px 6px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
          padding: 3,
        }}
      >
        {/* Desktop button */}
        <button
          onClick={() => setIsMobile(false)}
          aria-label="Desktop weergave"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 9999,
            border: "none",
            cursor: "pointer",
            background: !isMobile ? "#f97316" : "transparent",
            color: !isMobile ? "#ffffff" : "#6b7280",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {/* Monitor icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </button>

        {/* Mobile button */}
        <button
          onClick={() => setIsMobile(true)}
          aria-label="Mobiele weergave"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 9999,
            border: "none",
            cursor: "pointer",
            background: isMobile ? "#f97316" : "transparent",
            color: isMobile ? "#ffffff" : "#6b7280",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {/* Phone icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </button>
      </div>

      {/* Content area */}
      {isMobile ? (
        <>
          {/* Gray background overlay for the full page */}
          <style>{`
            html, body {
              background: #e5e7eb !important;
            }
          `}</style>
          <div
            style={{
              maxWidth: 393,
              minHeight: "100vh",
              margin: "0 auto",
              background: "#ffffff",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 4px 40px rgba(0,0,0,0.15)",
              borderRadius: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Device frame top notch indicator */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 9998,
                display: "flex",
                justifyContent: "center",
                paddingTop: 4,
                paddingBottom: 4,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: 126,
                  height: 28,
                  background: "#000000",
                  borderRadius: 14,
                  opacity: 0,
                }}
              />
            </div>
            {children}
          </div>
        </>
      ) : (
        children
      )}
    </>
  );
}
