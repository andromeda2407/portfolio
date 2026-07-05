"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Mech } from "./Mech";
import { Pilot } from "./Pilot";
import { Beacon } from "./Beacon";
import { Environment } from "./Environment";
import { worldSections, getSection } from "./sections";
import { useWorldStore } from "./store";
import { prefersReducedMotion } from "./motion";

const ORIGIN = new THREE.Vector3(0, 0, 0);
const dest = new THREE.Vector3();
const dir = new THREE.Vector3();
const outward = new THREE.Vector3();
const camGoal = new THREE.Vector3();
const lookGoal = new THREE.Vector3();
const lookCurrent = new THREE.Vector3(0, 2.5, 0);

function standPos(pos: [number, number, number]) {
  // stop 72% of the way out — the mech halts in front of the bay
  return dest.set(pos[0] * 0.72, 0, pos[2] * 0.72);
}

function lerpAngle(a: number, b: number, t: number) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function moveToward(obj: THREE.Group, target: THREE.Vector3, dt: number, speed: number) {
  dir.copy(target).sub(obj.position);
  dir.y = 0;
  const d = dir.length();
  if (d > 0.001) {
    dir.normalize();
    obj.position.addScaledVector(dir, Math.min(d, dt * speed));
    obj.rotation.y = lerpAngle(obj.rotation.y, Math.atan2(dir.x, dir.z), 0.15);
  }
}

export function Scene() {
  const mechRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const reduced = prefersReducedMotion();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mech = mechRef.current;
    if (!mech) return;
    const store = useWorldStore.getState();
    const { phase, activeSection } = store;

    // --- mech movement ---
    if (phase === "walking" && activeSection) {
      const target = standPos(getSection(activeSection)!.position);
      moveToward(mech, target, dt, 5);
      if (mech.position.distanceTo(target) < 0.3) store.arrived();
    } else if (phase === "exiting") {
      moveToward(mech, ORIGIN, dt, 5);
      if (mech.position.distanceTo(ORIGIN) < 0.3) store.returnComplete();
    }

    // --- camera goal by phase ---
    const m = mech.position;
    if (phase === "docking" || phase === "viewing") {
      outward.copy(m).setY(0);
      if (outward.lengthSq() < 0.001) outward.set(0, 0, 1);
      else outward.normalize();
      camGoal.set(m.x - outward.x * 6 + 4, 5.5, m.z - outward.z * 6 + 4);
      lookGoal.set(m.x + outward.x * 3, 3, m.z + outward.z * 3);
      if (phase === "docking" && camera.position.distanceTo(camGoal) < 0.7) {
        store.dockComplete();
      }
    } else {
      camGoal.set(m.x, 10, m.z + 17);
      lookGoal.set(m.x, 2.5, m.z);
    }

    const k = reduced ? 1 : 1 - Math.pow(0.0015, dt);
    camera.position.lerp(camGoal, k);
    lookCurrent.lerp(lookGoal, k);
    camera.lookAt(lookCurrent);
  });

  return (
    <>
      <color attach="background" args={["#060a0e"]} />
      <fog attach="fog" args={["#060a0e", 22, 60]} />
      <ambientLight color="#22303a" intensity={0.9} />
      <directionalLight position={[8, 14, 6]} intensity={1.1} color="#aecbd8" />
      <pointLight position={[0, 6, 0]} intensity={30} distance={40} color="#35d07f" />
      <Environment />
      {worldSections.map((s) => (
        <Beacon key={s.id} section={s} />
      ))}
      <group ref={mechRef}>
        <Mech />
        <Pilot position={[0, 4.4, 0.15]} />
      </group>
    </>
  );
}
