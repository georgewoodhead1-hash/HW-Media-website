"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis, getLenis } from "@/lib/lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Always land at the TOP when navigating to a new page — never inherit the
  // previous page's scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
    getLenis()?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    // reloading mid-pin restored a broken half-state (QA P1) — always start clean
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.055, // a touch more glide = more fluid, premium weight
      wheelMultiplier: 0.68, // slower scroll per wheel notch
      smoothWheel: true,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ── FREEZE FIX ──────────────────────────────────────────────────────────
    // Lenis caps scrolling at the document height it first measured. The page
    // GROWS after init (the loader lifts, tall scrubbed sections settle, videos
    // decode), so the cap goes stale and you can't scroll past it — that's the
    // "freezes mid-page" bug. Keep Lenis's scroll limit fresh whenever the height
    // actually changes. This is CHEAP (lenis.resize only) and NEVER calls
    // ScrollTrigger.refresh, so it can't storm/kill the section animations the way
    // a refresh-on-every-change did.
    let lastH = 0;
    const syncLimit = () => {
      const h = document.documentElement.scrollHeight;
      if (h === lastH) return;
      lastH = h;
      lenis.resize();
    };
    const ro = new ResizeObserver(syncLimit);
    ro.observe(document.body);

    // The heavier pass (ScrollTrigger too) runs only on a real window resize and a
    // couple of settle ticks — never during scroll.
    const fullRefresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    const timers = [700, 2200].map((d) => window.setTimeout(fullRefresh, d));
    const onReveal = () => window.setTimeout(fullRefresh, 120);
    window.addEventListener("resize", fullRefresh);
    window.addEventListener("hw:reveal", onReveal);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      timers.forEach(window.clearTimeout);
      window.removeEventListener("resize", fullRefresh);
      window.removeEventListener("hw:reveal", onReveal);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
