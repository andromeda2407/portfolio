# Portfolio — Progress Tracker

> Living status doc. Update this whenever you finish or start a piece so the next
> session (human or AI) knows exactly where things stand. Newest status at top of each
> section.

**Owner:** Munaib PC · **Goal:** Freelance developer portfolio to win client work as a
generalist ("I build apps, websites & platforms").

**Repo:** `/Users/munaib/Documents/personal_projects/Portfolio` ·
**GitHub:** git@github.com:andromeda2407/portfolio.git · deployed on **Vercel**.

**Live URL:** _<add your Vercel URL here>_

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
| 5 | **3D "giant world"** showpiece at `/world` (start 3D-lite) | ⬜ Stub only (coming-soon page) |

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

## ▶️ Next up: Piece 1 — GarageConnect (flagship)

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
