"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Loading beat for the contact page: an eggshell-cream panel reveals "Tell us
// more" word-by-word in BR Firma, then wipes up to the form. Modest scale (it
// doesn't dominate the screen). Reduced-motion users skip straight to the form.

const WORDS = ["Tell", "us", "more"];

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
      gsap.set(words, { yPercent: 120 });
      const tl = gsap.timeline({ onComplete: () => setDone(true) });
      tl.to(words, { yPercent: 0, duration: 0.5, stagger: 0.07, ease: "expo.out" }, 0.05)
        .to(root, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, "+=0.2");
    }, root);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--cream)] text-[#171717] will-change-transform"
    >
      <h2
        className="flex flex-wrap justify-center gap-x-[0.32em] px-6 text-center text-[clamp(1.6rem,4.5vw,3.4rem)] uppercase tracking-[0.06em]"
        style={{ fontFamily: "var(--font-firma), sans-serif", fontWeight: 600 }}
      >
        {WORDS.map((w) => (
          <span key={w} className="inline-block overflow-hidden pb-[0.12em]">
            <span className="ci-w inline-block will-change-transform">{w}</span>
          </span>
        ))}
      </h2>
    </div>
  );
}
