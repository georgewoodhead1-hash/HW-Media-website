"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// 03 — one line of praise. Not a wall of quotes — a single line adrift in
// black, gold, typing itself as it passes, then dissolving into the
// finale. Luke restraint, the last quiet beat before the films spiral.

const QUOTE = "The film outlived the campaign. We still open every pitch with it.";
const WHO = "BRAND DIRECTOR · HERITAGE MOTORING";

export default function Praise() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pr-word",
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: { trigger: ".pr-quote", start: "top 84%", end: "top 44%", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        ".pr-who",
        { opacity: 0 },
        { opacity: 0.6, ease: "none", scrollTrigger: { trigger: ".pr-quote", start: "top 55%", end: "top 40%", scrub: 0.8 } },
      );
      // continuous drift the full pass, then a soft fade into the finale
      gsap.fromTo(
        ".pr-quote",
        { yPercent: 12 },
        { yPercent: -12, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.9 } },
      );
      gsap.fromTo(
        ".pr-quote",
        { opacity: 1 },
        { opacity: 0.16, ease: "none", scrollTrigger: { trigger: root, start: "center top", end: "bottom top", scrub: 0.8 } },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-chapter="03 — What they say"
      className="relative flex min-h-[108vh] flex-col justify-center px-5 md:px-10"
      aria-label="What they say"
    >
      <span className="label-mono absolute left-5 top-[20vh] text-[10px] tracking-[0.28em] opacity-35 md:left-10">
        (03)
      </span>

      <figure className="pr-quote max-w-4xl will-change-transform">
        <blockquote className="font-accent text-[clamp(1.6rem,1rem+2vw,3.2rem)] leading-[1.2] text-[var(--gold)]">
          {`“${QUOTE}”`.split(" ").map((w, i) => (
            <span key={i} className="pr-word">{w} </span>
          ))}
        </blockquote>
        <figcaption className="pr-who label-mono mt-8 text-[11px] tracking-[0.24em]">{WHO}</figcaption>
      </figure>
    </section>
  );
}
