"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AGENCY, COLLECTIVE, CREW } from "./_data";
import ContactCircle from "./ContactCircle";

// About — rebuilt clean from nothing. No labels, no counters, no vertical
// wordmarks, no tiny captions, no icon clutter. Just big type, vast space, one
// dimmed film behind the opening line, the crew stated plainly, and the kept
// "Let's create". Dark + gold, Archivo, scroll-tied motion.
export default function AboutClean() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 44,
          ease: "none",
          scrollTrigger: { trigger: node, start: "top 90%", end: "top 56%", scrub: 0.8 },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="on-media relative bg-[#050505] text-[#f5f1e6]">
      {/* opening line over one dimmed film */}
      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-5 pb-[14vh] md:px-12">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video className="h-full w-full object-cover" src="/videos/films/chasing-the-salt-w.mp4" autoPlay muted loop playsInline style={{ filter: "brightness(0.4) contrast(1.05)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/30" />
        </div>
        <h1 data-rise className="about-display text-[#f5f1e6]" style={{ fontSize: "clamp(2.6rem,8.5vw,7.5rem)", lineHeight: 0.94 }}>
          Who&rsquo;s behind<br />the camera<span className="gold-lg">.</span>
        </h1>
        <p data-rise className="about-body mt-9 max-w-[60ch] text-[clamp(1.1rem,1.6vw,1.55rem)] leading-relaxed text-[#f5f1e6]/80">
          {AGENCY.lead}
        </p>
      </section>

      {/* what we are */}
      <section className="px-5 py-[20vh] md:px-12">
        <h2 data-rise className="about-display max-w-[22ch] text-[#f5f1e6]" style={{ fontSize: "clamp(2rem,5.4vw,4.8rem)", lineHeight: 1.02 }}>
          A creative agency for brands that <span className="gold-lg">refuse to be ordinary</span>.
        </h2>
        <p data-rise className="about-body mt-10 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-[#f5f1e6]/70">
          {AGENCY.crewLead}
        </p>
      </section>

      {/* the crew — stated plainly, no images, no labels */}
      <section className="px-5 pb-[8vh] md:px-12">
        <div className="border-t border-[var(--hairline-dark)]">
          {CREW.map((m) => (
            <article key={m.name} data-rise className="grid gap-x-12 gap-y-3 border-b border-[var(--hairline-dark)] py-[7vh] md:grid-cols-[1fr_1.1fr]">
              <div>
                <h3 className="about-display text-[#f5f1e6]" style={{ fontSize: "clamp(2rem,5vw,3.8rem)" }}>{m.name}</h3>
                <p className="about-body mt-3 text-[clamp(1rem,1.3vw,1.2rem)] text-[var(--gold-text)]">{m.role}</p>
              </div>
              <p className="about-body max-w-[44ch] self-end text-[clamp(1.05rem,1.3vw,1.25rem)] leading-relaxed text-[#f5f1e6]/72">{m.line}</p>
            </article>
          ))}
        </div>
        <p data-rise className="about-body mx-auto mt-[14vh] max-w-[48ch] text-center text-[clamp(1.2rem,1.8vw,1.7rem)] leading-relaxed text-[#f5f1e6]/65">
          {COLLECTIVE}
        </p>
      </section>

      {/* the creed */}
      <section className="flex min-h-[72vh] items-center justify-center px-5 md:px-12">
        <p data-rise className="about-display max-w-[26ch] text-center text-[var(--gold-text)]" style={{ fontSize: "clamp(1.7rem,3.6vw,3rem)", lineHeight: 1.12, textTransform: "none" }}>
          &ldquo;{AGENCY.aristotle}&rdquo;
        </p>
      </section>

      <ContactCircle />
    </main>
  );
}
