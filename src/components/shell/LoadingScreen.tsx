"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Pre-entry loading screen: the HW Media logo is PAINTED ON — a gold brush nib
// travels left→right and the mark is revealed in its wake through a soft,
// feathered mask edge (so it reads as a brush stroke, not a hard wipe). Then the
// veil lifts to reveal the hero (fires hw:reveal). Reduced-motion skips through.
// (A true pen-tracing of the letterforms would need an SVG of the logo.)
export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const nibRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reveal = () => window.dispatchEvent(new Event("hw:reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      setDone(true);
      return;
    }
    const logo = logoRef.current;
    const nib = nibRef.current;
    const setMask = (r: number) => {
      const g = `linear-gradient(95deg, #000 0%, #000 ${r}%, rgba(0,0,0,0) ${r + 7}%)`;
      if (logo) {
        logo.style.webkitMaskImage = g;
        logo.style.maskImage = g;
      }
      if (nib) nib.style.left = `${r}%`;
    };
    setMask(-8);

    const ctx = gsap.context(() => {
      const sweep = { r: -8 };
      gsap
        .timeline({ onComplete: () => setDone(true) })
        .to(nib, { autoAlpha: 1, duration: 0.25 }, 0)
        // the brush paints the logo on
        .to(sweep, { r: 108, duration: 1.7, ease: "power1.inOut", onUpdate: () => setMask(sweep.r) }, 0)
        .to(nib, { autoAlpha: 0, duration: 0.35 }, 1.45)
        // hold, then the mark lifts and the veil clears into the hero
        .to(logo, { autoAlpha: 0, scale: 1.07, filter: "blur(3px)", duration: 0.6, ease: "power2.in" }, "+=0.5")
        .to(rootRef.current, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut", onStart: reveal }, "-=0.2");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 z-[300] flex items-center justify-center bg-black">
      <div className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src="/logos/hwmedia-white.png"
          alt=""
          className="block h-40 w-auto md:h-56"
          style={{ WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}
        />
        {/* the brush nib — a soft gold light that rides the painted edge */}
        <span
          ref={nibRef}
          className="pointer-events-none absolute top-1/2 h-[135%] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent opacity-0 blur-[3px]"
        />
      </div>
    </div>
  );
}
