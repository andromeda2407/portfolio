# Portfolio — Progress Tracker

> Living status doc. Update this whenever you finish or start a piece so the next
> session (human or AI) knows exactly where things stand. Newest status at top of each
> section.

**Owner:** Munaib PC · **Goal:** Freelance developer portfolio to win client work as a
generalist ("I build apps, websites & platforms").

**Repo:** `/Users/munaib/Documents/personal_projects/Portfolio` ·
**GitHub:** git@github.com:andromeda2407/portfolio.git · deployed on **Vercel**.

**Live URL:** https://portfolio-lime-rho-78.vercel.app/

---

## ▶️ NEXT SESSION — start here (planned for week of 2026-07-13)

**Main task: revamp the hub layout — it has "unwanted space" and needs polish.**
Root causes (confirmed from code, not yet seen in a live screenshot):
1. **Hero dead space** — `src/components/Hero.tsx` is `min-h-[70vh]` with vertically
   centered content and NO top nav bar, so there's a big empty band at the top before the
   name (and below the buttons). This is the main offender.
2. **Heavy section padding** — every section uses `py-20` (80px top+bottom); with sparse
   placeholder content it reads as empty/spread out.
3. **Hero content left-aligned** inside a centered `max-w-5xl` → empty right side on wide
   screens.

**Revamp punch-list:**
- [ ] Add a slim **sticky top nav** (name + section links) to fill the top dead space.
- [ ] **Tighten the hero** — reduce height, start content higher, add a subtle visual on
  the right so it's not half-empty.
- [ ] **Normalize section spacing** (py-20 → ~py-12/14).
- [ ] Add a small **footer** so the page ends cleanly.
- [ ] (Optional visual check first) get a real screenshot — the Claude-for-Chrome
  extension wasn't connected; either connect it or paste a screenshot so we compare pixels.

**Bigger credibility issue (separate from layout):** all four project cards say
**"Coming soon."** To a client this reads as "no shipped work." Turn at least ONE into a
real, live, clickable project (GarageConnect flagship, or a quick-win). When a project goes
live, update `src/data/projects.ts` (`status:"live"`, add `liveUrl`/`codeUrl`, screenshot
in `public/projects/`).

**Other open items:**
- [ ] **Beacon clicks in /world** — Munaib reported only the *Contact* beacon reliably
  responded. Likely causes: the click target is only the thin pillar mesh, and/or the drei
  `<Html>` labels (esp. the oversized closest one) intercept pointer events. Fix: bigger
  invisible hit area per beacon + ensure labels don't capture pointer events.
- [ ] **Oversized "Skills" label in /world** — perspective side-effect of `distanceFactor`
  on the closest beacon's `<Html>` label. Make all four labels a uniform on-screen size.
- [ ] **Animated avatar (waiting on Munaib)** — the static Avaturn FBX loads as a T-pose
  (no animation). Munaib will upload `model.fbx` to Mixamo, pick Idle/Walking, download
  **FBX Binary, "With Skin"**, and send it. Then re-create `src/world/Avatar.tsx` (FBX via
  drei `useFBX`, auto-fit scale, wrapper-group transforms — do NOT mutate the hook object,
  it trips the react-hooks immutability lint) and swap it into `Scene.tsx` in place of
  `<Mech/>`, keeping `<Mech/>` as the Suspense fallback. Play the walk clip when
  `phase === "walking" | "exiting"`.

---

## The overall plan

A fast **hub site** that links out to individual live projects, plus a later 3D showpiece.
Each piece below is its own spec → plan → build cycle.

| # | Piece | Status |
|---|-------|--------|
| 0 | **Portfolio hub site** | ✅ **DONE** — built, deployed, live |
| 1 | 🏆 **GarageConnect** — two-sided garage/mechanic marketplace (flagship) | ⬜ Not started |
| 2 | **Business website** (e.g. restaurant/salon with booking) | ⬜ Not started |
| 3 | **Analytics / reporting dashboard** | ⬜ Not started |
| 4 | **AI-powered app** (niche AI assistant/chatbot) | ⬜ Not started |
| 5 | **3D "Mech Pilot" world** at `/world` | ✅ Built & merged — needs local visual check + avatar |

---

## ✅ Piece 0: Portfolio hub — DONE

- Next.js 15 (App Router) + Tailwind v4 + TypeScript. Terminal/hacker theme, mobile-responsive.
- Sections: Hero, About, Projects (GarageConnect flagged as flagship + 3 "coming soon"
  cards), Skills grid, Contact.
- `/world` route reserved with a coming-soon page for the future 3D showpiece.
- Contact form submits to Formspree (endpoint `xvzjlkdp`) via fetch.
- All content is data-driven in `src/data/` — **adding/updating a project = edit
  `src/data/projects.ts`** (set `status: "live"`, add `liveUrl`/`codeUrl`, drop a
  screenshot in `public/projects/`).
- 18 passing Vitest tests, clean build/lint, merged to `master`, pushed, deployed on Vercel.
- Spec: `docs/specs/2026-07-05-portfolio-hub-design.md` · Plan: `docs/plans/2026-07-05-portfolio-hub.md`

---

## ✅ Piece 5 — 3D "Mech Pilot" world — BUILT

Built with react-three-fiber at `/world`, client-side only, merged to `master`. 30 passing
tests, clean build/tsc/lint. Concept: pilot a giant mech across a neon-grid world; tap a
beacon (Projects/Career/Skills/Contact) → mech walks there → camera flies into a docking
bay → HUD panel shows that section's real content. Spec:
`docs/specs/2026-07-05-3d-world-mech-pilot-design.md` · Plan:
`docs/plans/2026-07-05-3d-world-mech-pilot.md`.

**Two things left for Munaib:**
1. **Visual check** — automated tests can't see the 3D. Run `npm run dev` and open
   `http://localhost:3000/world` to confirm the mech renders, tap-to-walk works, and the
   camera fly-in + HUD panels feel right.
2. **Add your avatar** — export a hoodie `.glb` from Avaturn (avaturn.me) or MetaPerson
   (Ready Player Me shut down 2026-01-31), save to `public/avatar/pilot.glb`, and set
   `AVATAR_ENABLED = true` in `src/world/config.ts`. Until then a hooded capsule stands in.

## ▶️ Also queued: Piece 1 — GarageConnect (flagship)

Not started. When resuming: brainstorm requirements → write spec → write plan → build.
It's a two-sided marketplace: garages sign up; drivers search for nearby mechanics for
car/bike repairs; booking flow. This is the centerpiece that proves you can build a real
platform, so give it the most polish.

When it goes live, update its card in `src/data/projects.ts` and this tracker.

---

## How to resume next session

1. Read this file + `docs/specs/` and `docs/plans/` for context.
2. Pick the next ⬜ piece (currently GarageConnect).
3. Run through: brainstorm → spec → plan → build → deploy → update this tracker.

## Commands

```bash
cd "/Users/munaib/Documents/personal_projects/Portfolio"
npm run dev      # local dev at http://localhost:3000
npm test         # run tests
npm run build    # production build
```
