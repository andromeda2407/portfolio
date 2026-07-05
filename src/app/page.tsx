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
