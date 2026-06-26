"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

// Work-page finale — a FULL-SCREEN section: as you reach it the cream bubble
// grows up out of the dark and fills the whole screen, then STAYS. It's a call to
// action — "Have a project in mind? Let's create." with a Start here button that
// goes to the contact page.
export default function WorkLetsCreate() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set("[data-wlc-bubble]", { scale: 1.6 });
      gsap.set("[data-wlc-content]", { autoAlpha: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set("[data-wlc-bubble]", { scale: 0 });
      gsap.set("[data-wlc-content]", { autoAlpha: 0, y: 26 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 62%", once: true } });
      tl.to("[data-wlc-bubble]", { scale: 1.6, duration: 1.2, ease: "power3.out" }, 0)
        .to("[data-wlc-content]", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.55);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      data-theme="dark"
      data-surface="media"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 text-center md:px-10"
      aria-label="Have a project in mind?"
    >
      <div data-wlc-bubble aria-hidden className="pointer-events-none absolute aspect-square w-[150vmax] rounded-full bg-[#f9f6e4] will-change-transform" />
      <div data-wlc-content className="relative will-change-transform">
        <h2 className="about-display leading-[0.88] text-[#171717]" style={{ fontSize: "clamp(2.4rem,8vw,6.4rem)" }}>
          Have a project in mind?
          <br />
          <span className="gold-lg">Let&rsquo;s create.</span>
        </h2>
        <Link
          href="/contact"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#171717] px-9 py-4 text-[clamp(15px,1.4vw,18px)] font-medium text-[#f9f6e4] transition-colors duration-300 hover:bg-[#2c2c2c]"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          Start here <span aria-hidden>⟶</span>
        </Link>
      </div>
    </section>
  );
}
