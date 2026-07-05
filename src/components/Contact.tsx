import { profile } from "@/data/profile";

const FORMSPREE_ID = "your-form-id"; // TODO: replace with real Formspree form id

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="prompt text-2xl font-bold" style={{ color: "var(--text)" }}>
        contact
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Have something you want built? Let&apos;s talk.
      </p>

      <div className="mt-6 flex flex-wrap gap-6 text-sm">
        <a href={`mailto:${profile.email}`} style={{ color: "var(--accent)" }}>
          Email
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)" }}
        >
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)" }}
        >
          LinkedIn
        </a>
      </div>

      <form
        action={`https://formspree.io/f/${FORMSPREE_ID}`}
        method="POST"
        className="mt-8 grid max-w-xl gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          className="rounded border p-3 text-sm"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          className="rounded border p-3 text-sm"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <textarea
          name="message"
          placeholder="Message"
          required
          rows={5}
          className="rounded border p-3 text-sm"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <button
          type="submit"
          className="justify-self-start rounded px-5 py-2 text-sm font-medium"
          style={{ background: "var(--accent)", color: "#04120a" }}
        >
          Send message
        </button>
      </form>
    </section>
  );
}
