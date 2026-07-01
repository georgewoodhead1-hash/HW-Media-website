"use client";

import Link from "next/link";

// Footer CTA for the About + Work pages (replaces the "Let's create" circle, per
// client): one big on-location image, a short line, and a "Start here" button.
// `centered` stacks the line + button in the middle (client wants this on Work).
export default function ProjectCTA({ centered = false }: { centered?: boolean }) {
  return (
    <section
      data-theme="dark"
      data-surface="media"
      className="relative min-h-[82vh] overflow-hidden bg-[#050505]"
      aria-label="Start a project"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/harry-field.jpg"
        alt="HW Media on location"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div aria-hidden className={`absolute inset-0 ${centered ? "bg-black/55" : "bg-gradient-to-t from-black/85 via-black/45 to-black/25"}`} />
      <div
        className={`relative z-10 flex min-h-[82vh] flex-col px-5 md:px-10 ${
          centered
            ? "items-center justify-center pb-0 text-center"
            : "items-start justify-end pb-[11vh] md:pb-[13vh]"
        }`}
      >
        <p className="font-display text-white" style={{ fontSize: "clamp(2.4rem,6vw,5rem)", lineHeight: 0.92 }}>
          Have a project in mind?
        </p>
        <Link
          href="/contact"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-9 py-4 text-[clamp(14px,1.3vw,16px)] font-medium text-[#0a0a08] transition-colors duration-300 hover:bg-[#d7c476]"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          Start here <span aria-hidden>⟶</span>
        </Link>
      </div>
    </section>
  );
}
