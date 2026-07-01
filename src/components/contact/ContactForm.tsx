"use client";

import { useState, type FormEvent } from "react";
import { EMAIL } from "@/content/site";

const FIELD =
  "w-full rounded-md border border-[var(--hairline-dark)] bg-transparent px-5 py-3.5 text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/40 focus:border-[var(--gold)]";

type Status = "idle" | "sending" | "sent" | "error";

// Contact form — posts JSON to /api/contact over HTTPS (no mailto, no "not
// secure" warning). Server validates + sends via Resend. Friendly states.
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fd.get("firstName"),
          lastName: fd.get("lastName"),
          email: fd.get("email"),
          message: fd.get("message"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError(`Network error. Please email ${EMAIL} directly.`);
    }
  }

  if (status === "sent") {
    return (
      <p className="mt-12 text-[clamp(1.1rem,1.6vw,1.4rem)] leading-relaxed text-[var(--fg)]/80" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
        Thanks — we&rsquo;ll be back to you within 24 hours.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-12 flex flex-col gap-4 text-left" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input name="firstName" placeholder="First name" aria-label="First name" autoComplete="given-name" maxLength={80} className={FIELD} required />
        <input name="lastName" placeholder="Last name (optional)" aria-label="Last name (optional)" autoComplete="family-name" maxLength={80} className={FIELD} />
      </div>
      <input type="email" name="email" placeholder="Email address" aria-label="Email address" autoComplete="email" maxLength={160} className={FIELD} required />
      <textarea name="message" rows={5} placeholder="Message" aria-label="Message" maxLength={4000} className={FIELD} required />
      <button
        type="submit"
        disabled={status === "sending"}
        className="lift-hover mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-8 py-3.5 text-[15px] font-medium text-[#0a0a08] transition-colors duration-300 hover:bg-[#d7c476] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : <>Send <span aria-hidden>⟶</span></>}
      </button>
      {status === "error" && <p className="text-[14px] text-[#e0795f]">{error}</p>}
      <div className="mt-6 border-t border-[var(--fg)]/12 pt-5 text-center">
        <p className="text-[13px] text-[var(--fg)]/55" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          Prefer email? Reach Harry directly at{" "}
          <a href={`mailto:${EMAIL}`} className="text-[var(--gold-text)] underline-offset-4 hover:underline">{EMAIL}</a>
        </p>
      </div>
    </form>
  );
}
