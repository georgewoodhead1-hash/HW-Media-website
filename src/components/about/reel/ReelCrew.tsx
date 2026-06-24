"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { COLLECTIVE, CREW } from "../_data";

// THE REEL — (02) the crew. Scroll holds on one person at a time: each portrait is
// FRAMED in the centred viewfinder and crossfades to the next as you scroll, with
// the name set huge and low-left over black (graphic-design layout, not centred).
// Sequenced by scroll progress — a different mechanic from the horizontal strip in
// Version 1 and from the full-bleed films below.
export default function ReelCrew() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const i = Math.min(CREW.length - 1, Math.floor(self.progress * CREW.length * 0.999));
          setActive(i);
        },
      });
      gsap.from("[data-rc-frame]", { autoAlpha: 0, scale: 1.1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 60%", once: true } });
      return () => st.kill();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-[#050505]" style={{ height: "340vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-5 md:px-10">
        <p className="about-label absolute left-5 top-7 text-[var(--gold-text)] md:left-10"><span className="scene-marker"><span>(02)</span><span className="text-[var(--fg)]/55">The crew</span></span></p>

        {/* framed portrait, crossfading */}
        <div data-rc-frame className="relative aspect-[3/4] h-[58vh] max-h-[640px] will-change-transform">
          <span className="cross-mark left-2 top-2" />
          <span className="cross-mark right-2 top-2" />
          <span className="cross-mark bottom-2 left-2" />
          <span className="cross-mark bottom-2 right-2" />
          <div className="absolute inset-0 overflow-hidden">
            {CREW.map((m, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m.name} src={m.still} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out" style={{ opacity: active === i ? 1 : 0, filter: "grayscale(0.2) brightness(0.92) contrast(1.05)" }} />
            ))}
          </div>
          <span className="about-label absolute -top-7 right-0 text-[var(--fg)]/45">{String(active + 1).padStart(2, "0")} / {String(CREW.length).padStart(2, "0")}</span>
        </div>

        {/* name block, low-left, crossfading */}
        <div className="pointer-events-none absolute bottom-[10vh] left-5 right-5 md:left-10">
          {CREW.map((m, i) => (
            <div key={m.name} className="absolute bottom-0 left-0 transition-opacity duration-500" style={{ opacity: active === i ? 1 : 0 }}>
              <span className="about-label text-[var(--gold-text)]">{m.role}</span>
              <h3 className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(2.2rem,7vw,5.5rem)", lineHeight: 0.92 }}>{m.name}</h3>
              <p className="about-body mt-3 max-w-[40ch] text-[clamp(0.95rem,1.3vw,1.15rem)] leading-relaxed text-[var(--fg)]/65">{m.line}</p>
            </div>
          ))}
        </div>

        {/* progress dots */}
        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex md:right-10">
          {CREW.map((m, i) => (
            <span key={m.name} className="h-2 w-2 rounded-full transition-all duration-300" style={{ background: active === i ? "var(--gold-text)" : "rgba(245,241,230,0.22)", transform: active === i ? "scale(1.3)" : "scale(1)" }} />
          ))}
        </div>
      </div>

      {/* collective close, sits at the tail of the scroll */}
      <div className="pointer-events-none absolute bottom-[6vh] left-0 w-full px-5 text-center md:px-10">
        <p className="about-body mx-auto max-w-[44ch] text-[clamp(0.95rem,1.2vw,1.1rem)] text-[var(--fg)]/45">{COLLECTIVE}</p>
      </div>
    </section>
  );
}
