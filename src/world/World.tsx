"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Hud } from "./Hud";

export function World() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#060a0e" }}>
      <Canvas camera={{ position: [0, 10, 17], fov: 52, near: 0.1, far: 200 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
      <Hud />
    </div>
  );
}
