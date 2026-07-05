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
