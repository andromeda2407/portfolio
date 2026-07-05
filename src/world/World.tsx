"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Hud } from "./Hud";
import { prefersReducedMotion } from "./motion";

export function World() {
  const maxDpr = prefersReducedMotion() ? 1 : 2;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#060a0e" }}>
      <Canvas camera={{ position: [0, 10, 17], fov: 52, near: 0.1, far: 200 }} dpr={[1, maxDpr]}>
        <Scene />
      </Canvas>
      <Hud />
    </div>
  );
}
