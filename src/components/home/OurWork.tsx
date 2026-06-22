"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 03 — Our Work (client feedback): vinyl-browse accordion. A linear row of
// film bars; hover one and it expands to reveal the clip + title while the
// others slim back. Click takes you to the project. No instax, no blur.

const WORKS = projects.slice(0, 6);

export default function OurWork() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v); else v.pause();
      }),
      { rootMargin: "10% 0px" },
    );
    root.querySelectorAll("video").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="03 — Our work"
      className="relative bg-[var(--bg)] px-5 py-[10vh] text-[var(--fg)] md:px-10"
      aria-label="Our work"
    >
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.9]" style={{ fontWeight: 400 }}>
          Our <span className="text-[var(--gold)]">work</span>
        </h2>
        <Link href="/work" className="label-mono hidden text-[11px] tracking-[0.24em] transition-colors hover:text-[var(--gold)] md:inline">
          ALL PROJECTS ⟶
        </Link>
      </div>

      {/* vinyl-browse accordion (desktop) */}
      <div className="hidden h-[66vh] gap-2 md:flex">
        {WORKS.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="ow-bar group relative flex-1 overflow-hidden rounded-md transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[5]"
            aria-label={`${p.title} — ${p.client}`}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={p.wide}
              poster={p.posterWide}
              muted
              loop
              playsInline
              preload="none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30 transition-colors duration-500 group-hover:from-black/65" />

            {/* collapsed — vertical client label */}
            <span className="label-mono absolute bottom-5 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap text-[11px] tracking-[0.2em] text-white/80 opacity-100 transition-opacity duration-300 [writing-mode:vertical-rl] group-hover:opacity-0">
              {p.client.toUpperCase()}
            </span>

            {/* expanded — title + watch */}
            <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="label-mono text-[10px] tracking-[0.24em] text-[var(--gold)]">
                {String(i + 1).padStart(2, "0")} · {p.client.toUpperCase()}
              </span>
              <h3 className="font-display mt-2 whitespace-nowrap text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none text-white" style={{ fontWeight: 400 }}>
                {p.title}
              </h3>
              <span className="label-mono mt-3 inline-block text-[10px] tracking-[0.22em] text-white/70">WATCH ⟶</span>
            </div>
          </Link>
        ))}
      </div>

      {/* mobile stack */}
      <div className="flex flex-col gap-4 md:hidden">
        {WORKS.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="relative block aspect-video overflow-hidden rounded-md">
            <video className="absolute inset-0 h-full w-full object-cover" src={p.wide} poster={p.posterWide} muted loop playsInline preload="none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="label-mono text-[9px] tracking-[0.2em] text-[var(--gold)]">{p.client.toUpperCase()}</span>
              <h3 className="font-display text-xl text-white" style={{ fontWeight: 400 }}>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
