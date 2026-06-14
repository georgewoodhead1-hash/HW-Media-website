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

    // Premium continuous glide (luke / bennett feel): lerp mode so the page
    // is always easing toward the target — a weighted, heavy drift with no
    // abrupt starts or stops. Lower lerp = heavier. Touch stays native.
    const lenis = new Lenis({
      lerp: 0.065,
      wheelMultiplier: 0.7,
      smoothWheel: true,
      syncTouch: true,
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
