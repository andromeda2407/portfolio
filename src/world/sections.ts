import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { profile } from "@/data/profile";

export type SectionId = "projects" | "career" | "skills" | "contact";

export type WorldSection = {
  id: SectionId;
  label: string;
  position: [number, number, number];
};

export const worldSections: WorldSection[] = [
  { id: "projects", label: "Projects", position: [9, 0, 0] },
  { id: "career", label: "Career", position: [-9, 0, 0] },
  { id: "skills", label: "Skills", position: [0, 0, 9] },
  { id: "contact", label: "Contact", position: [0, 0, -9] },
];

export function getSection(id: SectionId): WorldSection | undefined {
  return worldSections.find((s) => s.id === id);
}

export function sectionSummary(id: SectionId): string {
  switch (id) {
    case "projects":
      return `${projects.length} projects`;
    case "skills":
      return `${skillGroups.length} skill areas`;
    case "career":
      return profile.tagline;
    case "contact":
      return profile.email;
  }
}
