"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Pre-entry loading screen (client): the HW Media logo animates IN, holds, then
// animates OUT, and the whole black veil lifts to reveal the camera-lens entry
// beneath. Reduced-motion users skip straight through.
export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reveal = () => window.dispatchEvent(new Event("hw:reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      setDone(true);
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setDone(true) });
      tl.fromTo(
        ".load-logo",
        { autoAlpha: 0, scale: 0.82, filter: "blur(6px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "expo.out" },
      )
        .to(".load-logo", { autoAlpha: 0, scale: 1.18, filter: "blur(4px)", duration: 0.7, ease: "power2.in" }, "+=0.55")
        // the veil lifts AND the lens dive begins together — the HW logo hands
        // off straight into the camera move (onStart fires "hw:reveal").
        .to(rootRef.current, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut", onStart: reveal }, "-=0.15");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logos/hwmedia-dark.png" alt="" className="load-logo h-40 w-auto md:h-56" />
    </div>
  );
}
