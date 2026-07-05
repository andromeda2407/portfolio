"use client";

import Link from "next/link";
import { useWorldStore } from "./store";
import { SectionPanel } from "./SectionPanel";

export function Hud() {
  const phase = useWorldStore((s) => s.phase);
  const exitBay = useWorldStore((s) => s.exitBay);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "ui-monospace, Menlo, monospace",
        color: "#7fe9c0",
      }}
    >
      <div style={{ position: "absolute", top: 12, left: 12, fontSize: 11, lineHeight: 1.6 }}>
        ▸ SYS: ONLINE
        <br />▸ PWR: 98%
        <br />▸ MODE: {phase.toUpperCase()}
      </div>
      <div style={{ position: "absolute", top: 12, right: 12, fontSize: 11, textAlign: "right", lineHeight: 1.6 }}>
        MECH-2407 ◂
        <br />
        PILOT: MUNAIB ◂
      </div>

      <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 16, pointerEvents: "auto" }}>
        <Link href="/" style={{ color: "#35d07f", fontSize: 12, textDecoration: "none" }}>
          ← Back to portfolio
        </Link>
        <Link href="/#projects" style={{ color: "#5f7684", fontSize: 12, textDecoration: "none" }}>
          skip to classic site
        </Link>
      </div>

      {phase === "idle" && (
        <div style={{ position: "absolute", bottom: 12, right: 12, fontSize: 11, color: "#5f7684" }}>
          tap a beacon to pilot the mech
        </div>
      )}

      {phase === "viewing" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              maxWidth: 520,
              width: "90%",
              maxHeight: "80%",
              overflow: "auto",
              background: "rgba(8,14,20,.92)",
              border: "1px solid #1e2a33",
              borderRadius: 12,
              padding: 24,
              color: "#d6e2e9",
            }}
          >
            <button
              onClick={exitBay}
              style={{
                float: "right",
                background: "transparent",
                border: "1px solid #35d07f",
                color: "#35d07f",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ⏏ Exit bay
            </button>
            <SectionPanel />
          </div>
        </div>
      )}
    </div>
  );
}
