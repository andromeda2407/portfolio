"use client";

import type {} from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useWorldStore } from "./store";
import type { WorldSection } from "./sections";

export function Beacon({ section }: { section: WorldSection }) {
  const phase = useWorldStore((s) => s.phase);
  const active = useWorldStore((s) => s.activeSection);
  const select = useWorldStore((s) => s.selectBeacon);
  const dimmed = active !== null && active !== section.id;
  const intensity = dimmed ? 0.2 : 0.9;

  return (
    <group position={section.position}>
      <mesh position={[0, 3.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.18, 10, 32]} />
        <meshStandardMaterial color="#35d07f" emissive="#35d07f" emissiveIntensity={intensity} />
      </mesh>
      <mesh
        position={[0, 1.7, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (phase === "idle") select(section.id);
        }}
      >
        <cylinderGeometry args={[0.22, 0.32, 3.4, 10]} />
        <meshStandardMaterial color="#35d07f" emissive="#35d07f" emissiveIntensity={intensity} />
      </mesh>
      <Html center position={[0, 5, 0]} distanceFactor={22}>
        <div
          style={{
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: "13px",
            fontWeight: 700,
            color: "#eaf2f7",
            background: "rgba(6,10,14,.6)",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: "6px",
            padding: "2px 8px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {section.label}
        </div>
      </Html>
    </group>
  );
}
