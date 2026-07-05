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
