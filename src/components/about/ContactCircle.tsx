"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

// "Let's create" — a cream circle that GROWS up out of the dark to take over the
// screen as you scroll through the (tall, sticky) section, flipping the dark world
// to cream with the contact details inside. Driven by transform `scale` on a
// circular div (GPU-composited, reliable) — NOT a per-frame clip-path / animated
// CSS variable, which rendered as a glitchy sliver.
export default function ContactCircle() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("[data-cc-circle]", { scale: 1.5 });
      gsap.set("[data-c-rev]", { autoAlpha: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set("[data-cc-circle]", { scale: 0, transformOrigin: "50% 55%" });
      gsap.set("[data-c-rev]", { autoAlpha: 0, y: 30 });
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=85%", scrub: 0.8 } })
        .to("[data-cc-circle]", { scale: 1.5, ease: "power2.out", duration: 1 }, 0)
        .to("[data-c-rev]", { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.7 }, 0.45);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative" style={{ minHeight: "190vh" }} aria-label="Let's create">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-[#050505]">
        <div data-cc-circle aria-hidden className="pointer-events-none absolute aspect-square w-[150vmax] rounded-full bg-[#f9f6e4] will-change-transform" />
        <div data-c-rev className="relative px-5 text-center text-[#171717] md:px-10">
          <h2 className="about-display leading-[0.86]" style={{ fontSize: "clamp(3rem,13vw,10rem)" }}>
            Let&apos;s create.
          </h2>
          <div className="mt-10 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-10 py-4 text-[clamp(15px,1.4vw,18px)] font-medium text-[#f9f6e4] transition-colors duration-300 hover:bg-[#2e2c26]"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              Start here <span aria-hidden>⟶</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
