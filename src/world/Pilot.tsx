"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { AVATAR_URL, AVATAR_ENABLED } from "./config";

function HoodedCapsule() {
  return (
    <group scale={0.5}>
      <mesh position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.35, 0.7, 4, 8]} />
        <meshStandardMaterial color="#20303a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <coneGeometry args={[0.5, 0.7, 8]} />
        <meshStandardMaterial color="#16232b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.0, 0.28]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#35d07f" emissive="#35d07f" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function AvatarModel() {
  const { scene } = useGLTF(AVATAR_URL);
  return <primitive object={scene} scale={1.0} />;
}

export function Pilot(props: ThreeElements["group"]) {
  return <group {...props}>{AVATAR_ENABLED ? <AvatarModel /> : <HoodedCapsule />}</group>;
}
