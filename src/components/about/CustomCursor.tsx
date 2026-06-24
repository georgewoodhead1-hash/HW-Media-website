"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Bespoke cursor (Luke / Trionn DNA): a small dot rides the pointer 1:1, a larger
// ring lerp-trails behind it, and on hover over any [data-cursor] element the ring
// grows and shows that element's label ("View", "Play", "Drag"). Native cursor is
// hidden across the About experience while this runs. Desktop / fine-pointer only.
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const d = dot.current;
    const r = ring.current;
    const l = label.current;
    if (!d || !r || !l) return;

    document.body.style.cursor = "none";

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (!t) return;
      gsap.to(r, { scale: 2.6, borderColor: "rgba(191,170,83,0.9)", duration: 0.3, ease: "power3" });
      l.textContent = t.dataset.cursor || "";
      gsap.to(l, { autoAlpha: 1, duration: 0.2 });
    };
    const out = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (!t) return;
      gsap.to(r, { scale: 1, borderColor: "rgba(245,241,230,0.5)", duration: 0.3, ease: "power3" });
      gsap.to(l, { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] hidden md:block" aria-hidden>
      <div ref={ring} className="absolute left-0 top-0 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(245,241,230,0.5)] will-change-transform">
        <span ref={label} className="label-mono text-[8px] text-[var(--gold-text)] opacity-0" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[var(--gold-text)] will-change-transform" />
    </div>
  );
}
