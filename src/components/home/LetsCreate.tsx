"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// "Let's create" — the one thing the client loved, lifted out of the old About
// page and dropped between Testimonials and FAQ. DESKTOP: it has an IN and an OUT
// motion (client) — a cream circle blooms open over the dark page, holds with the
// line + email, then contracts away so the page flows on to the FAQs. MOBILE: the
// 260vh scrub left a long black void, so phones just get the cream panel as one
// clean screen.
export default function LetsCreate() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const circle = el.querySelector<HTMLElement>("[data-lc-circle]");
    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      circle?.style.setProperty("--cr", "150%");
      gsap.set("[data-lc-content]", { autoAlpha: 1, yPercent: 0 });
    });

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      tl
        .fromTo("[data-lc-circle]", { "--cr": "0%" }, { "--cr": "94%", duration: 1.2, ease: "power2.out" }, 0)
        .fromTo("[data-lc-content]", { autoAlpha: 0, yPercent: 12 }, { autoAlpha: 1, yPercent: 0, duration: 1, ease: "power2.out" }, 0.2)
        .to("[data-lc-content]", { autoAlpha: 1, duration: 1.2 }, 1.3)
        .to("[data-lc-content]", { autoAlpha: 0, yPercent: -12, duration: 0.9, ease: "power2.in" }, 2.5)
        .to("[data-lc-circle]", { "--cr": "0%", duration: 1.0, ease: "power2.in" }, 2.6);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" data-surface="media" className="relative min-h-screen bg-[#050505] md:min-h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-[#050505]">
        <div
          data-lc-circle
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#f9f6e4] text-[#171717]"
          style={{ clipPath: "circle(var(--cr, 0%) at 50% 50%)" }}
        >
          <div data-lc-content className="px-5 text-center md:px-10">
            <h2 className="about-display leading-[0.86] text-[#171717]" style={{ fontSize: "clamp(3rem,13vw,10rem)" }}>
              Let&apos;s create.
            </h2>
            <a
              data-cursor="Email"
              href="mailto:harry@hwmedia.co.uk"
              className="about-display mt-8 inline-block text-[#171717] text-[clamp(1.3rem,3vw,2.4rem)] underline-offset-[10px] transition-colors hover:text-[var(--gold-text)] hover:underline"
              style={{ textTransform: "none" }}
            >
              harry@hwmedia.co.uk
            </a>
            <p className="about-body mx-auto mt-7 max-w-md text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-[#171717]/70">
              Tell us the brand and the story. We will come to you and shoot it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
