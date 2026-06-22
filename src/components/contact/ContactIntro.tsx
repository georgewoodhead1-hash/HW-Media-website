"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Auteur-style loading beat that plays once when the contact page mounts:
// a full-screen gold panel reveals "Got something in mind?" word-by-word,
// swaps to "Tell us more", then wipes up to hand off to the form beneath.
// Reduced-motion users skip straight to the form (no panel).

const WORDS = ["Got", "something", "in", "mind?"];

export default function ContactIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".ci-w");
      const line2 = root.querySelector(".ci-2");

      gsap.set(words, { yPercent: 120 });
      gsap.set(line2, { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({ onComplete: () => setDone(true) });
      tl.to(words, { yPercent: 0, duration: 1, stagger: 0.13, ease: "expo.out" }, 0.25)
        .to(words, { yPercent: -120, duration: 0.7, stagger: 0.05, ease: "power3.in" }, "+=0.85")
        .to(line2, { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" }, "-=0.35")
        .to(line2, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "+=0.9")
        .to(root, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "-=0.15");
    }, root);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[var(--gold)] text-[#0a0a08] will-change-transform"
    >
      <h2
        className="font-display flex flex-wrap justify-center gap-x-[0.28em] px-6 text-center text-[clamp(2.3rem,7vw,5.4rem)] leading-[0.95]"
        style={{ fontWeight: 400 }}
      >
        {WORDS.map((w) => (
          <span key={w} className="inline-block overflow-hidden pb-[0.08em]">
            <span className="ci-w inline-block will-change-transform">{w}</span>
          </span>
        ))}
      </h2>
      <p
        className="ci-2 mt-7 text-[13px] uppercase tracking-[0.32em]"
        style={{ fontFamily: "var(--font-firma), sans-serif" }}
      >
        Tell us more
      </p>
    </div>
  );
}
