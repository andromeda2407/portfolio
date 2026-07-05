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
