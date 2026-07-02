"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

// Page-to-page blend (George: "home/work/about/contact still doesn't blend").
// A dark veil sweeps UP over the page before navigation and lifts away on the
// new page — every route change reads as one continuous dark cut, 1820-style,
// instead of a cold swap. Works by event delegation on internal links, so no
// per-Link edits. Reduced-motion users get an instant cut.
export default function RouteTransitions() {
  const veilRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const navigating = useRef(false);

  // EXIT — intercept internal link clicks, sweep the veil in, then navigate
  useEffect(() => {
    const veil = veilRef.current;
    if (!veil) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return; // internal only
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const [path] = href.split("#");
      if (!path || path === pathname) return; // same page / hash — let it be
      e.preventDefault();
      if (navigating.current) return;
      navigating.current = true;
      if (reduced) { router.push(href); return; }
      gsap.set(veil, { yPercent: 100, autoAlpha: 1, pointerEvents: "auto" });
      gsap.to(veil, {
        yPercent: 0,
        duration: 0.6,
        ease: "power4.inOut",
        onComplete: () => router.push(href),
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  // ENTER — new pathname mounted under the veil: lift it away
  useEffect(() => {
    const veil = veilRef.current;
    if (!veil) return;
    navigating.current = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(veil, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }
    // only animate if the veil is actually covering (i.e. we swept in)
    const covering = Number(gsap.getProperty(veil, "yPercent")) === 0 && Number(gsap.getProperty(veil, "opacity")) > 0;
    if (!covering) return;
    const tl = gsap.timeline();
    tl.to(veil, {
      yPercent: -100,
      duration: 0.75,
      delay: 0.12,
      ease: "power4.inOut",
      onComplete: () => gsap.set(veil, { autoAlpha: 0, pointerEvents: "none", yPercent: 100 }),
    });
    return () => { tl.kill(); };
  }, [pathname]);

  return (
    <div
      ref={veilRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200] bg-[#050505] opacity-0 will-change-transform"
    >
      {/* a soft tonal edge leads the sweep — depth, no line */}
      <span className="absolute inset-x-0 top-0 h-40 -translate-y-full bg-gradient-to-t from-[#050505] to-transparent" />
      <span className="absolute inset-x-0 bottom-0 h-40 translate-y-full bg-gradient-to-b from-[#050505] to-transparent" />
    </div>
  );
}
