"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvzjlkdp";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      const payload = await response.json().catch(() => null);
      const message =
        payload?.errors?.map((e: { message: string }) => e.message).join(", ") ??
        "Something went wrong. Please try again.";
      setStatus("error");
      setErrorMessage(message);
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

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

      <form onSubmit={handleSubmit} className="mt-8 grid max-w-xl gap-4">
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
          disabled={status === "submitting"}
          className="justify-self-start rounded px-5 py-2 text-sm font-medium disabled:opacity-60"
          style={{ background: "var(--accent)", color: "#04120a" }}
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>

        {status === "success" && (
          <p className="text-sm" style={{ color: "var(--accent)" }}>
            Thanks — I&apos;ll get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm" style={{ color: "#ff6b6b" }}>
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}
