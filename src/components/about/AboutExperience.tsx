"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import SceneCanvasMount from "./world/SceneCanvasMount";
import CustomCursor from "./CustomCursor";
import AboutIntro from "./AboutIntro";
import Harry from "./Harry";
import Method from "./Method";
import ContactCircle from "./ContactCircle";
import AboutFooter from "./AboutFooter";

// About — the immersive rebuild (APPROVED). One persistent WebGL world fixed
// behind every DOM scene; text floats over it; scroll moves through it. Order:
// intro lock -> hero (mouse-reactive shader) -> Harry -> the work toy (films you
// can fling on the canvas) -> pinned method -> contact circle -> footer stamp.
export default function AboutExperience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const h = el.querySelector<HTMLElement>("[data-hero-mark]");
      let split: SplitText | null = null;
      if (h) {
        split = new SplitText(h, { type: "lines,chars", linesClass: "split-line" });
        gsap.set(h, { autoAlpha: 1 });
        gsap.from(split.chars, { yPercent: 120, duration: 1.3, ease: "power4.out", stagger: 0.045, delay: 0.2 });
      }
      gsap.from("[data-hero-rev]", { autoAlpha: 0, y: 28, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.7 });
      gsap.to("[data-hero-mark]", { yPercent: -12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "60% top", scrub: 0.8 } });
      return () => split?.revert();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="about-experience on-media relative bg-[#050505] text-[#f5f1e6]">
      <AboutIntro />
      {/* the ONE persistent world canvas, fixed behind everything */}
      <SceneCanvasMount />
      <CustomCursor />

      <div className="relative z-10">
        {/* HERO */}
        <section className="flex min-h-screen flex-col justify-end px-5 pb-[12vh] pt-[26vh] md:px-10">
          <p data-hero-rev className="about-body mb-8 max-w-md text-[clamp(0.95rem,1.5vw,1.1rem)] leading-[1.45] text-[#f5f1e6]/85">
            A creative media company that makes brand films <span className="font-accent">worth remembering.</span>
          </p>
          <h1 data-hero-mark data-cursor="Showreel" className="about-display flex items-end leading-[0.82] text-[#f5f1e6]" style={{ fontSize: "clamp(4rem,19vw,17rem)", opacity: 0 }}>
            HW&nbsp;MEDIA
            <span className="mb-[0.12em] ml-[0.06em] inline-block aspect-square w-[0.1em] rounded-full" style={{ background: "var(--gold-text)" }} />
          </h1>
        </section>

        {/* HARRY */}
        <Harry />

        {/* THE WORK TOY — pointer-events-none so you can grab the films on the
            canvas behind; the films float + are flingable, gated to this section. */}
        <section id="ch-work" className="pointer-events-none relative" style={{ minHeight: "165vh" }}>
          <div className="sticky top-0 flex h-screen items-center justify-center px-5 md:px-10">
            <h2 className="about-display text-center text-[#f5f1e6]" style={{ fontSize: "clamp(1.8rem,4.6vw,3.4rem)" }}>
              The work, <span className="font-accent text-[var(--gold-text)]">in your hands.</span>
            </h2>
          </div>
        </section>

        {/* METHOD (pinned) */}
        <Method />

        {/* CONTACT (the circle) */}
        <ContactCircle />

        {/* FOOTER stamp */}
        <AboutFooter />
      </div>
    </main>
  );
}
