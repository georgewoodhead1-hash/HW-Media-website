"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Page-to-page transform, v5 — the FULL il capo move (George: the cover must
// be a moment, not a wipe). Three acts, all overlapping, one fluid motion:
//
//  CLOSE   the old page RECEDES (scales back, dims) while cream slats sweep
//          in from both edges over it; as the cover lands, ONE OF HARRY'S
//          FRAMES scales up in a centre card with the destination name
//          rising beneath it — a title card, not a blank wall
//  HOLD    a breath — the frame drifts slowly inside its card
//  OPEN    the card drives PAST the viewer (the loader's camera push), the
//          slats clear in a different direction per destination, and the
//          new page RISES + SETTLES underneath while its own staged build
//          (PageBuild / hw:page-entered) runs — the page builds as the
//          cover leaves. Never a static swap, never a blank sheet.
//
// Directions: /work → slats lift UP · /about + /services → sweep RIGHT ·
// /contact → part from CENTRE · home → drop DOWN.

const SLATS = 6;

// the cover frames — Harry's work, rotated per navigation
const FRAMES = [
  "/videos/wall/posters/ferrari.jpg",
  "/videos/films/posters/mclaren-w.jpg",
  "/videos/wall/posters/defender.jpg",
  "/videos/films/posters/otoko-w.jpg",
  "/videos/wall/posters/aw139.jpg",
  "/videos/films/posters/salomon-w.jpg",
  "/videos/wall/posters/eleven-bibury.jpg",
  "/videos/films/posters/zuma-w.jpg",
];
let frameCursor = 0;

function directionFor(path: string): "up" | "right" | "center" | "down" {
  if (path.startsWith("/work")) return "up";
  if (path.startsWith("/about") || path.startsWith("/services")) return "right";
  if (path.startsWith("/contact")) return "center";
  return "down";
}

function labelFor(path: string): string {
  if (path.startsWith("/work")) return "Work";
  if (path.startsWith("/about")) return "About";
  if (path.startsWith("/services")) return "Services";
  if (path.startsWith("/contact")) return "Contact";
  if (path.startsWith("/privacy")) return "Privacy";
  return "Home";
}

export default function RouteTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const navigating = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingDir = useRef<"up" | "right" | "center" | "down">("up");
  const covered = useRef(false);
  const kenRef = useRef<gsap.core.Tween | null>(null);

  // ── CLOSE ──
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
      const main = document.querySelector("main");
      if (!overlay) { router.push(href); return; }

      pendingDir.current = directionFor(path);
      document.documentElement.dataset.transitioning = "1";

      const slats = overlay.querySelectorAll<HTMLElement>(".rt-slat");
      const card = overlay.querySelector<HTMLElement>(".rt-card");
      const img = overlay.querySelector<HTMLImageElement>(".rt-img");
      const label = overlay.querySelector<HTMLElement>(".rt-label");
      overlay.style.pointerEvents = "auto";
      overlay.style.visibility = "visible";

      // fresh frame + label for this ride
      if (img) img.src = FRAMES[frameCursor++ % FRAMES.length];
      if (label) label.textContent = labelFor(path);

      // reset states
      gsap.set(slats, { xPercent: 0, yPercent: 0 });
      slats.forEach((s, i) => {
        const fromLeft = i < SLATS / 2;
        gsap.set(s, { xPercent: fromLeft ? -105 : 105 });
      });
      gsap.set(card, { autoAlpha: 0, scale: 0.62, yPercent: 8, filter: "blur(6px)" });
      if (label) gsap.set(label, { yPercent: 120 });
      if (img) gsap.set(img, { scale: 1.18 });

      const tl = gsap.timeline({
        onComplete: () => {
          covered.current = true;
          window.scrollTo(0, 0);
          router.push(href);
        },
      });
      // the old page recedes under the cover — dims and falls back
      if (main) {
        tl.to(main, { scale: 0.965, filter: "brightness(0.55) blur(2px)", duration: 0.75, ease: "power3.inOut", transformOrigin: "center center" }, 0);
      }
      // slats sweep in from both edges, outer ones leading
      tl.to(slats, {
        xPercent: 0,
        duration: 0.62,
        ease: "power4.inOut",
        stagger: { each: 0.045, from: "edges" },
      }, 0.05)
        // the title card resolves as the cover lands — frame first, name under it
        .to(card, { autoAlpha: 1, scale: 1, yPercent: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }, 0.42)
        .to(label, { yPercent: 0, duration: 0.5, ease: "expo.out" }, 0.58)
        // a breath on the card
        .to({}, { duration: 0.18 });

      // the frame drifts slowly inside the card while covered
      if (img) {
        kenRef.current?.kill();
        kenRef.current = gsap.to(img, { scale: 1.06, duration: 2.4, ease: "none" });
      }
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
    const slats = overlay.querySelectorAll<HTMLElement>(".rt-slat");
    const card = overlay.querySelector<HTMLElement>(".rt-card");
    const label = overlay.querySelector<HTMLElement>(".rt-label");
    const main = document.querySelector("main");
    const dir = pendingDir.current;

    const done = () => {
      kenRef.current?.kill();
      overlay.style.pointerEvents = "none";
      overlay.style.visibility = "hidden";
      if (main) gsap.set(main, { clearProps: "all" });
      delete document.documentElement.dataset.transitioning;
      ScrollTrigger.refresh();
    };

    // the incoming page arrives from slightly below and settles while the
    // cover clears — it is MOVING as you first see it
    if (main) gsap.set(main, { y: 44, scale: 0.985, transformOrigin: "center top" });

    const tl = gsap.timeline({ onComplete: done });
    // push THROUGH the title card — the loader's camera move
    tl.to(label, { yPercent: -120, duration: 0.35, ease: "power2.in" }, 0)
      .to(card, { scale: 2.6, autoAlpha: 0, filter: "blur(8px)", duration: 0.7, ease: "power3.in" }, 0.02);
    // slats clear directionally
    if (dir === "up" || dir === "down") {
      tl.to(slats, {
        yPercent: dir === "up" ? -104 : 104,
        duration: 0.75,
        ease: "power4.inOut",
        stagger: { each: 0.055, from: dir === "up" ? "start" : "end" },
      }, 0.3);
    } else if (dir === "right") {
      tl.to(slats, {
        xPercent: 105,
        duration: 0.75,
        ease: "power4.inOut",
        stagger: { each: 0.055, from: "start" },
      }, 0.3);
    } else {
      tl.to(slats, {
        xPercent: (i: number) => (i < SLATS / 2 ? -105 : 105),
        duration: 0.75,
        ease: "power4.inOut",
        stagger: { each: 0.055, from: "center" },
      }, 0.3);
    }
    if (main) {
      tl.to(main, { y: 0, scale: 1, duration: 1.0, ease: "power3.out" }, 0.38);
    }
    // the page's staged build starts while the slats are still clearing
    tl.call(() => window.dispatchEvent(new Event("hw:page-entered")), [], 0.5);

    return () => { tl.kill(); done(); window.dispatchEvent(new Event("hw:page-entered")); };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[220]"
      style={{ visibility: "hidden" }}
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: SLATS }, (_, i) => (
          <div
            key={i}
            className="rt-slat h-full flex-1 bg-[#f5f1e6] will-change-transform"
            style={{ marginLeft: i === 0 ? 0 : -1 }}
          />
        ))}
      </div>
      {/* the title card — one of Harry's frames + where you're going */}
      <div className="rt-card absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center will-change-[transform,opacity,filter]">
        <div className="h-[34vh] w-[52vw] overflow-hidden md:h-[38vh] md:w-[34vw]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rt-img h-full w-full object-cover will-change-transform" src={FRAMES[0]} alt="" />
        </div>
        <span className="mt-5 block overflow-hidden">
          <span
            className="rt-label font-display block text-[clamp(1.6rem,3vw,2.8rem)] leading-none text-[#0a0a08]"
          >
            Work
          </span>
        </span>
      </div>
    </div>
  );
}
