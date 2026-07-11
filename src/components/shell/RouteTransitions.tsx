"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Page-to-page transform, v6 — one continuous choreography, no cuts:
//
//  CLOSE  the old page falls back and dims while cream slats WEAVE in —
//         odd slats drop from the top, even slats rise from the bottom,
//         edges leading — and as the weave locks, a title card builds ON
//         the cover: one of Harry's frames wipes open, the destination
//         name rises out of a clip, a hairline draws beneath it
//  HOLD   a breath — the frame drifts inside the card
//  OPEN   the name exits, the card drives PAST the viewer (the loader's
//         camera move), the slats clear in the destination's direction —
//         and the NEW PAGE ARRIVES THROUGH THE SAME MOTION: it starts low,
//         small, dim and soft, and settles to identity while its staged
//         build (hw:page-entered → PageBuild) runs. Every page enters the
//         same way. The page is never shown at rest until the motion ends.
//
// Directions: /work → up · /about,/services → right · /contact → centre ·
// home → down. Frames rotate per navigation.

const SLATS = 6;

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
      const cardImgWrap = overlay.querySelector<HTMLElement>(".rt-imgwrap");
      const img = overlay.querySelector<HTMLImageElement>(".rt-img");
      const label = overlay.querySelector<HTMLElement>(".rt-label");
      const rule = overlay.querySelector<HTMLElement>(".rt-rule");

      // arm the overlay in a clean state BEFORE it becomes visible
      gsap.set(slats, { xPercent: 0 });
      slats.forEach((s, i) => gsap.set(s, { yPercent: i % 2 === 0 ? -105 : 105 }));
      gsap.set(card, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
      if (cardImgWrap) gsap.set(cardImgWrap, { clipPath: "inset(100% 0% 0% 0%)" });
      if (img) { img.src = FRAMES[frameCursor++ % FRAMES.length]; gsap.set(img, { scale: 1.22 }); }
      if (label) { label.textContent = labelFor(path); gsap.set(label, { yPercent: 120 }); }
      if (rule) gsap.set(rule, { scaleX: 0 });
      overlay.style.pointerEvents = "auto";
      overlay.style.visibility = "visible";

      const tl = gsap.timeline({
        onComplete: () => {
          covered.current = true;
          window.scrollTo(0, 0);
          router.push(href);
        },
      });
      // the old page falls back under the weave
      if (main) {
        tl.to(main, {
          scale: 0.955, filter: "brightness(0.5) blur(2px)", duration: 0.85,
          ease: "power3.inOut", transformOrigin: "center center",
        }, 0);
      }
      // the WEAVE: odd slats drop, even slats rise, edges leading
      tl.to(slats, {
        yPercent: 0,
        duration: 0.7,
        ease: "power4.inOut",
        stagger: { each: 0.055, from: "edges" },
      }, 0)
        // the title card BUILDS on the cover: frame wipes open upward…
        .to(cardImgWrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "expo.out" }, 0.55)
        .to(img, { scale: 1.08, duration: 0.9, ease: "power2.out" }, 0.55)
        // …the name rises out of its clip, the hairline draws
        .to(label, { yPercent: 0, duration: 0.55, ease: "expo.out" }, 0.72)
        .to(rule, { scaleX: 1, duration: 0.5, ease: "expo.out" }, 0.8)
        // a breath with the card resolved
        .to({}, { duration: 0.2 });

      // the frame keeps drifting while covered
      if (img) {
        kenRef.current?.kill();
        kenRef.current = gsap.to(img, { scale: 1.02, duration: 3.0, ease: "none", delay: 1.0 });
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
    const rule = overlay.querySelector<HTMLElement>(".rt-rule");
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

    // the new page waits BENEATH the cover: low, small, dim, soft — it will
    // arrive through the clearing slats, never appear at rest
    if (main) {
      gsap.set(main, {
        y: 72, scale: 0.965, filter: "brightness(0.55) blur(3px)",
        transformOrigin: "center top",
      });
    }

    const tl = gsap.timeline({ onComplete: done });
    // the card hands over: name drops out, hairline retracts, then the
    // camera pushes THROUGH the frame
    tl.to(label, { yPercent: -130, duration: 0.32, ease: "power2.in" }, 0)
      .to(rule, { scaleX: 0, duration: 0.3, ease: "power2.in" }, 0.02)
      .to(card, { scale: 2.7, autoAlpha: 0, filter: "blur(9px)", duration: 0.75, ease: "power3.in" }, 0.06);
    // slats clear toward the destination
    if (dir === "up" || dir === "down") {
      tl.to(slats, {
        yPercent: dir === "up" ? -105 : 105,
        duration: 0.8,
        ease: "power4.inOut",
        stagger: { each: 0.06, from: dir === "up" ? "start" : "end" },
      }, 0.34);
    } else if (dir === "right") {
      tl.to(slats, {
        xPercent: 105,
        duration: 0.8,
        ease: "power4.inOut",
        stagger: { each: 0.06, from: "start" },
      }, 0.34);
    } else {
      tl.to(slats, {
        xPercent: (i: number) => (i < SLATS / 2 ? -105 : 105),
        duration: 0.8,
        ease: "power4.inOut",
        stagger: { each: 0.06, from: "center" },
      }, 0.34);
    }
    // the new page ARRIVES: rises, brightens, sharpens, settles — timed so
    // it is still finishing as the last slat leaves
    if (main) {
      tl.to(main, {
        y: 0, scale: 1, filter: "brightness(1) blur(0px)",
        duration: 1.25, ease: "power3.out",
      }, 0.42);
    }
    // staged page builds run while the cover is still clearing
    tl.call(() => window.dispatchEvent(new Event("hw:page-entered")), [], 0.55);

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
      {/* the title card — Harry's frame + where you're going */}
      <div className="rt-card absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center will-change-[transform,opacity,filter]">
        <div className="rt-imgwrap h-[34vh] w-[52vw] overflow-hidden md:h-[40vh] md:w-[36vw]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rt-img h-full w-full object-cover will-change-transform" src={FRAMES[0]} alt="" />
        </div>
        <span className="mt-6 block overflow-hidden">
          <span className="rt-label font-display block text-[clamp(1.7rem,3.2vw,3rem)] leading-none text-[#0a0a08]">
            Work
          </span>
        </span>
        <span aria-hidden className="rt-rule mt-4 block h-px w-[min(20vw,220px)] bg-[#0a0a08]/70" style={{ transformOrigin: "center" }} />
      </div>
    </div>
  );
}
