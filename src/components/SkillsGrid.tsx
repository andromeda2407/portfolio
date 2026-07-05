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
