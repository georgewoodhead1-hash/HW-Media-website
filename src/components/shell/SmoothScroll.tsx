"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis, getLenis, scrollMemory, navIntent } from "@/lib/lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // CLICK navigation (marked by RouteTransitions): land at the TOP.
  // Anything unmarked is a back/forward traversal: restore the position the
  // user left that page at. The restore waits one frame and resizes Lenis
  // first — its scroll limit is stale at commit and clamps the restore.
  useEffect(() => {
    const isClick = navIntent.click;
    navIntent.click = false;
    const target = isClick ? 0 : scrollMemory.get(pathname) ?? 0;
    window.scrollTo(0, 0);
    getLenis()?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => {
      if (target > 0) {
        const lenis = getLenis();
        lenis?.resize();
        window.scrollTo(0, target);
        lenis?.scrollTo(target, { immediate: true });
      }
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(id);
      // leaving on a traversal: remember where this page was. (Click-navs
      // already reset scroll to 0 under the cover — the >0 guard keeps the
      // click-time save from RouteTransitions intact in that case.)
      if (window.scrollY > 0) scrollMemory.set(pathname, window.scrollY);
    };
  }, [pathname]);

  useEffect(() => {
    // reloading mid-pin restored a broken half-state (QA P1) — always start clean
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    // TOUCH DEVICES: no Lenis at all — the wheel-tuned smoothing fought the
    // native momentum scroll (George: "clunky, sometimes just stops" on
    // mobile). Native scroll + ScrollTrigger's own listener is butter there;
    // the laptop wheel feel is untouched.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      // ROUND-8 (George: "it doesn't scroll, suddenly goes quite quickly,
      // clunky"): lerp .06 was the dead-then-rush — input pooled behind the
      // heavy smoothing and released in a lump at section boundaries.
      // 0.095 ≈ monolog directness; still smooth, but the page answers the
      // wheel. 0.55 wheel weight stays (0.3-0.35 was "way too slow").
      lerp: 0.095,
      wheelMultiplier: 0.55,
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
