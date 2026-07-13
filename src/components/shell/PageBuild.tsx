"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";

// The page's own build-in, v6 — the page is UNMASKED by the transition,
// never faded (George):
//   1. [data-enter="pop"]   — small geometry scales into place
//   2. [data-enter-words]   — heading splits into words that rise from clips
//   3. [data-enter-line]    — hairlines draw
//   4. [data-enter]         — clip-path unmasks in the COVER'S OWN GRAMMAR
//      (html[data-transition-dir]):
//        up     (weave)   reveals bottom-up
//        down   (cascade) reveals top-down
//        right  (sweep)   reveals left-to-right, riding the home sweep
//        iris   (corners) reveals in an EXPANDING CIRCLE from the centre —
//                         the lens-spiral's opening pupil
//        center (shades)  reveals in alternating venetian strips
// Beats overlap hard (il capo pacing) — words, lines and blocks assemble
// together, not one after another. Runs off hw:page-entered.
export default function PageBuild() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;

    // split headings into a CHAR WAVE before paint — the il capo recipe
    // (probed from their bundle): per-word overflow masks with the
    // negative-margin padding trick (descenders never clip), each char
    // rising y 200% → 0 over 0.9s on the house quint ease, char-indexed
    // stagger 0.03 — one left-to-right wave across the whole phrase
    const wordEls = Array.from(main.querySelectorAll<HTMLElement>("[data-enter-words]"));
    const risers: HTMLElement[] = [];
    const restore: (() => void)[] = [];
    wordEls.forEach((el) => {
      const original = el.innerHTML;
      const text = el.textContent ?? "";
      el.textContent = "";
      text.split(/\s+/).filter(Boolean).forEach((w, i, arr) => {
        const mask = document.createElement("span");
        mask.style.display = "inline-flex";
        mask.style.overflow = "hidden";
        mask.style.padding = "0.3em 0.1em";
        mask.style.margin = "-0.3em -0.1em";
        mask.style.lineHeight = "inherit";
        mask.style.verticalAlign = "bottom";
        const word = w + (i < arr.length - 1 ? " " : "");
        word.split("").forEach((ch) => {
          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.style.whiteSpace = "pre";
          inner.style.transform = "translateY(200%)";
          inner.style.willChange = "transform";
          inner.textContent = ch;
          mask.appendChild(inner);
          risers.push(inner);
        });
        el.appendChild(mask);
      });
      restore.push(() => { el.innerHTML = original; });
    });

    const dir = document.documentElement.dataset.transitionDir ?? "up";

    const lines = Array.from(main.querySelectorAll<HTMLElement>("[data-enter-line]"));
    gsap.set(lines, {
      scaleX: 0,
      // iris + shades draw their hairlines from the centre outward, the
      // same axis the cover moves on; vertical covers keep the left draw
      transformOrigin: dir === "iris" || dir === "center" ? "center center" : "left center",
    });

    const all = Array.from(main.querySelectorAll<HTMLElement>("[data-enter]"));
    // "pop" variant — small geometry (ornaments, marks) scales into place
    const pops = all.filter((el) => el.dataset.enter === "pop");
    const enters = all.filter((el) => el.dataset.enter !== "pop");
    gsap.set(pops, { scale: 0.4, autoAlpha: 0, transformOrigin: "center center" });
    const targets = new Map<HTMLElement, string>();
    enters.forEach((el, i) => {
      let hidden: string;
      let target = "inset(0% 0% 0% 0%)";
      if (dir === "up") hidden = "inset(100% 0% 0% 0%)";
      else if (dir === "down") hidden = "inset(0% 0% 100% 0%)";
      else if (dir === "right") hidden = "inset(0% 100% 0% 0%)";
      else if (dir === "iris") {
        hidden = "circle(0% at 50% 46%)";
        target = "circle(140% at 50% 46%)";
      } else {
        // venetian: alternate sides — but an element marked data-enter="ltr"
        // always reveals in reading direction (form fields read wrong when
        // their tail appears first)
        hidden = el.dataset.enter === "ltr" || i % 2 === 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
      }
      targets.set(el, target);
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
      // OVERLAPPED build (il capo): everything assembles together
      if (pops.length) tl.to(pops, { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(1.7)", stagger: 0.08 }, 0.02);
      // the char wave: 0.9s / quint / 0.03 per char, left to right
      if (risers.length) tl.to(risers, { y: 0, duration: 0.9, ease: "power4.inOut", stagger: 0.03 }, 0.08);
      if (lines.length) tl.to(lines, { scaleX: 1, duration: 0.75, ease: "expo.out", stagger: 0.08 }, 0.3);
      if (enters.length) {
        tl.to(enters, {
          clipPath: (_i: number, el: Element) => targets.get(el as HTMLElement) ?? "inset(0% 0% 0% 0%)",
          duration: 0.8,
          ease: "power4.inOut",
          stagger: 0.09,
        }, 0.42);
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
