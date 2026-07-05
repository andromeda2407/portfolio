"use client";

// Importing fiber's element types loads the JSX.IntrinsicElements
// augmentation (<mesh>, <group>, <gridHelper>, …) for this file.
import type {} from "@react-three/fiber";

// Deterministic scatter (no Math.random) so the world is stable across renders.
const COLORS = ["#10202a", "#0d1a22", "#14262f"];
const props = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2;
  const r = 20 + ((i * 7) % 9);
  const w = 1 + ((i * 3) % 4);
  const h = 2 + ((i * 5) % 6);
  return { x: Math.cos(a) * r, z: Math.sin(a) * r, w, h, i };
});

export function Environment() {
  return (
    <group>
      <gridHelper args={[80, 80, "#35d07f", "#12303a"]} position={[0, 0.01, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#081016" roughness={0.95} />
      </mesh>
      {props.map((p) => (
        <mesh key={p.i} position={[p.x, p.h / 2, p.z]}>
          <boxGeometry args={[p.w, p.h, p.w]} />
          <meshStandardMaterial
            color={COLORS[p.i % 3]}
            emissive="#0a1a22"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}
