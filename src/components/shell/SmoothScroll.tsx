"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // reloading mid-pin restored a broken half-state (QA P1) — always start clean
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Premium weight (lukebaffait feel): a low lerp gives the scroll real
    // inertia so it glides under the cursor instead of snapping. luke runs
    // 0.06; 0.07 keeps that heavy, expensive glide while staying responsive
    // enough on a trackpad.
    const lenis = new Lenis({
      lerp: 0.06,
      wheelMultiplier: 0.8,
      smoothWheel: true,
      // NO syncTouch: it hijacks touch-style input, which a Mac trackpad /
      // Magic Mouse emits — that was silently eating the user's scroll while
      // synthetic wheel-event tests still passed. Native touch scrolling is
      // smooth enough without it.
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
