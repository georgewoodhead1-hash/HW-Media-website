"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// FAQ — click-to-open accordion. The left column keeps the "FAQs" heading and a
// tall vertical video reel (sticky on desktop). The right column is the list of
// questions; clicking a question toggles it open/closed with a smooth
// max-height + opacity transition (~400ms). Only one is open at a time.

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  { q: "How much does a film cost?", a: "Every project is scoped to the story and the budget. You get a clear, fixed quote before anything is booked — no surprises later." },
  { q: "How long does a project take?", a: "Usually two to six weeks from first brief to final master, depending on shoot days and the edit." },
  { q: "Do you shoot internationally?", a: "Yes. We've filmed across the UK, Europe and the salt flats of Utah. Wherever the story is, we travel to it." },
  { q: "Is everything handled in-house?", a: "Direction, cinematography, edit and grade are all in-house. The crew scales with the job; the standard never moves." },
  { q: "Who actually shoots our film?", a: "Harry directs and shoots every project. The person who promises the film is the person behind the camera." },
  { q: "Can you work to a tight deadline?", a: "Yes. We've turned full campaigns around in under 72 hours when it mattered. Tell us the date and we'll be straight about what's possible." },
  { q: "Do you do social cutdowns?", a: "Every master comes with the vertical, square and short-form cutdowns your channels need — mastered properly, not cropped as an afterthought." },
  { q: "What do we get at the end?", a: "The master film plus every cutdown your channels need, all delivered ready to publish." },
  { q: "How do we get started?", a: "Send us a line about the project and we'll come back with ideas and a quote within a couple of days." },
  { q: "Do you handle photography too?", a: "We do. Stills and motion are shot together by the same eye, so the whole campaign feels like one piece of work." },
];

export default function FAQs() {
  const [open, setOpen] = useState<number | null>(0);
  const rootRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);

  // the reel gets "sucked up" off-screen as you scroll past the section, before
  // the finale loads in (client) — scrubbed exit, desktop + motion only.
  useEffect(() => {
    const root = rootRef.current;
    const reel = reelRef.current;
    if (!root || !reel) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        reel,
        { yPercent: 0, autoAlpha: 1, scale: 1 },
        {
          yPercent: -22,
          autoAlpha: 0,
          scale: 0.95,
          ease: "power1.inOut",
          scrollTrigger: { trigger: root, start: "bottom 82%", end: "bottom 46%", scrub: 1.2 },
        },
      );
      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="06 — FAQs"
      className="relative bg-[var(--bg)] px-5 pb-[8vh] pt-[5vh] text-[var(--fg)] md:px-10"
      aria-label="Frequently asked questions"
    >
      <div className="md:flex md:items-start md:gap-12 lg:gap-16">
        {/* LEFT — heading + video reel. Sticky on desktop so the reel stays in
            view while the question list is read. */}
        <div className="relative md:sticky md:top-[18vh] md:w-[40%] md:self-start md:pl-6 lg:w-[36%] lg:pl-10">
          <h2 className="font-display text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[0.95]">
            <span className="text-[var(--gold)]">FAQ&apos;s</span>
          </h2>
          <div ref={reelRef} className="mt-9 aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-xl border border-[var(--hairline-dark)] bg-black will-change-transform md:mt-9 md:w-[clamp(180px,80%,300px)]">
            <video
              className="h-full w-full object-cover"
              src="/videos/films/defender-reel.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>

        {/* RIGHT — the questions as a click-to-open accordion. */}
        <div className="md:flex-1 md:pt-[2vh]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="border-t border-dashed border-[var(--hairline-dark)] last:border-b"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
                >
                  <span
                    className={`font-display text-[clamp(1.1rem,2vw,1.6rem)] leading-tight transition-colors duration-300 ${
                      isOpen ? "text-[var(--fg)]" : "text-[var(--fg)]/40"
                    }`}
                  >
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 text-2xl leading-none text-[var(--gold-text)] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-all duration-[400ms] ease-in-out motion-reduce:transition-none"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="max-w-xl pb-7 text-base leading-relaxed text-[var(--fg)]/65 md:pb-9 md:text-lg"
                      style={{ fontFamily: "var(--font-firma), sans-serif" }}
                    >
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
