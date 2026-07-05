# 3D World — "Mech Pilot" Design Spec

**Date:** 2026-07-05
**Owner:** Munaib PC
**Status:** Approved — pending implementation plan
**Route:** `/world` (currently a coming-soon stub; this replaces it)

## Goal

Build the interactive 3D showpiece linked from the portfolio hub's "Enter the 3D World →"
button. The user pilots a giant mech across a neon-grid world; tapping a section beacon
sends the mech there, the camera flies it into a docking bay, and a HUD panel reveals that
section's real portfolio content. The pilot is Munaib's own hooded-hacker avatar.

This is the **hybrid showpiece** decided earlier: the fast hub already ships and stays
lightweight; this heavier 3D experience lives isolated at `/world` and never slows the hub.

## Locked decisions

- **Theme:** Mech Pilot — carries the hub's terminal/HUD aesthetic into 3D.
- **Control model:** tap/click a beacon → mech auto-walks to it. Identical on desktop and
  mobile. No free-roam in v1.
- **Arrival action:** camera flies the mech into the beacon's **docking bay**, then a HUD
  panel renders that section's content ("fly into an in-world 3D scene", done leanly via a
  camera move + one reusable bay treatment + HUD — not four bespoke dioramas).
- **Player likeness:** a Ready Player Me `.glb` avatar (Munaib, hoodie outfit) as the
  pilot. Munaib generates the avatar; its URL lives in one config constant for easy swap.
- **Build approach (A — "lean showpiece, phased"):** mech built from primitives (no asset
  licensing), reuse existing hub data, ship a real v1, deepen bays later.
- **Beacons / sections:** `Projects`, `Career`, `Skills`, `Contact` — mirroring the hub.

## User flow

1. Hub "Enter the 3D World →" → `/world`.
2. Terminal-style **"INITIALIZE" boot screen** while assets load.
3. World loads: mech center on a neon grid, hooded avatar visible as pilot, HUD framing
   the view, four labelled beacons ringing the mech.
4. User taps a beacon → phase `walking`: mech turns and walks to it.
5. On arrival → phase `docking`: camera flies the mech into the docking bay.
6. Phase `viewing`: HUD **SectionPanel** shows that section's real content.
7. **"⏏ Exit bay"** → phase `exiting`: camera returns to the field, phase `idle`.
8. Persistent **"← Back to portfolio"** and **"skip to classic site"** links throughout.

## Architecture (react-three-fiber)

`/world/page.tsx` dynamically imports the experience **client-side only** (`ssr: false`)
so nothing 3D is bundled into or blocks the hub.

Components under `src/world/`, each with one responsibility:

- **WorldCanvas** — `<Canvas>`, lights, fog, camera rig, orchestration.
- **Mech** — primitive-built mech; walk-cycle animation; move-toward-target.
- **Pilot** — loads the RPM avatar via `useGLTF`; seats it in an open cockpit (visible,
  not hidden inside the mech).
- **Beacon** — clickable beacon + its docking-bay structure; reports taps to the store.
- **Environment** — neon grid + distant low-poly props.
- **Hud** — HTML overlay (pilot-cam corner, terminal readouts) + **SectionPanel**.
- **SectionPanel** — renders arrived-section content from existing data.

**State:** a small controller store (e.g. Zustand) holding `phase`, `activeSection`, and
`targetPosition`. Phase machine: `idle → walking → docking → viewing → exiting → idle`.

**Data flow:** Beacon tap → store sets `activeSection` + `targetPosition`, phase `walking`
→ Mech moves; on arrival sets phase `docking` → camera flies in, phase `viewing` →
SectionPanel reads `activeSection` and pulls from `src/data/*` → Exit sets phase `exiting`.

**Data reuse:** content comes straight from the hub's `src/data/projects.ts`,
`src/data/skills.ts`, and `src/data/profile.ts`. No duplicated content.

## Error handling & fallbacks

- **Avatar `.glb` fails to load** → fall back to a generic hooded-capsule pilot; world
  keeps working.
- **No WebGL / very low-power device** → a clean static fallback page ("3D world needs a
  modern browser") with a link to the classic hub — never a black screen.
- **`prefers-reduced-motion`** → damp camera moves and idle bob.
- **Mobile** → same tap controls; a **"reduce effects"** toggle lowers pixel ratio and
  prop count.

## Testing

- **Automated (the pure logic, where bugs hide):**
  - Phase state machine transitions (`idle→walking→docking→viewing→exiting→idle`).
  - Beacon → section-data mapping (each beacon resolves to the correct data).
  - Fallback renders when WebGL is unavailable.
- **Manual / dev-server:** visual verification of the world, walk, camera fly-in, HUD, and
  mobile layout.

## Scope

**In (v1):** neon-grid world, tap-to-move mech, RPM avatar pilot, HUD, four beacons + one
reusable docking-bay treatment, real content panels, all fallbacks above.

**Out (later):** audio (deferred — muted worlds are fine and dodge autoplay issues); unique
per-section dioramas; free-roam controls; richer bay art; downloaded GLB mech/buildings.

## Success criteria

- `/world` loads the mech world client-side without affecting hub load time.
- Tapping each of the four beacons walks the mech there and reveals the correct section's
  real content via the HUD panel.
- The hooded RPM avatar appears as the pilot (with graceful fallback).
- Works on mobile with tap controls; degrades gracefully with no WebGL / reduced motion.
- "Back to portfolio" and "skip to classic site" are always reachable.

## Dependencies

- `three`, `@react-three/fiber`, `@react-three/drei`, and a small state lib (`zustand`).
- A Ready Player Me avatar `.glb` URL (Munaib to provide; placeholder until then).
