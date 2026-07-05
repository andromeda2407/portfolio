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
