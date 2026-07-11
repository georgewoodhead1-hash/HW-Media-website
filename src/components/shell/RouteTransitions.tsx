"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Page-to-page transform, v4 — the il capo grammar (captured live from
// ilcapoproduction.com): CREAM PANELS sweep in from the edges over the old
// page, meet at the centre with the HW mark riding the cover, hold a beat,
// then the cover breaks into vertical slats that clear in a DIFFERENT
// DIRECTION per destination — and the new page is fully rendered underneath
// (no blank sheet). "hw:page-entered" fires as the slats clear so each
// page's staged build starts right on cue.
//
// Directions: /work → slats lift UP · /about → sweep RIGHT · /contact →
// part from the CENTRE outward · home → drop DOWN.

const SLATS = 4;

function directionFor(path: string): "up" | "right" | "center" | "down" {
  if (path.startsWith("/work")) return "up";
  if (path.startsWith("/about") || path.startsWith("/services")) return "right";
  if (path.startsWith("/contact")) return "center";
  return "down";
}

export default function RouteTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const navigating = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingDir = useRef<"up" | "right" | "center" | "down">("up");
  const covered = useRef(false);

  // COVER — panels sweep in over the old page, then navigate underneath
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const [path] = href.split("#");
      if (!path || path === pathname) return;
      e.preventDefault();
      if (navigating.current) return;
      navigating.current = true;
      if (reduced) { router.push(href); return; }

      const overlay = overlayRef.current;
      if (!overlay) { router.push(href); return; }

      pendingDir.current = directionFor(path);
      document.documentElement.dataset.transitioning = "1";

      const slats = overlay.querySelectorAll<HTMLElement>(".rt-slat");
      const mark = overlay.querySelector<HTMLElement>(".rt-mark");
      overlay.style.pointerEvents = "auto";
      overlay.style.visibility = "visible";

      // panels close from BOTH edges toward the centre (outer slats lead)
      gsap.set(slats, { yPercent: 0, borderRadius: 0 });
      slats.forEach((s, i) => {
        const fromLeft = i < SLATS / 2;
        gsap.set(s, { xPercent: fromLeft ? -105 : 105 });
      });
      if (mark) gsap.set(mark, { autoAlpha: 0, scale: 0.92 });

      gsap.timeline({
        onComplete: () => {
          covered.current = true;
          window.scrollTo(0, 0);
          router.push(href);
        },
      })
        .to(slats, {
          xPercent: 0,
          duration: 0.6,
          ease: "power4.inOut",
          stagger: { each: 0.05, from: "edges" },
        }, 0)
        .to(mark, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 0.3);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  // REVEAL — the cover breaks toward the destination's direction; the new
  // page is already rendered underneath
  useLayoutEffect(() => {
    navigating.current = false;
    if (!covered.current) return;
    covered.current = false;

    const overlay = overlayRef.current;
    if (!overlay) return;
    const slats = overlay.querySelectorAll<HTMLElement>(".rt-slat");
    const mark = overlay.querySelector<HTMLElement>(".rt-mark");
    const dir = pendingDir.current;

    const done = () => {
      overlay.style.pointerEvents = "none";
      overlay.style.visibility = "hidden";
      delete document.documentElement.dataset.transitioning;
      ScrollTrigger.refresh();
    };

    const tl = gsap.timeline({ onComplete: done });
    // a held beat on the cover, then the break
    tl.to(mark, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.14);
    if (dir === "up" || dir === "down") {
      tl.to(slats, {
        yPercent: dir === "up" ? -104 : 104,
        duration: 0.68,
        ease: "power4.inOut",
        stagger: { each: 0.06, from: dir === "up" ? "start" : "end" },
      }, 0.18);
    } else if (dir === "right") {
      tl.to(slats, {
        xPercent: 105,
        duration: 0.68,
        ease: "power4.inOut",
        stagger: { each: 0.06, from: "start" },
      }, 0.18);
    } else {
      // centre: the middle slats part first, outward
      tl.to(slats, {
        xPercent: (i: number) => (i < SLATS / 2 ? -105 : 105),
        duration: 0.68,
        ease: "power4.inOut",
        stagger: { each: 0.06, from: "center" },
      }, 0.18);
    }
    // the page's own staged build starts as the cover is clearing
    tl.call(() => window.dispatchEvent(new Event("hw:page-entered")), [], 0.34);

    return () => { tl.kill(); done(); window.dispatchEvent(new Event("hw:page-entered")); };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[220] flex"
      style={{ visibility: "hidden" }}
    >
      {Array.from({ length: SLATS }, (_, i) => (
        <div
          key={i}
          className="rt-slat h-full flex-1 bg-[#f5f1e6] will-change-transform"
          style={{ marginLeft: i === 0 ? 0 : -1 }}
        />
      ))}
      {/* the mark rides the cover */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/hwmedia-light.png"
        alt=""
        className="rt-mark absolute left-1/2 top-1/2 h-24 w-auto -translate-x-1/2 -translate-y-1/2 md:h-32"
      />
    </div>
  );
}
