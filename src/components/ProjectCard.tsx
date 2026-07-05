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
