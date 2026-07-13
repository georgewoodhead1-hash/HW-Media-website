"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, scrollMemory, navIntent } from "@/lib/lenis";

// Page-to-page transform, v7 (George's spec):
//  - the cover carries ONLY the destination word — no photo, no rule
//  - every destination has its OWN cover style, close and open:
//      HOME     cascade — columns pour in from the top, sweep out downward
//      WORK     weave — columns alternate top/bottom, clear UPWARD (and the
//               work wall builds tile-by-tile in sync with that lift)
//      ABOUT    curtain — two halves draw in from left and right, then part
//      CONTACT  shades — horizontal slats slide in alternating sides, then
//               slide back out (venetian)
//  - the next page BUILDS out of the motion: PageBuild reads the
//    transition's direction (html[data-transition-dir]) and constructs
//    elements travelling WITH the clearing cover — one workflow, no fade
//
// Carries all QA/review fixes: non-destructive OPEN cleanup, open-timeline
// serialization on interrupt, pinned filter starts (no black flash),
// back-during-cover abort, navIntent click-marking, Lenis stop/start,
// slats dissolve through exits, pointer release as the cover clears.

const COLS = 6;
const ROWS = 6;

type Dir = "up" | "right" | "center" | "down";
type Style = "cascade" | "weave" | "curtain" | "shades";

function planFor(path: string): { dir: Dir; style: Style; label: string } {
  if (path.startsWith("/work")) return { dir: "up", style: "weave", label: "Work" };
  if (path.startsWith("/about")) return { dir: "right", style: "curtain", label: "About" };
  if (path.startsWith("/services")) return { dir: "right", style: "curtain", label: "Services" };
  if (path.startsWith("/contact")) return { dir: "center", style: "shades", label: "Contact" };
  if (path.startsWith("/privacy")) return { dir: "down", style: "cascade", label: "Privacy" };
  return { dir: "down", style: "cascade", label: "Home" };
}

export default function RouteTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const navigating = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pending = useRef<{ dir: Dir; style: Style }>({ dir: "up", style: "weave" });
  const covered = useRef(false);
  const openTl = useRef<gsap.core.Timeline | null>(null);

  // ── CLOSE ──
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      // origin-verified (audit M1): backslash hrefs normalise to another
      // origin through the URL parser — never intercept those
      try {
        if (new URL(href, window.location.origin).origin !== window.location.origin) return;
      } catch { return; }
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const [path] = href.split("#");
      if (!path || path === pathname) return;
      e.preventDefault();
      if (navigating.current) return;
      navigating.current = true;
      if (reduced) { navIntent.click = true; router.push(href); return; }

      const overlay = overlayRef.current;
      const main = document.querySelector("main");
      if (!overlay) { navIntent.click = true; router.push(href); return; }

      // remember where THIS page was scrolled, for the back button —
      // before the cover resets scroll to 0
      scrollMemory.set(window.location.pathname, window.scrollY);

      const plan = planFor(path);
      pending.current = plan;
      document.documentElement.dataset.transitioning = "1";
      document.documentElement.dataset.transitionDir = plan.dir;

      const cols = overlay.querySelectorAll<HTMLElement>(".rt-col");
      const rows = overlay.querySelectorAll<HTMLElement>(".rt-row");
      const label = overlay.querySelector<HTMLElement>(".rt-label");
      const isRows = plan.style === "shades";
      const active = isRows ? rows : cols;
      const idle = isRows ? cols : rows;

      // arm a clean stage BEFORE the overlay becomes visible
      gsap.set(idle, { autoAlpha: 0 });
      gsap.set(active, { autoAlpha: 1, xPercent: 0, yPercent: 0 });
      if (plan.style === "weave") {
        active.forEach((s, i) => gsap.set(s, { yPercent: i % 2 === 0 ? -105 : 105 }));
      } else if (plan.style === "cascade") {
        gsap.set(active, { yPercent: -105 });
      } else if (plan.style === "curtain") {
        active.forEach((s, i) => gsap.set(s, { xPercent: i < COLS / 2 ? -105 : 105 }));
      } else {
        // shades: horizontal slats from alternating sides
        active.forEach((s, i) => gsap.set(s, { xPercent: i % 2 === 0 ? -105 : 105 }));
      }
      if (label) { label.textContent = plan.label; gsap.set(label, { yPercent: 120 }); }
      overlay.style.pointerEvents = "auto";
      overlay.style.visibility = "visible";

      // hand the stage over cleanly if a reveal is still running
      openTl.current?.kill();
      openTl.current = null;

      getLenis()?.stop();
      const startPath = window.location.pathname;

      const tl = gsap.timeline({
        onComplete: () => {
          // honour a back/forward pressed while the cover was closing
          if (window.location.pathname !== startPath) {
            overlay.style.pointerEvents = "none";
            overlay.style.visibility = "hidden";
            if (main) gsap.set(main, { clearProps: "all" });
            delete document.documentElement.dataset.transitioning;
            delete document.documentElement.dataset.transitionDir;
            getLenis()?.start();
            navigating.current = false;
            window.dispatchEvent(new Event("hw:page-entered"));
            return;
          }
          covered.current = true;
          window.scrollTo(0, 0);
          getLenis()?.scrollTo(0, { immediate: true });
          navIntent.click = true;
          router.push(href);
        },
      });

      // the old page falls back under the cover (pinned start = no flash)
      if (main) {
        tl.fromTo(main,
          { scale: 1, filter: "brightness(1)" },
          { scale: 0.96, filter: "brightness(0.55)", duration: 0.8, ease: "power3.inOut", transformOrigin: "center center" },
          0);
      }

      // the cover, in its destination's style — ONE rhythm for all four
      // (George: "the bars need to be in the same rhythm"): every close is
      // 0.7s power4.inOut at 0.055 per slat; only the geometry differs
      if (plan.style === "weave") {
        tl.to(active, { yPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: { each: 0.055, from: "edges" } }, 0);
      } else if (plan.style === "cascade") {
        tl.to(active, { yPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: { each: 0.055, from: "start" } }, 0);
      } else if (plan.style === "curtain") {
        tl.to(active, { xPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: { each: 0.055, from: "edges" } }, 0);
      } else {
        tl.to(active, { xPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: { each: 0.055, from: "start" } }, 0);
      }

      // the word — just the word, centred
      tl.to(label, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.55)
        .to({}, { duration: 0.22 });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  // ── OPEN ──
  useLayoutEffect(() => {
    navigating.current = false;
    if (!covered.current) return;
    covered.current = false;

    const overlay = overlayRef.current;
    if (!overlay) return;
    const cols = overlay.querySelectorAll<HTMLElement>(".rt-col");
    const rows = overlay.querySelectorAll<HTMLElement>(".rt-row");
    const label = overlay.querySelector<HTMLElement>(".rt-label");
    const main = document.querySelector("main");
    const { style } = pending.current;
    const active = style === "shades" ? rows : cols;

    const done = () => {
      getLenis()?.start();
      overlay.style.pointerEvents = "none";
      overlay.style.visibility = "hidden";
      if (main) gsap.set(main, { clearProps: "all" });
      delete document.documentElement.dataset.transitioning;
      delete document.documentElement.dataset.transitionDir;
      ScrollTrigger.refresh();
    };

    // the incoming page waits just off its mark — the ELEMENT builds carry
    // the arrival (PageBuild reads the direction); the sheet itself only
    // gets a small settle
    if (main) gsap.set(main, { y: 36, transformOrigin: "center top" });

    const tl = gsap.timeline({ onComplete: done });
    openTl.current = tl;
    tl.set(overlay, { pointerEvents: "none" }, 0.3);

    // the word leaves first
    tl.to(label, { yPercent: -130, duration: 0.32, ease: "power2.in" }, 0);

    // the cover leaves in its own style, dissolving as it goes — same
    // 0.78s / 0.055 rhythm on every open, matching the close
    if (style === "weave") {
      // clears UPWARD — the work wall lifts into place beneath it
      tl.to(active, { yPercent: -105, autoAlpha: 0, duration: 0.78, ease: "power4.inOut", stagger: { each: 0.055, from: "start" } }, 0.22);
    } else if (style === "cascade") {
      // pours on DOWN in the same left-to-right order it arrived — one
      // continuous rhythm through the whole cover (George)
      tl.to(active, { yPercent: 105, autoAlpha: 0, duration: 0.78, ease: "power4.inOut", stagger: { each: 0.055, from: "start" } }, 0.22);
    } else if (style === "curtain") {
      tl.to(active, {
        xPercent: (i: number) => (i < COLS / 2 ? -105 : 105),
        autoAlpha: 0,
        duration: 0.78,
        ease: "power4.inOut",
        stagger: { each: 0.055, from: "center" },
      }, 0.22);
    } else {
      // shades slide back out the way they came
      tl.to(active, {
        xPercent: (i: number) => (i % 2 === 0 ? 105 : -105),
        autoAlpha: 0,
        duration: 0.78,
        ease: "power4.inOut",
        stagger: { each: 0.055, from: "start" },
      }, 0.22);
    }

    if (main) {
      tl.to(main, { y: 0, duration: 1.0, ease: "power3.out" }, 0.3);
    }
    // the page's build runs WITH the clearing cover
    tl.call(() => window.dispatchEvent(new Event("hw:page-entered")), [], 0.34);

    return () => {
      // NON-destructive: the next CLOSE arms its own cover
      tl.kill();
      openTl.current = null;
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[220]"
      style={{ visibility: "hidden" }}
    >
      {/* vertical columns — cascade / weave / curtain */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLS }, (_, i) => (
          <div key={`c${i}`} className="rt-col h-full flex-1 bg-[#f5f1e6] will-change-transform" style={{ marginLeft: i === 0 ? 0 : -1 }} />
        ))}
      </div>
      {/* horizontal rows — shades */}
      <div className="absolute inset-0 flex flex-col">
        {Array.from({ length: ROWS }, (_, i) => (
          <div key={`r${i}`} className="rt-row w-full flex-1 bg-[#f5f1e6] will-change-transform" style={{ marginTop: i === 0 ? 0 : -1 }} />
        ))}
      </div>
      {/* the word — nothing else */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <span className="rt-label font-display block text-[clamp(2.2rem,4.6vw,4.4rem)] leading-none text-[#0a0a08]">
          Work
        </span>
      </div>
    </div>
  );
}
