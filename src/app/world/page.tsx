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
