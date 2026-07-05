export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "REST APIs", "PostgreSQL", "Auth"] },
  { label: "AI / LLM", items: ["Claude API", "Prompt engineering", "RAG"] },
  { label: "Tooling & Deploy", items: ["Git", "Vercel", "CI/CD"] },
];
