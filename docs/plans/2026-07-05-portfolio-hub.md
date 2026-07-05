# Portfolio Hub Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a fast, mobile-first, terminal-styled freelance portfolio hub (Next.js + Tailwind) that lists projects via one data file, has a working contact form, reserves a `/world` route for the future 3D showpiece, and deploys on Vercel.

**Architecture:** Next.js App Router (TypeScript) single-page scroll. All project content lives in one typed data module (`src/data/projects.ts`); presentational section components consume it. A stub `/world` route is reserved for the later react-three-fiber 3D world. Contact form posts to Formspree (no backend). Vitest + React Testing Library for component/data tests.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Vitest, @testing-library/react, jsdom, Formspree, Vercel.

**Working directory:** All paths are relative to `/Users/munaib/Documents/personal_projects/Portfolio` (its own git repo — NOT the "Front reporting" repo).

---

## File Structure

- `src/data/projects.ts` — `Project` type + the projects array (single source of truth). **Add a project = edit this file.**
- `src/data/profile.ts` — owner details (name, tagline, socials, email) in one place.
- `src/data/skills.ts` — skills grid data.
- `src/components/Hero.tsx` — hero with name, pitch, CTA buttons.
- `src/components/About.tsx` — `$ whoami` about block.
- `src/components/ProjectCard.tsx` — single reusable project card.
- `src/components/Projects.tsx` — projects section, maps over data, features the flagship.
- `src/components/SkillsGrid.tsx` — skills/stack grid.
- `src/components/Contact.tsx` — email/socials + Formspree contact form.
- `src/app/page.tsx` — assembles all sections.
- `src/app/layout.tsx` — root layout, fonts, metadata (from create-next-app, edited).
- `src/app/globals.css` — Tailwind + terminal theme tokens.
- `src/app/world/page.tsx` — "coming soon" stub for the 3D world.
- Test files colocated in `src/**/__tests__/` or as `*.test.tsx` next to source.

---

## Task 0: Scaffold the Next.js project

**Files:**
- Create: whole Next.js app in repo root.

- [ ] **Step 1: Scaffold with create-next-app**

Run (from repo root; `.` targets current dir, which already has `.git` and `docs/`):

```bash
cd /Users/munaib/Documents/personal_projects/Portfolio
npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --import-alias "@/*" --use-npm
```

If prompted that the directory is not empty, choose to proceed (it only contains `.git`, `docs/`, `.gitignore`).

- [ ] **Step 2: Verify dev server boots**

Run:

```bash
npm run dev
```

Expected: server starts on http://localhost:3000. Open it, confirm the default Next page renders, then stop the server (Ctrl+C).

- [ ] **Step 3: Commit the scaffold**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind app"
```

---

## Task 1: Test infrastructure (Vitest + React Testing Library)

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (add `test` script)

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 4: Add test script to `package.json`**

In the `"scripts"` object add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Add a sanity test to confirm the harness runs**

Create `src/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 7: Delete the sanity test and commit**

```bash
rm src/sanity.test.ts
git add -A
git commit -m "chore: add vitest + react testing library"
```

---

## Task 2: Profile data module

**Files:**
- Create: `src/data/profile.ts`
- Test: `src/data/profile.test.ts`

- [ ] **Step 1: Write the failing test**

`src/data/profile.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { profile } from "./profile";

describe("profile", () => {
  it("has core identity fields", () => {
    expect(profile.name).toBe("Munaib PC");
    expect(profile.email).toBe("munaib.pc@gmail.com");
  });

  it("has GitHub and LinkedIn URLs", () => {
    expect(profile.github).toContain("github.com/andromeda2407");
    expect(profile.linkedin).toContain("linkedin.com/in/munaib-pc");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- profile`
Expected: FAIL — cannot find module `./profile`.

- [ ] **Step 3: Create `src/data/profile.ts`**

```ts
export const profile = {
  name: "Munaib PC",
  tagline: "Freelance developer — I build apps, websites & platforms",
  blurb:
    "I design and ship production software end-to-end — from marketplaces and web apps to dashboards and AI tools. Tell me what you need built and I'll make it real.",
  email: "munaib.pc@gmail.com",
  github: "https://github.com/andromeda2407",
  linkedin: "https://www.linkedin.com/in/munaib-pc-72866b88/",
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- profile`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/profile.ts src/data/profile.test.ts
git commit -m "feat: add profile data module"
```

---

## Task 3: Projects data module

**Files:**
- Create: `src/data/projects.ts`
- Test: `src/data/projects.test.ts`

- [ ] **Step 1: Write the failing test**

`src/data/projects.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { projects, type Project } from "./projects";

describe("projects", () => {
  it("has four showcase projects", () => {
    expect(projects).toHaveLength(4);
  });

  it("has exactly one featured (flagship) project and it is GarageConnect", () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].slug).toBe("garageconnect");
  });

  it("every project has the required card fields", () => {
    projects.forEach((p: Project) => {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(Array.isArray(p.tech)).toBe(true);
      expect(p.tech.length).toBeGreaterThan(0);
      expect(["live", "coming-soon"]).toContain(p.status);
    });
  });

  it("live projects must have a live URL", () => {
    projects
      .filter((p) => p.status === "live")
      .forEach((p) => expect(p.liveUrl).toBeTruthy());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- projects`
Expected: FAIL — cannot find module `./projects`.

- [ ] **Step 3: Create `src/data/projects.ts`**

```ts
export type Project = {
  slug: string;
  name: string;
  tagline: string; // one-line "what it does"
  tech: string[];
  metric?: string; // outcome / metric line
  image?: string; // screenshot path under /public
  liveUrl?: string;
  codeUrl?: string;
  featured?: boolean;
  status: "live" | "coming-soon";
};

export const projects: Project[] = [
  {
    slug: "garageconnect",
    name: "GarageConnect",
    tagline:
      "A two-sided marketplace where garages sign up and drivers find nearby mechanics for car & bike repairs.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Auth", "Maps API"],
    metric: "Flagship platform · full signup, search & booking flow",
    image: "/projects/garageconnect.png",
    featured: true,
    status: "coming-soon",
  },
  {
    slug: "business-website",
    name: "Business Website",
    tagline:
      "A polished small-business site with online booking — the kind local shops hire for every day.",
    tech: ["Next.js", "Tailwind", "CMS"],
    metric: "Responsive marketing site + booking",
    image: "/projects/business-website.png",
    status: "coming-soon",
  },
  {
    slug: "analytics-dashboard",
    name: "Analytics Dashboard",
    tagline:
      "A reporting dashboard that turns raw business data into clear, actionable charts.",
    tech: ["Next.js", "Charts", "API integration"],
    metric: "Real-time reporting & data automation",
    image: "/projects/analytics-dashboard.png",
    status: "coming-soon",
  },
  {
    slug: "ai-app",
    name: "AI Assistant App",
    tagline:
      "An AI-powered assistant that answers questions and automates a niche workflow.",
    tech: ["Next.js", "Claude API", "Vector search"],
    metric: "LLM-powered product",
    image: "/projects/ai-app.png",
    status: "coming-soon",
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- projects`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts src/data/projects.test.ts
git commit -m "feat: add projects data module"
```

---

## Task 4: Skills data module

**Files:**
- Create: `src/data/skills.ts`
- Test: `src/data/skills.test.ts`

- [ ] **Step 1: Write the failing test**

`src/data/skills.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { skillGroups } from "./skills";

describe("skillGroups", () => {
  it("has at least three categories", () => {
    expect(skillGroups.length).toBeGreaterThanOrEqual(3);
  });

  it("every group has a label and non-empty items", () => {
    skillGroups.forEach((g) => {
      expect(g.label).toBeTruthy();
      expect(g.items.length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- skills`
Expected: FAIL — cannot find module `./skills`.

- [ ] **Step 3: Create `src/data/skills.ts`**

```ts
export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "REST APIs", "PostgreSQL", "Auth"] },
  { label: "AI / LLM", items: ["Claude API", "Prompt engineering", "RAG"] },
  { label: "Tooling & Deploy", items: ["Git", "Vercel", "CI/CD"] },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- skills`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/skills.ts src/data/skills.test.ts
git commit -m "feat: add skills data module"
```

---

## Task 5: Terminal theme tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace `globals.css` body/theme with terminal tokens**

Append (or replace default theme block in) `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  --bg: #0a0e12;
  --panel: #10161c;
  --text: #d6e2e9;
  --muted: #7d95a3;
  --accent: #35d07f; /* terminal green */
  --border: #1e2a33;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.prompt::before {
  content: "$ ";
  color: var(--accent);
}

.cursor::after {
  content: "▋";
  color: var(--accent);
  animation: blink 1s steps(2, start) infinite;
}

@keyframes blink {
  to { visibility: hidden; }
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: build succeeds (Tailwind v4 compiles the CSS).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: terminal theme tokens"
```

---

## Task 6: ProjectCard component

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Test: `src/components/ProjectCard.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/ProjectCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/data/projects";

const base: Project = {
  slug: "demo",
  name: "Demo Project",
  tagline: "Does a demo thing.",
  tech: ["Next.js", "TypeScript"],
  status: "coming-soon",
};

describe("ProjectCard", () => {
  it("renders name, tagline and tech tags", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText("Demo Project")).toBeInTheDocument();
    expect(screen.getByText("Does a demo thing.")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("shows a Coming soon state when not live", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it("shows Live and Code links when the project is live", () => {
    const live: Project = {
      ...base,
      status: "live",
      liveUrl: "https://example.com",
      codeUrl: "https://github.com/x/y",
    };
    render(<ProjectCard project={live} />);
    expect(screen.getByRole("link", { name: /live/i })).toHaveAttribute(
      "href",
      "https://example.com"
    );
    expect(screen.getByRole("link", { name: /code/i })).toHaveAttribute(
      "href",
      "https://github.com/x/y"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ProjectCard`
Expected: FAIL — cannot find module `./ProjectCard`.

- [ ] **Step 3: Create `src/components/ProjectCard.tsx`**

```tsx
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const isLive = project.status === "live";
  return (
    <article
      className="flex flex-col rounded-lg border p-5"
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>
          {project.name}
        </h3>
        {project.featured && (
          <span className="text-xs" style={{ color: "var(--accent)" }}>
            ★ flagship
          </span>
        )}
      </div>

      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        {project.tagline}
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <li
            key={t}
            className="rounded px-2 py-0.5 text-xs"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {t}
          </li>
        ))}
      </ul>

      {project.metric && (
        <p className="mt-3 text-xs" style={{ color: "var(--accent)" }}>
          {project.metric}
        </p>
      )}

      <div className="mt-4 flex gap-4 text-sm">
        {isLive ? (
          <>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)" }}
              >
                Live →
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text)" }}
              >
                Code
              </a>
            )}
          </>
        ) : (
          <span style={{ color: "var(--muted)" }}>Coming soon</span>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- ProjectCard`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/ProjectCard.test.tsx
git commit -m "feat: add ProjectCard component"
```

---

## Task 7: Projects section

**Files:**
- Create: `src/components/Projects.tsx`
- Test: `src/components/Projects.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/Projects.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Projects } from "./Projects";

describe("Projects section", () => {
  it("renders a heading and all four project names", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByText("GarageConnect")).toBeInTheDocument();
    expect(screen.getByText("Business Website")).toBeInTheDocument();
    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
    expect(screen.getByText("AI Assistant App")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Projects`
Expected: FAIL — cannot find module `./Projects`.

- [ ] **Step 3: Create `src/components/Projects.tsx`**

```tsx
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="prompt text-2xl font-bold" style={{ color: "var(--text)" }}>
        projects
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        A range of what I build — with one flagship platform.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Projects`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects.tsx src/components/Projects.test.tsx
git commit -m "feat: add Projects section"
```

---

## Task 8: Hero component

**Files:**
- Create: `src/components/Hero.tsx`
- Test: `src/components/Hero.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/Hero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders name, tagline and both CTA buttons", () => {
    render(<Hero />);
    expect(screen.getByText("Munaib PC")).toBeInTheDocument();
    expect(screen.getByText(/apps, websites & platforms/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view projects/i })).toHaveAttribute(
      "href",
      "#projects"
    );
    expect(screen.getByRole("link", { name: /3d world/i })).toHaveAttribute(
      "href",
      "/world"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Hero`
Expected: FAIL — cannot find module `./Hero`.

- [ ] **Step 3: Create `src/components/Hero.tsx`**

```tsx
import Link from "next/link";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-6">
      <p className="prompt text-sm" style={{ color: "var(--accent)" }}>
        whoami
      </p>
      <h1 className="mt-3 text-4xl font-bold sm:text-6xl" style={{ color: "var(--text)" }}>
        {profile.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--muted)" }}>
        {profile.tagline}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="#projects"
          className="rounded px-5 py-2 text-sm font-medium"
          style={{ background: "var(--accent)", color: "#04120a" }}
        >
          View Projects
        </Link>
        <Link
          href="/world"
          className="rounded px-5 py-2 text-sm font-medium"
          style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
        >
          Enter the 3D World →
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Hero`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx
git commit -m "feat: add Hero component"
```

---

## Task 9: About component

**Files:**
- Create: `src/components/About.tsx`
- Test: `src/components/About.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/About.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";
import { profile } from "@/data/profile";

describe("About", () => {
  it("renders the about heading and blurb", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText(profile.blurb)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- About`
Expected: FAIL — cannot find module `./About`.

- [ ] **Step 3: Create `src/components/About.tsx`**

```tsx
import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="prompt text-2xl font-bold" style={{ color: "var(--text)" }}>
        about
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
        {profile.blurb}
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- About`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.tsx src/components/About.test.tsx
git commit -m "feat: add About component"
```

---

## Task 10: SkillsGrid component

**Files:**
- Create: `src/components/SkillsGrid.tsx`
- Test: `src/components/SkillsGrid.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/SkillsGrid.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillsGrid } from "./SkillsGrid";

describe("SkillsGrid", () => {
  it("renders each category label", () => {
    render(<SkillsGrid />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("AI / LLM")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- SkillsGrid`
Expected: FAIL — cannot find module `./SkillsGrid`.

- [ ] **Step 3: Create `src/components/SkillsGrid.tsx`**

```tsx
import { skillGroups } from "@/data/skills";

export function SkillsGrid() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="prompt text-2xl font-bold" style={{ color: "var(--text)" }}>
        skills
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((g) => (
          <div
            key={g.label}
            className="rounded-lg border p-4"
            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              {g.label}
            </h3>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--muted)" }}>
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- SkillsGrid`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SkillsGrid.tsx src/components/SkillsGrid.test.tsx
git commit -m "feat: add SkillsGrid component"
```

---

## Task 11: Contact component (with Formspree form)

**Files:**
- Create: `src/components/Contact.tsx`
- Test: `src/components/Contact.test.tsx`

**Note on Formspree:** The form posts to `https://formspree.io/f/<FORM_ID>`. Munaib must
create a free form at formspree.io (using munaib.pc@gmail.com) and paste the ID. Until
then use the placeholder `your-form-id`; the section still renders and the email/socials
links work. This is called out again in the deploy task.

- [ ] **Step 1: Write the failing test**

`src/components/Contact.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "./Contact";

describe("Contact", () => {
  it("renders email, GitHub and LinkedIn links", () => {
    render(<Contact />);
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:munaib.pc@gmail.com"
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/andromeda2407"
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
  });

  it("renders a contact form with name, email and message fields", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Contact`
Expected: FAIL — cannot find module `./Contact`.

- [ ] **Step 3: Create `src/components/Contact.tsx`**

```tsx
import { profile } from "@/data/profile";

const FORMSPREE_ID = "your-form-id"; // TODO: replace with real Formspree form id

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="prompt text-2xl font-bold" style={{ color: "var(--text)" }}>
        contact
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Have something you want built? Let&apos;s talk.
      </p>

      <div className="mt-6 flex flex-wrap gap-6 text-sm">
        <a href={`mailto:${profile.email}`} style={{ color: "var(--accent)" }}>
          Email
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          LinkedIn
        </a>
      </div>

      <form
        action={`https://formspree.io/f/${FORMSPREE_ID}`}
        method="POST"
        className="mt-8 grid max-w-xl gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          className="rounded border p-3 text-sm"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          className="rounded border p-3 text-sm"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <textarea
          name="message"
          placeholder="Message"
          required
          rows={5}
          className="rounded border p-3 text-sm"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <button
          type="submit"
          className="justify-self-start rounded px-5 py-2 text-sm font-medium"
          style={{ background: "var(--accent)", color: "#04120a" }}
        >
          Send message
        </button>
      </form>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Contact`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx src/components/Contact.test.tsx
git commit -m "feat: add Contact section with form"
```

---

## Task 12: Assemble the home page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx` (metadata)

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { SkillsGrid } from "@/components/SkillsGrid";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <SkillsGrid />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 2: Update metadata in `src/app/layout.tsx`**

Replace the exported `metadata` object with:

```tsx
export const metadata = {
  title: "Munaib PC — Freelance Developer",
  description: "I build apps, websites & platforms. Freelance developer for hire.",
};
```

- [ ] **Step 3: Run the full test suite and build**

Run: `npm test && npm run build`
Expected: all tests PASS, build succeeds.

- [ ] **Step 4: Visually verify in the browser**

Run: `npm run dev`, open http://localhost:3000. Confirm: all five sections render, terminal theme applied, mobile view looks right (narrow the window). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: assemble portfolio home page"
```

---

## Task 13: Reserve the `/world` route (3D showpiece stub)

**Files:**
- Create: `src/app/world/page.tsx`
- Test: `src/app/world/page.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/app/world/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WorldPage from "./page";

describe("World page (stub)", () => {
  it("shows a coming-soon message and a link back home", () => {
    render(<WorldPage />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back/i })).toHaveAttribute("href", "/");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- world`
Expected: FAIL — cannot find module `./page`.

- [ ] **Step 3: Create `src/app/world/page.tsx`**

```tsx
import Link from "next/link";

export const metadata = { title: "3D World — Coming Soon" };

export default function WorldPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="prompt text-sm" style={{ color: "var(--accent)" }}>
        loading world...
      </p>
      <h1 className="mt-4 text-3xl font-bold" style={{ color: "var(--text)" }}>
        The 3D World is coming soon
      </h1>
      <p className="mt-3 max-w-md" style={{ color: "var(--muted)" }}>
        An interactive 3D experience is under construction here. Check back soon.
      </p>
      <Link href="/" className="mt-8 text-sm" style={{ color: "var(--accent)" }}>
        ← Back to portfolio
      </Link>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- world`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/world/page.tsx src/app/world/page.test.tsx
git commit -m "feat: reserve /world route with coming-soon stub"
```

---

## Task 14: Final verification & deploy to Vercel

**Files:** none (operational)

- [ ] **Step 1: Full green check**

Run: `npm test && npm run build && npx tsc --noEmit`
Expected: all tests pass, build succeeds, no type errors.

- [ ] **Step 2: Set up Formspree (manual, by Munaib)**

Create a free form at https://formspree.io using munaib.pc@gmail.com, copy the form ID, and replace `your-form-id` in `src/components/Contact.tsx`. Commit:

```bash
git add src/components/Contact.tsx
git commit -m "chore: wire real Formspree form id"
```

- [ ] **Step 3: Push to GitHub**

Create a repo `portfolio` under github.com/andromeda2407, then:

```bash
git branch -M main
git remote add origin https://github.com/andromeda2407/portfolio.git
git push -u origin main
```

- [ ] **Step 4: Deploy on Vercel**

Go to vercel.com, "Import Project" → select the `portfolio` repo → framework auto-detects Next.js → Deploy. Confirm the live URL loads, all sections render, and the contact form submits a test message that arrives at munaib.pc@gmail.com.

- [ ] **Step 5: Record the live URL**

Add the live URL to the top of `docs/specs/2026-07-05-portfolio-hub-design.md` and commit:

```bash
git add docs/specs/2026-07-05-portfolio-hub-design.md
git commit -m "docs: record live portfolio URL"
```

---

## Notes for later sub-projects (not in this plan)

- Each of the 4 showcase projects gets its own spec → plan → build. When one goes live, update its entry in `src/data/projects.ts` (`status: "live"`, add `liveUrl`/`codeUrl`, drop a screenshot in `/public/projects/`).
- The `/world` route becomes the react-three-fiber 3D "giant world" — its own spec/plan. Start at "3D-lite" complexity (scroll-driven or click-to-move) per the hybrid decision.
