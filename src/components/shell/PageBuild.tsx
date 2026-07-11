"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";

// The page's own build-in, v2 — STAGED like the services page (George's
// reference for "the words come on, then the line, then the page builds"):
//   1. [data-enter-words]  — heading splits into words that rise from clips
//   2. [data-enter-line]   — hairlines draw across
//   3. [data-enter]        — everything else rises in DOM order
// Runs once the route transition's cover is clearing (hw:page-entered), so
// the build is what you watch as the slats leave — never a blank page.
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

    const lines = Array.from(main.querySelectorAll<HTMLElement>("[data-enter-line]"));
    gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

    const enters = Array.from(main.querySelectorAll<HTMLElement>("[data-enter]"));
    gsap.set(enters, { autoAlpha: 0, y: 26 });

    let tl: gsap.core.Timeline | null = null;
    const cancel = onPageEntered(() => {
      tl = gsap.timeline();
      let at = 0.05;
      if (risers.length) {
        tl.to(risers, { y: 0, duration: 1.0, ease: "expo.out", stagger: 0.08 }, at);
        at += 0.45;
      }
      if (lines.length) {
        tl.to(lines, { scaleX: 1, duration: 0.8, ease: "expo.out", stagger: 0.1 }, at);
        at += 0.3;
      }
      if (enters.length) {
        tl.to(enters, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.12 }, at);
      }
    });

    return () => {
      cancel();
      tl?.kill();
      gsap.set(enters, { clearProps: "opacity,visibility,transform" });
      gsap.set(lines, { clearProps: "transform" });
      restore.forEach((r) => r());
    };
  }, []);

  return null;
}
