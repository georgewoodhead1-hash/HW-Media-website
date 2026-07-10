"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";

// The SECOND loading animation (client): once the route transition lands,
// the page builds itself — headings rise word by word out of clip lines,
// then everything marked data-enter staggers up in order. Drop this inside
// any page and mark the elements:
//   data-enter        — fades + rises in, in DOM order
//   data-enter-words  — text splits into words that rise one by one (1820)
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
        inner.style.transform = "translateY(112%)";
        inner.textContent = w;
        mask.appendChild(inner);
        el.appendChild(mask);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
        risers.push(inner);
      });
      restore.push(() => { el.innerHTML = original; });
    });

    const enters = Array.from(main.querySelectorAll<HTMLElement>("[data-enter]"));
    gsap.set(enters, { autoAlpha: 0, y: 26 });

    let tl: gsap.core.Timeline | null = null;
    const cancel = onPageEntered(() => {
      tl = gsap.timeline();
      if (risers.length) {
        tl.to(risers, { y: 0, duration: 1.0, ease: "expo.out", stagger: 0.07 }, 0.05);
      }
      if (enters.length) {
        tl.to(enters, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }, risers.length ? 0.35 : 0.05);
      }
    });

    return () => {
      cancel();
      tl?.kill();
      gsap.set(enters, { clearProps: "opacity,visibility,transform" });
      restore.forEach((r) => r());
    };
  }, []);

  return null;
}
