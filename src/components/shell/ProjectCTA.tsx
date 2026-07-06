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
      className="relative min-h-[82vh] overflow-hidden bg-[var(--bg)]"
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
        {/* smaller display line + bracket CTA — glass binned site-wide (George) */}
        <p className="font-display text-white" style={{ fontSize: "clamp(1.9rem,4.2vw,3.6rem)", lineHeight: 0.95 }}>
          Have a project in mind?
        </p>
        <Link href="/contact" className="blink mt-8 text-[clamp(13px,1.2vw,15px)] tracking-[0.05em]">
          Start here <span aria-hidden>⟶</span>
        </Link>
      </div>
    </section>
  );
}
