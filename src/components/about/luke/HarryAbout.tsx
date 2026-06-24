"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Harry — Luke's "skills" section, adapted. LEFT: a small label, a bold scrubbed
// statement, a hairline, and a gold "get in touch" arrow. RIGHT: the crafts one
// person actually does (dimmed list, brightens on hover) — says "one director does
// all of it" without any numbered process flow.
const CRAFTS = ["Direction", "Cinematography", "Editing", "Colour", "Sound"];
const STATEMENT = "HW Media is one director. Harry Wallis writes, shoots, cuts and colours every film himself.";

export default function HarryAbout() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-ha-stmt] .word", { yPercent: 115, autoAlpha: 0, ease: "none", stagger: 0.03, scrollTrigger: { trigger: "[data-ha-stmt]", start: "top 82%", end: "top 42%", scrub: 0.5 } });
      gsap.from("[data-ha-craft]", { autoAlpha: 0, x: 26, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: "[data-ha-crafts]", start: "top 80%", once: true } });
      gsap.from("[data-ha-rule]", { scaleX: 0, transformOrigin: "left center", ease: "power3.inOut", duration: 1, scrollTrigger: { trigger: "[data-ha-rule]", start: "top 85%", once: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-5 py-[16vh] md:px-10">
      <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div>
          <div className="mb-7 about-label text-[var(--fg)]/45">Harry</div>
          <h2 data-ha-stmt className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(1.7rem,3.4vw,2.9rem)", lineHeight: 1.07 }}>
            {STATEMENT.split(" ").map((w, i) => (
              <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom"><span className="word inline-block">{w}&nbsp;</span></span>
            ))}
          </h2>
          <div data-ha-rule className="mt-10 h-px w-full origin-left bg-[var(--hairline-dark)]" />
          <a data-cursor="Email" href="mailto:harry@hwmedia.co.uk" className="mt-7 inline-flex items-center gap-4 about-label text-[var(--fg)]/80 transition-colors hover:text-[var(--gold-text)]">
            Get in touch
            <span className="relative block h-[2px] w-12 bg-[var(--gold-text)]">
              <span className="absolute -right-[2px] -top-[3px] h-2 w-2 rotate-45 border-r-2 border-t-2 border-[var(--gold-text)]" />
            </span>
          </a>
        </div>

        <ul data-ha-crafts className="md:pt-12">
          {CRAFTS.map((c, i) => {
            const on = active === i;
            return (
              <li key={c} data-ha-craft className="border-t border-[var(--hairline-dark)] last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`block w-full py-4 text-left about-display leading-none transition-colors duration-300 md:py-5 ${on ? "text-[var(--fg)]" : "text-[var(--fg)]/25"}`}
                  style={{ fontSize: "clamp(1.4rem,3vw,2.4rem)" }}
                >
                  {c}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
