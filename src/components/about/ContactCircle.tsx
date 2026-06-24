"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Contact — the CIRCLE (Luke's contact, done correctly). A light panel masked to
// a circle whose radius grows on scroll until it takes over the whole page,
// flipping the dark world to cream with the contact details inside. Not a corner
// bubble. The section is tall + sticky so the circle has room to expand as you
// scroll through it.
export default function ContactCircle() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelector<HTMLElement>("[data-circle]")?.style.setProperty("--cr", "90%");
      return;
    }
    const ctx = gsap.context(() => {
      // grow the circle only once the section pins (you've reached the contact),
      // over the next ~80% of a viewport of scroll.
      gsap.fromTo(
        "[data-circle]",
        { "--cr": "0%" },
        { "--cr": "92%", ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "+=80%", scrub: 0.8 } },
      );
      gsap.from("[data-c-rev]", {
        autoAlpha: 0,
        y: 36,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top -15%", end: "+=55%", scrub: 0.6 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative" style={{ minHeight: "190vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          data-circle
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#f9f6e4] text-[#171717]"
          style={{ clipPath: "circle(var(--cr, 0%) at 50% 55%)" }}
        >
          <div data-c-rev className="px-5 text-center md:px-10">
            <h2 className="about-display leading-[0.86]" style={{ fontSize: "clamp(3rem,13vw,10rem)" }}>
              Let&apos;s create.
            </h2>
            <a
              data-cursor="Email"
              href="mailto:harry@hwmedia.co.uk"
              className="about-display mt-8 inline-block text-[clamp(1.3rem,3vw,2.4rem)] underline-offset-[10px] transition-colors hover:text-[var(--gold-text)] hover:underline"
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
