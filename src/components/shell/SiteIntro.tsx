"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Page intro beat (the "Tell us more" treatment the client likes): a cream panel
// reveals the words rising in, then wipes up to the page. Reusable per page —
// "Our work", "About us", etc. Reduced-motion skips straight to the page.
export default function SiteIntro({ words }: { words: string[] }) {
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
      const ws = gsap.utils.toArray<HTMLElement>(".si-w");
      gsap.set(ws, { yPercent: 120 });
      const tl = gsap.timeline({ onComplete: () => setDone(true) });
      tl.to(ws, { yPercent: 0, duration: 0.5, stagger: 0.07, ease: "expo.out" }, 0.05)
        .to(root, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, "+=0.25");
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
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.12em]">
            <span className="si-w inline-block will-change-transform">{w}</span>
          </span>
        ))}
      </h2>
    </div>
  );
}
