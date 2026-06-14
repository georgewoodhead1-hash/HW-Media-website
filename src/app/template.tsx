"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Route-change wipe: black overlay clears upward as each page mounts.
export default function Template({ children }: { children: ReactNode }) {
  const wipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wipe = wipeRef.current;
    if (!wipe) return;
    if (reduced) {
      gsap.set(wipe, { display: "none" });
      return;
    }
    gsap.fromTo(
      wipe,
      { scaleY: 1 },
      {
        scaleY: 0,
        duration: 0.7,
        ease: "expo.inOut",
        transformOrigin: "top center",
        onComplete: () => {
          gsap.set(wipe, { display: "none" });
          ScrollTrigger.refresh();
        },
      },
    );
  }, []);

  return (
    <>
      <div ref={wipeRef} className="fixed inset-0 z-[70] bg-[var(--black)]" aria-hidden />
      {children}
    </>
  );
}
