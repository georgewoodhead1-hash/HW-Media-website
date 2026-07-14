"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, scrollMemory, navIntent } from "@/lib/lenis";

// Page-to-page transform, v8 (George, 2026-07-13):
//  - the cover carries ONLY the destination word — no photo, no rule
//  - every destination has its OWN cover, close and open:
//      HOME     lens — CIRCLES take over the screen (George, 2026-07-14),
//               merging into one cream field; then the cover opens as a
//               CAMERA-LENS IRIS (the loader's through-the-lens move) while
//               the hero zooms 1.2 -> 1 into "Break the ordinary"
//      WORK     weave — columns alternate top/bottom, clear UPWARD (the
//               work wall builds tile-by-tile in sync). UNTOUCHED — the
//               reference everything else is judged against.
//      ABOUT    corners — four solid boxes converge gradually from the four
//               corners, the word lands in the middle, then the whole cover
//               SPIRALS open like a lens iris and the page unmasks in a
//               circle from the centre (PageBuild dir "iris")
//      CONTACT  shades — horizontal slats slide in alternating sides; the
//               return leg is TIGHTER: slats accelerate out while the form
//               builds in venetian strips beneath them
//  - the next page BUILDS out of the motion: PageBuild reads
//    html[data-transition-dir] and constructs elements travelling WITH the
//    clearing cover — one workflow, no fade
//
// Carries all QA/review fixes: non-destructive OPEN cleanup, open-timeline
// serialization on interrupt, pinned filter starts (no black flash),
// back-during-cover abort, navIntent click-marking, Lenis stop/start,
// URL-origin-verified link interception (audit M1).

const COLS = 6;
const ROWS = 6;

type Dir = "up" | "right" | "center" | "down" | "iris";
type Style = "lens" | "weave" | "curtain" | "shades" | "corners" | "cascade";

function planFor(path: string): { dir: Dir; style: Style; label: string } {
  if (path.startsWith("/work")) return { dir: "up", style: "weave", label: "Work" };
  if (path.startsWith("/about")) return { dir: "iris", style: "corners", label: "About" };
  if (path.startsWith("/services")) return { dir: "iris", style: "corners", label: "Services" };
  if (path.startsWith("/contact")) return { dir: "center", style: "shades", label: "Contact" };
  if (path.startsWith("/privacy")) return { dir: "down", style: "cascade", label: "Privacy" };
  return { dir: "iris", style: "lens", label: "Home" };
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
      // ABOUT is a PANEL, not a route (ROUND-8, the monolog move) — any
      // /about link anywhere opens it in place; no cover, no navigation
      if (path === "/about") {
        e.preventDefault();
        window.dispatchEvent(new Event("hw:about"));
        return;
      }
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
      const corners = overlay.querySelectorAll<HTMLElement>(".rt-corner");
      const cornerWrap = overlay.querySelector<HTMLElement>(".rt-cornerwrap");
      const circles = overlay.querySelectorAll<HTMLElement>(".rt-circle");
      const label = overlay.querySelector<HTMLElement>(".rt-label");

      // arm a clean stage BEFORE the overlay becomes visible (and clear any
      // leftover iris mask from a previous open)
      overlay.style.webkitMaskImage = "";
      overlay.style.maskImage = "";
      gsap.set([cols, rows, corners, circles], { autoAlpha: 0 });
      gsap.set(cornerWrap, { rotation: 0, scale: 1, autoAlpha: 1 });

      if (plan.style === "weave") {
        gsap.set(cols, { autoAlpha: 1, xPercent: 0 });
        cols.forEach((s, i) => gsap.set(s, { yPercent: i % 2 === 0 ? -105 : 105 }));
      } else if (plan.style === "cascade") {
        gsap.set(cols, { autoAlpha: 1, xPercent: 0, yPercent: -105 });
      } else if (plan.style === "corners") {
        // four boxes waiting just off their corners
        const off = [
          { xPercent: -104, yPercent: -104 }, // top-left
          { xPercent: 104, yPercent: -104 },  // top-right
          { xPercent: -104, yPercent: 104 },  // bottom-left
          { xPercent: 104, yPercent: 104 },   // bottom-right
        ];
        corners.forEach((c, i) => gsap.set(c, { autoAlpha: 1, ...off[i], rotation: 0 }));
      } else if (plan.style === "lens") {
        gsap.set(circles, { autoAlpha: 1, scale: 0, transformOrigin: "center center" });
      } else {
        // shades: horizontal slats from alternating sides
        gsap.set(rows, { autoAlpha: 1, yPercent: 0 });
        rows.forEach((s, i) => gsap.set(s, { xPercent: i % 2 === 0 ? -105 : 105 }));
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

      // the cover, in its destination's style — one shared rhythm
      if (plan.style === "weave") {
        tl.to(cols, { yPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: { each: 0.055, from: "edges" } }, 0);
      } else if (plan.style === "cascade") {
        tl.to(cols, { yPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: { each: 0.055, from: "start" } }, 0);
      } else if (plan.style === "corners") {
        // gradual, weighty convergence (George: "nice and gradually")
        tl.to(corners, { xPercent: 0, yPercent: 0, duration: 0.9, ease: "power3.inOut", stagger: 0.07 }, 0);
      } else if (plan.style === "lens") {
        // circles take over the screen, merging into one cream field
        tl.to(circles, { scale: 3.4, duration: 0.8, ease: "power3.inOut", stagger: 0.06 }, 0);
      } else {
        tl.to(rows, { xPercent: 0, duration: 0.7, ease: "power4.inOut", stagger: { each: 0.055, from: "start" } }, 0);
      }

      // the word — just the word, centred. It NEVER parks (motion review:
      // an absolute freeze reads as loading; il capo's hold drifts) — it
      // lands, keeps drifting, and the open picks the drift up seamlessly.
      tl.to(label, { yPercent: 0, duration: 0.55, ease: "expo.out" }, 0.5)
        .to(label, { yPercent: -8, duration: 0.22, ease: "none" }, 1.05);
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
    const corners = overlay.querySelectorAll<HTMLElement>(".rt-corner");
    const cornerWrap = overlay.querySelector<HTMLElement>(".rt-cornerwrap");
    const label = overlay.querySelector<HTMLElement>(".rt-label");
    const main = document.querySelector("main");
    const { style } = pending.current;

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

    // the word picks its drift straight back up — no freeze between legs
    tl.fromTo(label, { yPercent: -8 }, { yPercent: -130, duration: 0.3, ease: "power2.in" }, 0);

    // the cover leaves in its own style — OPAQUE the whole way (motion
    // review: a panel you can see through mid-slide stops reading as a
    // curtain and starts reading as a compositing artifact; il capo's
    // covers are solid until they're gone)
    if (style === "weave") {
      // clears UPWARD — the work wall lifts into place beneath it
      tl.to(cols, { yPercent: -105, duration: 0.78, ease: "power4.inOut", stagger: { each: 0.055, from: "start" } }, 0.14);
    } else if (style === "cascade") {
      tl.to(cols, { yPercent: 105, duration: 0.78, ease: "power4.inOut", stagger: { each: 0.055, from: "start" } }, 0.14);
    } else if (style === "corners") {
      // THE LENS SPIRAL (George): the whole cover rotates about the centre
      // while the four blades fly back out through their corners — an iris
      // opening — and the page unmasks in a circle beneath it
      const off = [
        { xPercent: -140, yPercent: -140 },
        { xPercent: 140, yPercent: -140 },
        { xPercent: -140, yPercent: 140 },
        { xPercent: 140, yPercent: 140 },
      ];
      tl.to(cornerWrap, { rotation: 80, scale: 1.18, duration: 1.0, ease: "power3.inOut" }, 0.12);
      corners.forEach((c, i) => {
        tl.to(c, { ...off[i], rotation: -22, duration: 0.9, ease: "power3.in" }, 0.18 + i * 0.05);
      });
    } else if (style === "lens") {
      // THE LENS: an iris opens through the cover — the loader's own
      // through-the-lens move — while the hero zooms out beneath it
      const iris = { r: 0 };
      const RMAX = Math.hypot(window.innerWidth, window.innerHeight) * 0.7;
      tl.to(iris, {
        r: RMAX,
        duration: 1.0,
        ease: "power4.inOut",
        onUpdate: () => {
          const m = `radial-gradient(circle at 50% 50%, transparent ${iris.r}px, black ${iris.r + 1.5}px)`;
          overlay.style.webkitMaskImage = m;
          overlay.style.maskImage = m;
        },
        onComplete: () => {
          overlay.style.webkitMaskImage = "";
          overlay.style.maskImage = "";
        },
      }, 0.16);
    } else {
      // shades slide back out the way they came — solid, fast, dense
      tl.to(rows, {
        xPercent: (i: number) => (i % 2 === 0 ? 105 : -105),
        duration: 0.68,
        ease: "power4.inOut",
        stagger: { each: 0.045, from: "start" },
      }, 0.12);
    }

    if (main) {
      tl.to(main, { y: 0, duration: 1.0, ease: "power3.out" }, 0.3);
    }
    // the page's build runs WITH the clearing cover — early, so the
    // destination is already alive as it's revealed (motion review)
    tl.call(() => window.dispatchEvent(new Event("hw:page-entered")), [], style === "shades" ? 0.2 : 0.28);

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
      {/* vertical columns — weave / cascade */}
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
      {/* four corner blades — corners (About/Services); oversized so the
          spiral never shows a gap mid-rotation */}
      <div className="rt-cornerwrap absolute inset-[-12%] will-change-transform">
        <div className="rt-corner absolute left-0 top-0 h-[52%] w-[52%] bg-[#f5f1e6] will-change-transform" />
        <div className="rt-corner absolute right-0 top-0 h-[52%] w-[52%] bg-[#f5f1e6] will-change-transform" />
        <div className="rt-corner absolute bottom-0 left-0 h-[52%] w-[52%] bg-[#f5f1e6] will-change-transform" />
        <div className="rt-corner absolute bottom-0 right-0 h-[52%] w-[52%] bg-[#f5f1e6] will-change-transform" />
      </div>
      {/* the circle field — home (lens): six discs scale up and merge */}
      <div className="absolute inset-0">
        {[
          { left: "14%", top: "18%" },
          { left: "82%", top: "12%" },
          { left: "50%", top: "50%" },
          { left: "16%", top: "82%" },
          { left: "86%", top: "78%" },
          { left: "55%", top: "96%" },
        ].map((pos, i) => (
          <div
            key={`ci${i}`}
            className="rt-circle absolute h-[46vmax] w-[46vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5f1e6] will-change-transform"
            style={pos}
          />
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
