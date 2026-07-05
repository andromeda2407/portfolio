"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "./store";

const BODY = "#9fb4c0";
const LIMB = "#7f95a2";
const GLOW = "#35d07f";

export function Mech() {
  const bob = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const walk = useRef(0);

  useFrame((_, delta) => {
    const { phase } = useWorldStore.getState();
    const moving = phase === "walking" || phase === "exiting";
    walk.current += Math.min(delta, 0.05) * (moving ? 9 : 3);
    const s = Math.sin(walk.current);
    if (legL.current) legL.current.rotation.x = s * 0.5;
    if (legR.current) legR.current.rotation.x = -s * 0.5;
    if (armL.current) armL.current.rotation.x = -s * 0.4;
    if (armR.current) armR.current.rotation.x = s * 0.4;
    if (bob.current) bob.current.position.y = Math.abs(Math.sin(walk.current)) * 0.12;
  });

  return (
    <group ref={bob}>
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[1.7, 1.9, 1.0]} />
        <meshStandardMaterial color={BODY} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.95, 0]}>
        <boxGeometry args={[0.95, 0.8, 0.9]} />
        <meshStandardMaterial color={BODY} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.95, 0.46]}>
        <boxGeometry args={[0.7, 0.22, 0.08]} />
        <meshStandardMaterial color={GLOW} emissive={GLOW} emissiveIntensity={1.4} />
      </mesh>
      <group ref={legL} position={[-0.42, 1.7, 0]}>
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[0.5, 1.7, 0.6]} />
          <meshStandardMaterial color={LIMB} metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
      <group ref={legR} position={[0.42, 1.7, 0]}>
        <mesh position={[0, -0.85, 0]}>
          <boxGeometry args={[0.5, 1.7, 0.6]} />
          <meshStandardMaterial color={LIMB} metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
      <group ref={armL} position={[-1.05, 3.3, 0]}>
        <mesh position={[0, -0.75, 0]}>
          <boxGeometry args={[0.38, 1.5, 0.42]} />
          <meshStandardMaterial color={LIMB} metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
      <group ref={armR} position={[1.05, 3.3, 0]}>
        <mesh position={[0, -0.75, 0]}>
          <boxGeometry args={[0.38, 1.5, 0.42]} />
          <meshStandardMaterial color={LIMB} metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
