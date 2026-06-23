"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Minimal scroll cue on the hero (auteur/luke restraint): a small "Scroll"
// label over a thin track with a segment travelling down it. Fades out the
// moment you start scrolling and never returns. Sits over the always-dark hero,
// so it's a light mark in both modes.
export default function ScrollCue() {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const fill = fillRef.current;
    if (!el || !fill) return;

    const loop = gsap.fromTo(
      fill,
      { y: -14 },
      { y: 36, duration: 1.5, ease: "power1.inOut", repeat: -1 },
    );

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.to(el, {
          autoAlpha: self.scroll() > 60 ? 0 : 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      },
    });

    return () => {
      loop.kill();
      st.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-8"
      style={{ fontFamily: "var(--font-firma), sans-serif" }}
    >
      <span className="text-[10px] uppercase tracking-[0.32em] text-[#f5f1e6]/65">Scroll</span>
      <span className="relative block h-9 w-px overflow-hidden bg-[#f5f1e6]/20">
        <span ref={fillRef} className="absolute left-0 top-0 block h-3.5 w-px bg-[#f5f1e6]" />
      </span>
    </div>
  );
}
