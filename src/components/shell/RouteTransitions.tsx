"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Page-to-page blend, v2 (George: no black veil — "you can see the page coming
// up in real time and overlapping the current page"). On an internal link click
// the CURRENT page is cloned and frozen in place (videos swapped for their
// posters), navigation happens immediately, and the NEW page slides up from the
// bottom edge OVER the frozen old one — a real overlap, like a sheet laid over
// the last. Reduced-motion users get an instant cut.
export default function RouteTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const navigating = useRef(false);
  const cloneRef = useRef<HTMLDivElement | null>(null);

  // EXIT — freeze a visual copy of the page, then navigate straight away
  useEffect(() => {
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

      const main = document.querySelector("main");
      if (main) {
        // freeze the old page: clone it at the current scroll offset, swap the
        // videos for their posters (a clone can't keep playing), park it under
        // where the new page will slide in
        const wrap = document.createElement("div");
        wrap.setAttribute("aria-hidden", "true");
        wrap.className = "pointer-events-none fixed inset-0 z-[5] overflow-hidden";
        const inner = main.cloneNode(true) as HTMLElement;
        inner.style.transform = `translateY(${-window.scrollY}px)`;
        inner.style.margin = "0";
        const origVids = Array.from(main.querySelectorAll("video"));
        inner.querySelectorAll("video").forEach((v, i) => {
          const ov = origVids[i];
          // freeze the LIVE frame onto a CANVAS — canvases paint synchronously,
          // so the frozen page never blinks black while an image decodes
          if (ov && ov.videoWidth) {
            try {
              const c = document.createElement("canvas");
              c.width = ov.videoWidth;
              c.height = ov.videoHeight;
              c.getContext("2d")?.drawImage(ov, 0, 0);
              c.className = v.className;
              v.replaceWith(c);
              return;
            } catch { /* cross-origin — fall through to the poster */ }
          }
          const img = document.createElement("img");
          if (v.poster) img.src = v.poster;
          img.className = v.className;
          img.alt = "";
          v.replaceWith(img);
        });
        wrap.appendChild(inner);
        document.body.appendChild(wrap);
        cloneRef.current = wrap;
      }
      // stamp the blend so page entrances (PageBuild etc.) hold until the
      // sheet has landed — the second loading animation starts THEN
      document.documentElement.dataset.transitioning = "1";
      router.push(href);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  // ENTER — the new page slides up OVER the frozen old one. LAYOUT effect:
  // it must park the incoming page below the fold BEFORE the browser paints,
  // or you see the new page flash at rest for a frame (the "two pages" glitch)
  useLayoutEffect(() => {
    navigating.current = false;
    const clone = cloneRef.current;
    if (!clone) return; // direct load / back-forward — nothing to blend from
    cloneRef.current = null;

    const cleanup = () => { clone.remove(); };
    const main = document.querySelector("main");
    if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cleanup();
      return;
    }

    window.scrollTo(0, 0);
    // park it ONE VIEWPORT below, synchronously — before first paint.
    // CLEAN EDGE (client: the rounded corners + big soft shadow read as a
    // "weird gradient" — binned; just the sheet, one hairline on its lip)
    gsap.set(main, {
      y: window.innerHeight,
      position: "relative",
      zIndex: 20,
      backgroundColor: "var(--bg)",
      borderTop: "1px solid rgba(245,241,230,0.18)",
    });
    // THE NAVIGATION: the next page RISES FROM BELOW and fills the screen IN
    // FRONT of the current page — both visible the whole time, the old page
    // settling gently underneath (never dimmed to black). Once the sheet
    // lands, "hw:page-entered" fires and the new page runs its own build-in.
    const oldInner = clone.firstElementChild as HTMLElement | null;
    const tl = gsap.timeline({
      onComplete: () => {
        cleanup();
        gsap.set(main, { clearProps: "all" });
        delete document.documentElement.dataset.transitioning;
        window.dispatchEvent(new Event("hw:page-entered"));
        ScrollTrigger.refresh();
      },
    });
    if (oldInner) {
      tl.to(oldInner, { scale: 0.965, yPercent: -2, duration: 1.15, ease: "power4.inOut" }, 0);
    }
    tl.to(main, { y: 0, duration: 1.15, ease: "power4.inOut" }, 0)
      .set(main, { borderTop: "none" });

    return () => {
      tl.kill();
      cleanup();
      delete document.documentElement.dataset.transitioning;
      window.dispatchEvent(new Event("hw:page-entered"));
    };
  }, [pathname]);

  return null;
}
