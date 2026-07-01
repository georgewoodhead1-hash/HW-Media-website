"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, SplitText } from "@/lib/gsap";
import ProjectCTA from "@/components/shell/ProjectCTA";

// About — opens on the statement (writes itself in on load + scroll), then a LIGHT
// values band for contrast, what we do, Harry behind the camera, and Let's create.
// Greyed-text-that-fills-as-you-scroll throughout; no white divider lines.

const OPENER = "Content fills a feed. A film earns attention, and keeps it. We only make the second kind.";

const VALUES = [
  { n: "01", name: "Story", line: "It starts with the story, never the shot list. Coverage is cheap; a film people choose to watch is not." },
  { n: "02", name: "Craft", line: "Cinema standards, whatever the budget. Shot, graded and finished to a level brands are proud to put their name on." },
  { n: "03", name: "In-house", line: "Brief, shoot, edit and grade run through one set of hands, so nothing is lost in translation." },
  { n: "04", name: "Trust", line: "The person who promises the film is the person behind the camera. No layers, no surprises." },
  { n: "05", name: "Speed", line: "Full campaigns turned around in days when it counts, without dropping the standard." },
];

const SERVICES = [
  "Brand films", "Documentary", "Commercial", "Photography",
  "Live events", "Aerial", "Edit & grade", "Social cutdowns",
];

export default function AboutClean() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      // 1) OPENER — greyed words that AUTO-WRITE in on load, then the rest fills as
      //    you scroll the section (the effect George likes, kicked off automatically).
      const opener = el.querySelector<HTMLElement>(".ab-opener");
      if (opener) {
        const s = new SplitText(opener, { type: "words", wordsClass: "ab-oword" });
        splits.push(s);
        gsap.set(s.words, { autoAlpha: 0.16 });
        gsap.to(s.words, { autoAlpha: 1, ease: "none", duration: 0.01, stagger: 0.075, delay: 0.35 });
      }
      gsap.from(".ab-fade", { autoAlpha: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 1.4 });

      // 2) SECTION HEADINGS — greyed characters that fill in as you scroll into them
      gsap.utils.toArray<HTMLElement>(".ab-head").forEach((h) => {
        const s = new SplitText(h, { type: "chars", charsClass: "ab-hchar" });
        splits.push(s);
        gsap.set(s.chars, { autoAlpha: 0.16 });
        gsap.to(s.chars, {
          autoAlpha: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: h, start: "top 86%", end: "top 46%", scrub: 0.6 },
        });
      });

      // 3) staggered rise for value rows / service cards / paragraphs
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 38,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 92%", end: "top 70%", scrub: 0.7 },
        });
      });

      // 4) parallax on the portrait
      const pimg = el.querySelector<HTMLElement>(".ab-portrait img");
      if (pimg) {
        gsap.to(pimg, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: ".ab-portrait", start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      return () => splits.forEach((s) => s.revert());
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="on-media relative overflow-x-clip bg-[#050505] text-[#f5f1e6]">
      {/* OPENER — the statement IS the heading; writes itself in */}
      <section className="mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-5 py-[16vh] md:px-10">
        <p className="ab-fade text-[var(--gold-text)] text-[clamp(0.78rem,1vw,0.95rem)] uppercase tracking-[0.24em]" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
          About — HW Media
        </p>
        <h1 className="ab-opener about-display mt-8 max-w-[19ch] text-[#f5f1e6]" style={{ fontSize: "clamp(2.4rem,6vw,5.4rem)", lineHeight: 1.04, textTransform: "none" }}>
          {OPENER}
        </h1>
        <div className="ab-fade mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-9 py-4 text-[clamp(14px,1.3vw,16px)] font-medium text-[#0a0a08] transition-colors duration-300 hover:bg-[#d7c476]"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            Start a project <span aria-hidden>⟶</span>
          </Link>
        </div>
      </section>

      {/* WHAT WE VALUE — LIGHT band for contrast, editorial row layout */}
      <section className="bg-[#f5f1e6] px-5 py-[16vh] text-[#171717] md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="ab-head about-display mb-12 text-[#171717]" style={{ fontSize: "clamp(2rem,4.4vw,3.6rem)", textTransform: "none" }}>
            What we value
          </h2>
          <div className="divide-y divide-[#171717]/12 border-y border-[#171717]/12">
            {VALUES.map((v) => (
              <div key={v.n} data-rise className="grid grid-cols-1 gap-2 py-7 md:grid-cols-[auto_0.8fr_1.5fr] md:items-baseline md:gap-12">
                <span className="about-display text-[var(--gold-text)]" style={{ fontSize: "clamp(1rem,1.3vw,1.2rem)" }}>{v.n}</span>
                <h3 className="about-display text-[#171717]" style={{ fontSize: "clamp(1.7rem,2.8vw,2.6rem)", textTransform: "none" }}>{v.name}</h3>
                <p className="about-body text-[#171717]/65 text-[clamp(1rem,1.2vw,1.18rem)] leading-relaxed">{v.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO — dark */}
      <section className="px-5 py-[16vh] md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="ab-head about-display mb-12 text-[#f5f1e6]" style={{ fontSize: "clamp(2rem,4.4vw,3.6rem)", textTransform: "none" }}>
            What we do
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s} data-rise className="group flex aspect-[4/3] flex-col justify-between rounded-md border border-[var(--gold)]/15 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/55 hover:bg-[var(--gold)]/[0.04]">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#f5f1e6]/40" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>Service</span>
                <h3 className="about-display text-[#f5f1e6] transition-colors duration-300 group-hover:text-[var(--gold-text)]" style={{ fontSize: "clamp(1.4rem,2.2vw,2.1rem)", textTransform: "none" }}>{s}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEHIND THE CAMERA — Harry, smaller photo + bigger text */}
      <section className="px-5 py-[18vh] md:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.6fr_1.4fr] md:gap-16">
          <div data-rise className="ab-portrait relative aspect-[3/2] w-full max-w-[460px] overflow-hidden rounded-md ring-1 ring-[var(--gold)]/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/harry-field.jpg" alt="Harry Wallis behind the camera" className="h-[116%] w-full object-cover object-[30%_center]" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          </div>
          <div>
            <span className="ab-fade block text-[var(--gold-text)] text-[clamp(0.78rem,1vw,0.95rem)] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
              Behind the camera
            </span>
            <h2 className="ab-head about-display mt-4 text-[#f5f1e6]" style={{ fontSize: "clamp(2.8rem,6vw,5rem)", lineHeight: 0.95, textTransform: "none" }}>
              Harry Wallis
            </h2>
            <p data-rise className="about-body mt-7 max-w-[56ch] text-[#f5f1e6]/75 text-[clamp(1.2rem,1.7vw,1.55rem)] leading-relaxed">
              I direct and shoot every film myself — a CAA-authorised drone pilot, so the aerials are in-house too. When a job needs more, a trusted collective scales around it, but the camera stays with me.
            </p>
          </div>
        </div>
      </section>

      <ProjectCTA />
    </main>
  );
}
