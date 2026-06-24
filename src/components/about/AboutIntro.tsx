"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap";

// Intro lock (common to all five reference sites): a short scroll-locked opening
// where "HW MEDIA" assembles, then the panel wipes up to release the world.
// Skipped on return via sessionStorage; respects reduced motion. Removable.
export default function AboutIntro() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("hw-about-intro2") === "1"; } catch { seen = false; }
    if (seen || reduced) { setDone(true); return; }

    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const finish = () => {
      html.style.overflow = "";
      try { sessionStorage.setItem("hw-about-intro2", "1"); } catch { /* ignore */ }
      setDone(true);
    };

    const word = el.querySelector<HTMLElement>("[data-intro-word]");
    let split: SplitText | null = null;
    const tl = gsap.timeline({ onComplete: finish });
    if (word) {
      split = new SplitText(word, { type: "chars", charsClass: "split-line" });
      gsap.set(word, { autoAlpha: 1 });
      tl.from(split.chars, { yPercent: 120, duration: 0.7, ease: "power4.out", stagger: 0.03, delay: 0.2 })
        .from("[data-intro-rule]", { scaleX: 0, transformOrigin: "left", duration: 0.7, ease: "power3.inOut" }, "-=0.25")
        .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.35");
    } else {
      tl.to(el, { autoAlpha: 0, duration: 0.5 });
    }
    return () => { html.style.overflow = ""; tl.kill(); split?.revert(); };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#050505]">
      <h2 data-intro-word className="about-display text-[#f5f1e6]" style={{ fontSize: "clamp(2.4rem,10vw,7rem)", opacity: 0 }}>HW&nbsp;MEDIA</h2>
      <span data-intro-rule className="mt-6 block h-px w-[40vw] max-w-[440px] bg-[var(--gold-text)]" />
    </div>
  );
}
