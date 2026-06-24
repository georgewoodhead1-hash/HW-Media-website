"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import CustomCursor from "./CustomCursor";
import AboutIntro from "./AboutIntro";
import Business from "./Business";
import Harry from "./Harry";
import Method from "./Method";
import ContactCircle from "./ContactCircle";
import AboutFooter from "./AboutFooter";

// About — content first. It is about the BUSINESS (HW Media) and about HARRY.
// Dark, one type family (Bar's Owners Wide, no accent face), smooth scrubbed
// motion the whole way down (the contact circle is the bar for smoothness). No
// background gradient, no draggable toy. Order: hero -> what HW Media is -> Harry
// -> how we work -> the contact circle -> footer stamp.
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
      gsap.to("[data-hero-mark]", { yPercent: -14, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: 0.8 } });
      return () => split?.revert();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="about-experience on-media relative bg-[#050505] text-[#f5f1e6]">
      <AboutIntro />
      <CustomCursor />

      {/* HERO */}
      <section className="flex min-h-screen flex-col justify-end px-5 pb-[12vh] pt-[26vh] md:px-10">
        <p data-hero-rev className="about-body mb-8 max-w-md text-[clamp(1rem,1.6vw,1.3rem)] leading-[1.4] text-[#f5f1e6]/85">
          A creative media company making films for brands.
        </p>
        <h1 data-hero-mark className="about-display flex items-end leading-[0.82] text-[#f5f1e6]" style={{ fontSize: "clamp(4rem,19vw,17rem)", opacity: 0 }}>
          HW&nbsp;MEDIA
          <span className="mb-[0.12em] ml-[0.06em] inline-block aspect-square w-[0.1em] rounded-full" style={{ background: "var(--gold-text)" }} />
        </h1>
      </section>

      <Business />
      <Harry />
      <Method />
      <ContactCircle />
      <AboutFooter />
    </main>
  );
}
