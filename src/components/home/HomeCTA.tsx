"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Client final round: a call to action in the run between testimonials and
// the FAQs. Slim centred band — one line and the button, no image (the
// Defender band further down already carries the big-image CTA).
export default function HomeCTA() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-cta-el]", root);
      gsap.set(els, { autoAlpha: 0, y: 26 });
      const t = gsap.to(els, {
        autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 78%", toggleActions: "play none none reverse" },
      });
      return () => { t.scrollTrigger?.kill(); t.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      className="relative z-30 bg-[var(--bg)] px-5 py-[16vh] text-center text-[var(--fg)] md:px-10"
      aria-label="Start a project"
    >
      <p
        data-cta-el
        className="font-display mx-auto max-w-3xl text-[clamp(1.9rem,3.8vw,3.4rem)] leading-[1.02]"
      >
        Have a project in mind?
      </p>
      <p data-cta-el className="mt-9">
        <Link href="/contact" className="blink cta-start text-[14px] tracking-[0.05em]">
          Start a project
        </Link>
      </p>
    </section>
  );
}
