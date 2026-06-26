"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EMAIL } from "@/content/site";

// Work-page finale — the cream "Let's create" bubble GROWS up out of the dark as
// you reach the bottom and STAYS (unlike the home one, it never shrinks back).
// Sits below the "Coming soon" tiles. "Have a project in mind? Let's create."
export default function WorkLetsCreate() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set("[data-wlc-bubble]", { scale: 1.5 });
      gsap.set("[data-wlc-content]", { autoAlpha: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set("[data-wlc-bubble]", { scale: 0 });
      gsap.set("[data-wlc-content]", { autoAlpha: 0, y: 26 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 68%", once: true } });
      tl.to("[data-wlc-bubble]", { scale: 1.5, duration: 1.15, ease: "power3.out" }, 0)
        .to("[data-wlc-content]", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.55);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      data-theme="dark"
      data-surface="media"
      className="relative flex min-h-[86vh] items-center justify-center overflow-hidden bg-[#050505] px-5 text-center md:px-10"
      aria-label="Have a project in mind?"
    >
      <div data-wlc-bubble aria-hidden className="pointer-events-none absolute aspect-square w-[150vmax] rounded-full bg-[#f9f6e4] will-change-transform" />
      <div data-wlc-content className="relative will-change-transform">
        <h2 className="about-display leading-[0.88] text-[#171717]" style={{ fontSize: "clamp(2.4rem,8vw,6.4rem)" }}>
          Have a project in mind?
          <br />
          <span className="gold-lg">Let&rsquo;s create.</span>
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          className="about-display mt-8 inline-block text-[#171717] text-[clamp(1.2rem,2.8vw,2.1rem)] underline-offset-[10px] transition-colors hover:text-[var(--gold-text)] hover:underline"
          style={{ textTransform: "none" }}
        >
          {EMAIL}
        </a>
      </div>
    </section>
  );
}
