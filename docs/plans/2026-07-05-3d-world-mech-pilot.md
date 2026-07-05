# 3D World "Mech Pilot" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/world` react-three-fiber showpiece: pilot a mech across a neon-grid world, tap a beacon to walk there, camera flies into a docking bay, and a HUD panel shows that section's real portfolio content.

**Architecture:** All 3D lives in `src/world/`, loaded client-side only (`ssr:false`) from `/world` so it never touches the hub bundle. Pure, testable logic (phase state machine, beacon→section mapping, WebGL detection) is isolated in plain modules with unit tests; the 3D scene components are verified manually. A Zustand store drives a phase machine (`idle → walking → docking → viewing → exiting → idle`) that both the scene (mech movement, camera) and the HUD read from.

**Tech Stack:** Next.js 15, TypeScript, three, @react-three/fiber, @react-three/drei, zustand, Vitest.

**Working directory:** All paths relative to `/Users/munaib/Documents/personal_projects/Portfolio`. Work on branch `build/mech-world` (created in Task 0).

---

## File Structure

- `src/world/sections.ts` — the 4 world sections (id, label, beacon position) + `getSection` + `sectionSummary` (testable mapping).
- `src/world/store.ts` — Zustand store: phase machine + `activeSection` (testable).
- `src/world/webgl.ts` — `isWebGLAvailable()` detection (testable).
- `src/world/config.ts` — avatar `.glb` path + enable flag (single swap point).
- `src/world/Environment.tsx` — neon grid, ground, distant props.
- `src/world/Mech.tsx` — primitive mech + walk-cycle animation.
- `src/world/Pilot.tsx` — hooded avatar (GLB when enabled, capsule fallback).
- `src/world/Beacon.tsx` — clickable beacon + docking-bay arch + label.
- `src/world/Scene.tsx` — in-Canvas contents + the useFrame controller (mech movement + camera).
- `src/world/Hud.tsx` — HTML overlay: readouts, nav links, section panel container.
- `src/world/SectionPanel.tsx` — renders arrived-section content from hub data.
- `src/world/World.tsx` — wrapper `<div>` + `<Canvas><Scene/></Canvas>` + `<Hud/>`.
- `src/world/Fallback.tsx` — static no-WebGL page (testable).
- `src/world/WorldClient.tsx` — `'use client'` gate: boot screen → WebGL check → World or Fallback.
- `src/app/world/page.tsx` — server page (metadata) rendering `<WorldClient/>`. Replaces the coming-soon stub.

**Testing note:** Only `sections.ts`, `store.ts`, `webgl.ts`, and `Fallback.tsx` get automated tests (none import `three`, so the suite stays fast). All `three`/fiber components are verified via the manual dev-server checklist in Task 14. The old `src/app/world/page.test.tsx` stub test is removed in Task 12 because the page's behavior changes.

---

## Task 0: Branch + install 3D dependencies

**Files:** `package.json` (deps)

- [ ] **Step 1: Create the feature branch**

```bash
cd "/Users/munaib/Documents/personal_projects/Portfolio"
git checkout master
git checkout -b build/mech-world
```

- [ ] **Step 2: Install dependencies**

```bash
npm install three @react-three/fiber @react-three/drei zustand
```

- [ ] **Step 3: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds (nothing uses the new deps yet).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three, r3f, drei, zustand"
```

---

## Task 1: World sections (beacon → data mapping)

**Files:**
- Create: `src/world/sections.ts`
- Test: `src/world/sections.test.ts`

- [ ] **Step 1: Write the failing test**

`src/world/sections.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { worldSections, getSection, sectionSummary } from "./sections";

describe("world sections", () => {
  it("has the four beacon sections", () => {
    expect(worldSections.map((s) => s.id).sort()).toEqual([
      "career",
      "contact",
      "projects",
      "skills",
    ]);
  });

  it("each section has a label and a 3D position", () => {
    worldSections.forEach((s) => {
      expect(s.label).toBeTruthy();
      expect(s.position).toHaveLength(3);
    });
  });

  it("getSection resolves a section by id", () => {
    expect(getSection("projects")?.label).toBe("Projects");
    expect(getSection("skills")?.label).toBe("Skills");
  });

  it("sectionSummary maps each beacon to real data", () => {
    expect(sectionSummary("projects")).toMatch(/project/i);
    expect(sectionSummary("skills")).toMatch(/skill/i);
    expect(sectionSummary("contact")).toContain("@");
    expect(sectionSummary("career")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- world/sections`
Expected: FAIL — cannot find module `./sections`.

- [ ] **Step 3: Create `src/world/sections.ts`**

```ts
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { profile } from "@/data/profile";

export type SectionId = "projects" | "career" | "skills" | "contact";

export type WorldSection = {
  id: SectionId;
  label: string;
  position: [number, number, number];
};

export const worldSections: WorldSection[] = [
  { id: "projects", label: "Projects", position: [9, 0, 0] },
  { id: "career", label: "Career", position: [-9, 0, 0] },
  { id: "skills", label: "Skills", position: [0, 0, 9] },
  { id: "contact", label: "Contact", position: [0, 0, -9] },
];

export function getSection(id: SectionId): WorldSection | undefined {
  return worldSections.find((s) => s.id === id);
}

export function sectionSummary(id: SectionId): string {
  switch (id) {
    case "projects":
      return `${projects.length} projects`;
    case "skills":
      return `${skillGroups.length} skill areas`;
    case "career":
      return profile.tagline;
    case "contact":
      return profile.email;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- world/sections`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/world/sections.ts src/world/sections.test.ts
git commit -m "feat: world sections + beacon-to-data mapping"
```

---

## Task 2: Phase state machine store

**Files:**
- Create: `src/world/store.ts`
- Test: `src/world/store.test.ts`

- [ ] **Step 1: Write the failing test**

`src/world/store.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useWorldStore } from "./store";

function reset() {
  useWorldStore.setState({ phase: "idle", activeSection: null });
}

describe("world store phase machine", () => {
  beforeEach(reset);

  it("starts idle with no active section", () => {
    const s = useWorldStore.getState();
    expect(s.phase).toBe("idle");
    expect(s.activeSection).toBeNull();
  });

  it("runs the full happy-path cycle", () => {
    const s = () => useWorldStore.getState();
    s().selectBeacon("projects");
    expect(s().phase).toBe("walking");
    expect(s().activeSection).toBe("projects");
    s().arrived();
    expect(s().phase).toBe("docking");
    s().dockComplete();
    expect(s().phase).toBe("viewing");
    s().exitBay();
    expect(s().phase).toBe("exiting");
    s().returnComplete();
    expect(s().phase).toBe("idle");
    expect(s().activeSection).toBeNull();
  });

  it("ignores selectBeacon unless idle", () => {
    const s = () => useWorldStore.getState();
    s().selectBeacon("projects");
    s().selectBeacon("skills"); // ignored, still walking to projects
    expect(s().activeSection).toBe("projects");
  });

  it("ignores out-of-order transitions", () => {
    const s = () => useWorldStore.getState();
    s().dockComplete(); // not docking
    expect(s().phase).toBe("idle");
    s().arrived(); // not walking
    expect(s().phase).toBe("idle");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- world/store`
Expected: FAIL — cannot find module `./store`.

- [ ] **Step 3: Create `src/world/store.ts`**

```ts
import { create } from "zustand";
import type { SectionId } from "./sections";

export type Phase = "idle" | "walking" | "docking" | "viewing" | "exiting";

type WorldState = {
  phase: Phase;
  activeSection: SectionId | null;
  selectBeacon: (id: SectionId) => void;
  arrived: () => void;
  dockComplete: () => void;
  exitBay: () => void;
  returnComplete: () => void;
};

export const useWorldStore = create<WorldState>((set, get) => ({
  phase: "idle",
  activeSection: null,
  selectBeacon: (id) => {
    if (get().phase !== "idle") return;
    set({ phase: "walking", activeSection: id });
  },
  arrived: () => {
    if (get().phase !== "walking") return;
    set({ phase: "docking" });
  },
  dockComplete: () => {
    if (get().phase !== "docking") return;
    set({ phase: "viewing" });
  },
  exitBay: () => {
    if (get().phase !== "viewing") return;
    set({ phase: "exiting" });
  },
  returnComplete: () => {
    if (get().phase !== "exiting") return;
    set({ phase: "idle", activeSection: null });
  },
}));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- world/store`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/world/store.ts src/world/store.test.ts
git commit -m "feat: world phase state machine store"
```

---

## Task 3: WebGL detection

**Files:**
- Create: `src/world/webgl.ts`
- Test: `src/world/webgl.test.ts`

- [ ] **Step 1: Write the failing test**

`src/world/webgl.test.ts`:

```ts
import { describe, it, expect, afterEach, vi } from "vitest";
import { isWebGLAvailable } from "./webgl";

afterEach(() => vi.restoreAllMocks());

describe("isWebGLAvailable", () => {
  it("returns false when getContext yields no webgl context (jsdom default)", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(isWebGLAvailable()).toBe(false);
  });

  it("returns true when a webgl context is available", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      {} as unknown as RenderingContext
    );
    expect(isWebGLAvailable()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- world/webgl`
Expected: FAIL — cannot find module `./webgl`.

- [ ] **Step 3: Create `src/world/webgl.ts`**

```ts
export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- world/webgl`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/world/webgl.ts src/world/webgl.test.ts
git commit -m "feat: webgl availability detection"
```

---

## Task 4: Static fallback page

**Files:**
- Create: `src/world/Fallback.tsx`
- Test: `src/world/Fallback.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/world/Fallback.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Fallback } from "./Fallback";

describe("Fallback", () => {
  it("explains WebGL is needed and links back to the hub", () => {
    render(<Fallback />);
    expect(screen.getByRole("heading", { name: /modern browser/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to portfolio/i })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- world/Fallback`
Expected: FAIL — cannot find module `./Fallback`.

- [ ] **Step 3: Create `src/world/Fallback.tsx`**

```tsx
export function Fallback() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#060a0e",
        color: "#d6e2e9",
        fontFamily: "ui-monospace, Menlo, monospace",
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1 style={{ color: "#35d07f" }}>3D world needs a modern browser</h1>
      <p style={{ color: "#7d95a3", maxWidth: 420 }}>
        Your browser or device can&apos;t run WebGL. No problem — everything is on the main
        site.
      </p>
      <a href="/" style={{ marginTop: 24, color: "#35d07f" }}>
        ← Back to portfolio
      </a>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- world/Fallback`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/world/Fallback.tsx src/world/Fallback.test.tsx
git commit -m "feat: static no-webgl fallback page"
```

---

## Task 5: Avatar config

**Files:**
- Create: `src/world/config.ts`

- [ ] **Step 1: Create `src/world/config.ts`**

```ts
// Single swap point for the pilot avatar.
// Export a hoodie avatar as .glb from Avaturn (avaturn.me) or MetaPerson,
// drop it at `public/avatar/pilot.glb`, then set AVATAR_ENABLED = true.
// Until then, the Pilot renders a generic hooded capsule.
export const AVATAR_URL = "/avatar/pilot.glb";
export const AVATAR_ENABLED = false;
```

- [ ] **Step 2: Commit**

```bash
git add src/world/config.ts
git commit -m "feat: pilot avatar config (capsule fallback by default)"
```

---

## Task 6: Environment (neon grid + props)

**Files:**
- Create: `src/world/Environment.tsx`

- [ ] **Step 1: Create `src/world/Environment.tsx`**

```tsx
"use client";

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
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: build succeeds (component compiles even though not yet rendered).

- [ ] **Step 3: Commit**

```bash
git add src/world/Environment.tsx
git commit -m "feat: neon-grid environment"
```

---

## Task 7: Mech

**Files:**
- Create: `src/world/Mech.tsx`

- [ ] **Step 1: Create `src/world/Mech.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/world/Mech.tsx
git commit -m "feat: primitive mech with walk cycle"
```

---

## Task 8: Pilot (avatar with capsule fallback)

**Files:**
- Create: `src/world/Pilot.tsx`

- [ ] **Step 1: Create `src/world/Pilot.tsx`**

```tsx
"use client";

import { useGLTF } from "@react-three/drei";
import type { GroupProps } from "@react-three/fiber";
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

export function Pilot(props: GroupProps) {
  return <group {...props}>{AVATAR_ENABLED ? <AvatarModel /> : <HoodedCapsule />}</group>;
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: build succeeds. (AVATAR_ENABLED is false, so `useGLTF` is never called and no `.glb` is needed.)

- [ ] **Step 3: Commit**

```bash
git add src/world/Pilot.tsx
git commit -m "feat: pilot with hooded-capsule fallback"
```

---

## Task 9: Beacon (clickable + docking bay + label)

**Files:**
- Create: `src/world/Beacon.tsx`

- [ ] **Step 1: Create `src/world/Beacon.tsx`**

```tsx
"use client";

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
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/world/Beacon.tsx
git commit -m "feat: clickable beacon with docking-bay arch"
```

---

## Task 10: Scene (mech movement + camera controller)

**Files:**
- Create: `src/world/Scene.tsx`

- [ ] **Step 1: Create `src/world/Scene.tsx`**

```tsx
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

    const k = 1 - Math.pow(0.0015, dt);
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
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/world/Scene.tsx
git commit -m "feat: scene with mech movement + phase-driven camera"
```

---

## Task 11: HUD + SectionPanel + World wrapper

**Files:**
- Create: `src/world/SectionPanel.tsx`
- Create: `src/world/Hud.tsx`
- Create: `src/world/World.tsx`

- [ ] **Step 1: Create `src/world/SectionPanel.tsx`**

```tsx
"use client";

import { useWorldStore } from "./store";
import { getSection } from "./sections";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { profile } from "@/data/profile";

const card = {
  border: "1px solid #1e2a33",
  borderRadius: 8,
  padding: 12,
} as const;

export function SectionPanel() {
  const id = useWorldStore((s) => s.activeSection);
  if (!id) return null;
  const section = getSection(id);

  return (
    <div>
      <h2 style={{ margin: "0 0 12px", color: "#35d07f", fontFamily: "ui-monospace, Menlo, monospace" }}>
        {section?.label}
      </h2>

      {id === "projects" && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {projects.map((p) => (
            <li key={p.slug} style={card}>
              <strong>{p.name}</strong>
              <div style={{ fontSize: 13, color: "#7d95a3" }}>{p.tagline}</div>
              <div style={{ fontSize: 11, color: "#35d07f", marginTop: 4 }}>{p.tech.join(" · ")}</div>
            </li>
          ))}
        </ul>
      )}

      {id === "skills" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {skillGroups.map((g) => (
            <div key={g.label} style={card}>
              <strong style={{ color: "#35d07f" }}>{g.label}</strong>
              <div style={{ fontSize: 13, color: "#7d95a3" }}>{g.items.join(", ")}</div>
            </div>
          ))}
        </div>
      )}

      {id === "career" && <p style={{ color: "#d6e2e9", lineHeight: 1.6 }}>{profile.blurb}</p>}

      {id === "contact" && (
        <div style={{ display: "grid", gap: 8 }}>
          <a href={`mailto:${profile.email}`} style={{ color: "#35d07f" }}>
            {profile.email}
          </a>
          <a href={profile.github} style={{ color: "#35d07f" }}>
            GitHub
          </a>
          <a href={profile.linkedin} style={{ color: "#35d07f" }}>
            LinkedIn
          </a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/world/Hud.tsx`**

```tsx
"use client";

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
        <a href="/" style={{ color: "#35d07f", fontSize: 12, textDecoration: "none" }}>
          ← Back to portfolio
        </a>
        <a href="/#projects" style={{ color: "#5f7684", fontSize: 12, textDecoration: "none" }}>
          skip to classic site
        </a>
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
```

- [ ] **Step 3: Create `src/world/World.tsx`**

```tsx
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
```

- [ ] **Step 4: Verify build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/world/SectionPanel.tsx src/world/Hud.tsx src/world/World.tsx
git commit -m "feat: HUD, section panel, and world wrapper"
```

---

## Task 12: Wire up the /world route (replace stub)

**Files:**
- Create: `src/world/WorldClient.tsx`
- Modify: `src/app/world/page.tsx`
- Delete: `src/app/world/page.test.tsx`

- [ ] **Step 1: Create `src/world/WorldClient.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isWebGLAvailable } from "./webgl";
import { Fallback } from "./Fallback";

function BootScreen() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060a0e",
        color: "#35d07f",
        fontFamily: "ui-monospace, Menlo, monospace",
      }}
    >
      <span>▸ INITIALIZING MECH SYSTEMS…</span>
    </main>
  );
}

const World = dynamic(() => import("./World").then((m) => m.World), {
  ssr: false,
  loading: BootScreen,
});

export function WorldClient() {
  const [webgl, setWebgl] = useState<null | boolean>(null);
  useEffect(() => {
    setWebgl(isWebGLAvailable());
  }, []);

  if (webgl === null) return <BootScreen />;
  if (!webgl) return <Fallback />;
  return <World />;
}
```

- [ ] **Step 2: Delete the old stub test**

The `/world` page no longer shows a "coming soon" stub, so its test is obsolete.

```bash
git rm src/app/world/page.test.tsx
```

- [ ] **Step 3: Replace `src/app/world/page.tsx`**

```tsx
import { WorldClient } from "@/world/WorldClient";

export const metadata = { title: "3D World — Mech Pilot" };

export default function WorldPage() {
  return <WorldClient />;
}
```

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: all tests pass (hub tests + new world logic tests; the deleted stub test is gone).

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds; `/world` is present in the route list.

- [ ] **Step 6: Commit**

```bash
git add src/world/WorldClient.tsx src/app/world/page.tsx
git commit -m "feat: mount mech world at /world with WebGL gate"
```

---

## Task 13: Respect prefers-reduced-motion

**Files:**
- Create: `src/world/motion.ts`
- Test: `src/world/motion.test.ts`
- Modify: `src/world/World.tsx`, `src/world/Scene.tsx`, `src/world/Mech.tsx`

- [ ] **Step 1: Write the failing test**

`src/world/motion.test.ts`:

```ts
import { describe, it, expect, afterEach, vi } from "vitest";
import { prefersReducedMotion } from "./motion";

afterEach(() => vi.restoreAllMocks());

describe("prefersReducedMotion", () => {
  it("is false when the media query does not match", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    expect(prefersReducedMotion()).toBe(false);
  });

  it("is true when the reduced-motion media query matches", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") }));
    expect(prefersReducedMotion()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- world/motion`
Expected: FAIL — cannot find module `./motion`.

- [ ] **Step 3: Create `src/world/motion.ts`**

```ts
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- world/motion`
Expected: PASS (2 tests).

- [ ] **Step 5: Lower pixel ratio in `src/world/World.tsx`**

Replace the `<Canvas ...>` opening tag so the DPR caps at 1 under reduced motion:

```tsx
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
```

- [ ] **Step 6: Snap the camera in `src/world/Scene.tsx`**

At the top of `Scene`, read the flag once, and use a snappier easing constant when set. Add the import and the two changes:

```tsx
import { prefersReducedMotion } from "./motion";
```

Inside `Scene`, just before `useFrame`:

```tsx
  const reduced = prefersReducedMotion();
```

Then replace the easing line inside `useFrame`:

```tsx
    const k = reduced ? 1 : 1 - Math.pow(0.0015, dt);
```

(With `k = 1` the camera jumps straight to its goal each frame — no smoothing motion.)

- [ ] **Step 7: Damp the bob in `src/world/Mech.tsx`**

Add the import:

```tsx
import { prefersReducedMotion } from "./motion";
```

Inside `Mech`, before `useFrame`:

```tsx
  const reduced = prefersReducedMotion();
```

Replace the bob line in `useFrame`:

```tsx
    if (bob.current) bob.current.position.y = reduced ? 0 : Math.abs(Math.sin(walk.current)) * 0.12;
```

- [ ] **Step 8: Verify tests + build**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds.

- [ ] **Step 9: Commit**

```bash
git add src/world/motion.ts src/world/motion.test.ts src/world/World.tsx src/world/Scene.tsx src/world/Mech.tsx
git commit -m "feat: respect prefers-reduced-motion"
```

---

## Task 14: Final verification (automated + manual)

**Files:** none (verification only)

- [ ] **Step 1: Full green check**

Run: `npm test && npm run build && npx tsc --noEmit && npm run lint`
Expected: tests pass, build succeeds, no type errors, no lint errors.

- [ ] **Step 2: Manual dev-server checklist**

Run `npm run dev`, open http://localhost:3000/world, and confirm:
- Boot screen shows briefly, then the neon-grid world with the mech and four labelled beacons.
- The hooded capsule pilot sits on the mech.
- Clicking a beacon: the mech turns and walks to it, the camera flies in, and after it settles the section panel appears with the correct real content (Projects/Career/Skills/Contact).
- "⏏ Exit bay" returns the mech to center and closes the panel.
- HUD readouts show the changing MODE (phase); "← Back to portfolio" returns to `/`.
- Narrow the window (mobile size): tap controls still work and the panel is readable.

- [ ] **Step 3: Verify the fallback path**

In the browser devtools, run the page with WebGL disabled (or temporarily make `isWebGLAvailable` return false) and confirm the `Fallback` page renders with the "Back to portfolio" link. Revert any temporary change.

- [ ] **Step 4: Stop the dev server.** No commit needed (verification only).

---

## Post-plan follow-ups (not in this plan)

- Add the real avatar: export a hoodie `.glb` from Avaturn/MetaPerson → save to `public/avatar/pilot.glb` → set `AVATAR_ENABLED = true` in `src/world/config.ts`. If the model errors, wrap `AvatarModel` in a `<Suspense>` + error boundary.
- Deepen individual docking bays (per-section 3D dioramas), add ambient audio, and consider optional free-roam — all deferred per the spec.
- After merge + deploy, update `PROGRESS.md` (mark the 3D world ✅ and record that `/world` is live).
