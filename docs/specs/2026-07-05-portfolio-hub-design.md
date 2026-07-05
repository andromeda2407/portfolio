# Portfolio Hub Site — Design Spec

**Date:** 2026-07-05
**Owner:** Munaib PC
**Status:** ✅ Shipped — live at https://portfolio-lime-rho-78.vercel.app/

## Goal

Build a fast, professional, client-converting portfolio website that positions Munaib
as a generalist freelance developer who can build "whatever a client needs" — apps,
websites, and platforms. The hub links out to individual live projects and, later, to a
3D "giant world" showpiece.

This spec covers **only the hub site**. The 3D world and the four showcase projects are
separate sub-projects, each with their own spec/plan/build cycle later.

## Strategy (why this shape)

- **Breadth + one flagship.** The portfolio shows a range of project types plus one
  genuine platform (GarageConnect) to prove real capability.
- **Client conversion over dev flexing.** Modeled on Brittany Chiang's clarity + Alok
  Kiran's "shipped products with real metrics" framing, skinned with a terminal
  aesthetic. Non-technical clients (e.g. garage owners) must not get lost.
- **Ship fast, grow over time.** The hub goes live quickly with "coming soon" project
  placeholders; each project and the 3D world are added incrementally without blocking
  the launch.

## Owner details

- **Display name:** Munaib PC
- **Tagline:** "Freelance developer — I build apps, websites & platforms" (refine later)
- **Email:** munaib.pc@gmail.com
- **GitHub:** https://github.com/andromeda2407
- **LinkedIn:** https://www.linkedin.com/in/munaib-pc-72866b88/

## The four showcase projects (context, built separately)

| # | Project | Type it proves |
|---|---------|----------------|
| 🏆 | GarageConnect — two-sided garage/mechanic marketplace | Platform / marketplace (flagship) |
| 2 | Small-business website (e.g. restaurant/salon with booking) | Website / landing page |
| 3 | Analytics / reporting dashboard | Data / internal tools |
| 4 | AI-powered app (niche AI assistant/chatbot) | AI / automation |

The hub ships with these as "coming soon" cards and they are filled in as each is built.

## Sections (single-page scroll)

1. **Hero** — name, one-line pitch, two buttons: `View Projects` and `Enter the 3D World →`.
   The 3D button shows a "coming soon" state until the `/world` route exists.
2. **About** — 2–3 sentences, `$ whoami` terminal styling.
3. **Projects** — the centerpiece. GarageConnect featured larger; the other three as
   equal cards. Standard card format below.
4. **Skills / Stack** — compact grid (Frontend, Backend, AI/LLM, DevOps, etc.).
5. **Contact** — email, GitHub, LinkedIn, and a simple contact form.

## Project card format (the conversion engine)

Every card uses the same trust-building formula:

- Screenshot / thumbnail
- Project name
- One-line "what it does"
- Tech stack tags
- A metric or outcome line (e.g. "46 users · 1,200 items processed")
- `Live` and `Code` links

Standardizing this now means adding a project = dropping data into one array.

## Look & feel

- Terminal / hacker aesthetic: dark background, monospace accents, command-prompt
  flourishes (`$`, blinking cursor).
- Modern spacing and readability (Brittany-Chiang level) so non-technical clients follow
  easily.
- Mobile-first, fully responsive. Fast load. **No heavy 3D on the hub page.**

## Architecture

- **Stack:** Next.js (App Router) + Tailwind CSS.
- **Deploy:** Vercel (free). Custom domain added later (none yet).
- **Content:** all project data in a single `projects.ts` data file — adding a project =
  editing one array, no component hunting.
- **Components:** `Hero`, `About`, `ProjectCard`, `SkillsGrid`, `Contact`.
- **Contact form:** posts to a lightweight service (Formspree or a Vercel serverless
  route) — no backend to maintain.
- **3D reservation:** a `/world` route is reserved now. The `Enter the 3D World` button
  links to it. Later it becomes the react-three-fiber giant experience, fully isolated
  from the hub so it never slows the main page.

## Out of scope (for this spec)

- The 3D "giant world" experience (separate sub-project; only the route stub + link here).
- The four showcase projects themselves (separate sub-projects).
- Custom domain purchase/configuration (handled at deploy time).
- Blog, CMS, analytics, auth — YAGNI for now.

## Success criteria

- Hub deploys live on Vercel with a shareable URL.
- Loads fast and looks correct on mobile and desktop.
- Adding/updating a project requires editing only `projects.ts`.
- Contact form delivers messages to munaib.pc@gmail.com.
- `Enter the 3D World` button present (coming-soon state until `/world` is built).
