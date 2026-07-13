"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";

// The page's own build-in, v4 — the page is UNMASKED by the transition,
// never faded (George):
//   1. [data-enter-words]  — heading splits into words that rise from clips
//   2. [data-enter-line]   — hairlines draw across
//   3. [data-enter]        — clip-path wipes open in the SAME DIRECTION the
//      cover is clearing (html[data-transition-dir]) — content never moves
//      or fades, it is revealed in place, like the cover blocks leaving
// Runs once the route transition's cover is clearing (hw:page-entered).
export default function PageBuild() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;

    // split word-rise targets BEFORE paint so nothing flashes at rest
    const wordEls = Array.from(main.querySelectorAll<HTMLElement>("[data-enter-words]"));
    const risers: HTMLElement[] = [];
    const restore: (() => void)[] = [];
    wordEls.forEach((el) => {
      const original = el.innerHTML;
      const text = el.textContent ?? "";
      el.textContent = "";
      text.split(/\s+/).filter(Boolean).forEach((w, i, arr) => {
        const mask = document.createElement("span");
        mask.style.display = "inline-block";
        mask.style.overflow = "hidden";
        mask.style.verticalAlign = "bottom";
        const inner = document.createElement("span");
        inner.style.display = "inline-block";
        inner.style.whiteSpace = "pre";
        inner.style.transform = "translateY(112%)";
        inner.textContent = w + (i < arr.length - 1 ? " " : "");
        mask.appendChild(inner);
        el.appendChild(mask);
        risers.push(inner);
      });
      restore.push(() => { el.innerHTML = original; });
    });

    // the reveal is built FROM the cover's own motion — every destination
    // unmasks in its transition's grammar (no movement, no fade):
    //   up    (weave)   — strips clear upward → content reveals bottom-up
    //   down  (cascade) — cover pours down    → content reveals top-down
    //   right (curtain) — halves part from centre → content OPENS CENTRE-OUT
    //   center (shades) — venetian slats     → content reveals in ALTERNATING
    //                     left/right strips, element by element
    const dir = document.documentElement.dataset.transitionDir ?? "up";

    const lines = Array.from(main.querySelectorAll<HTMLElement>("[data-enter-line]"));
    gsap.set(lines, {
      scaleX: 0,
      // curtain + shades draw their hairlines from the centre outward, the
      // same axis the cover moves on; vertical covers keep the left draw
      transformOrigin: dir === "right" || dir === "center" ? "center center" : "left center",
    });

    const all = Array.from(main.querySelectorAll<HTMLElement>("[data-enter]"));
    // "pop" variant — small geometry (ornaments, marks) scales into place
    // instead of unmasking; a clip wipe is invisible at ornament size
    const pops = all.filter((el) => el.dataset.enter === "pop");
    const enters = all.filter((el) => el.dataset.enter !== "pop");
    gsap.set(pops, { scale: 0.4, autoAlpha: 0, transformOrigin: "center center" });
    enters.forEach((el, i) => {
      const hidden =
        dir === "up" ? "inset(100% 0% 0% 0%)" :
        dir === "down" ? "inset(0% 0% 100% 0%)" :
        dir === "right" ? "inset(0% 50% 0% 50%)" :          // curtain: centre-out
        i % 2 === 0 ? "inset(0% 100% 0% 0%)" :               // shades: L → R…
        "inset(0% 0% 0% 100%)";                              // …then R → L
      gsap.set(el, { clipPath: hidden });
    });

    let restored = false;
    const restoreAll = () => {
      if (restored) return;
      restored = true;
      gsap.set(enters, { clearProps: "clipPath,opacity,visibility,transform" });
      gsap.set(pops, { clearProps: "opacity,visibility,transform" });
      gsap.set(lines, { clearProps: "transform" });
      restore.forEach((r) => r());
    };

    let tl: gsap.core.Timeline | null = null;
    const cancel = onPageEntered(() => {
      tl = gsap.timeline({ onComplete: restoreAll });
      let at = 0.05;
      if (pops.length) {
        tl.to(pops, { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(1.7)", stagger: 0.1 }, at);
        at += 0.15;
      }
      if (risers.length) {
        tl.to(risers, { y: 0, duration: 1.0, ease: "expo.out", stagger: 0.08 }, at);
        at += 0.45;
      }
      if (lines.length) {
        tl.to(lines, { scaleX: 1, duration: 0.8, ease: "expo.out", stagger: 0.1 }, at);
        at += 0.3;
      }
      if (enters.length) {
        tl.to(enters, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "power4.inOut", stagger: 0.12 }, at);
      }
    });

    return () => {
      cancel();
      tl?.kill();
      restoreAll();
    };
  }, []);

  return null;
}
