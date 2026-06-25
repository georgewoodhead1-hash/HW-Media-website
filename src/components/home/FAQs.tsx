"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import MobileReveal from "@/components/shell/MobileReveal";

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
      const pinEl = root.querySelector<HTMLElement>(".faq-pin");
      const head = root.querySelector<HTMLElement>(".faq-head");
      const qs = gsap.utils.toArray<HTMLElement>(".faq-q", root);
      // PIN the reel column so it genuinely STAYS IN PLACE for the whole
      // section. CSS sticky released halfway and the reel scrolled off (measured
      // 698px of drift). A real ScrollTrigger pin keeps it fixed top to bottom.
      const pinST = pinEl
        ? ScrollTrigger.create({ trigger: root, start: "top top", end: "bottom top", pin: pinEl, pinSpacing: false })
        : null;
      // entrance: fade everything up on enter — OPACITY ONLY (no transform, so it
      // can't fight the pin).
      gsap.set([head, reel].filter(Boolean), { autoAlpha: 0, y: 28 });
      gsap.set(qs, { autoAlpha: 0, y: 34, clipPath: "inset(0% 0% 100% 0%)" });
      const introTl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 86%", end: "top 34%", scrub: 1.1 } });
      introTl
        .to([head, reel].filter(Boolean), { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }, 0)
        // each question wipes up + rises in turn (not a flat fade)
        .to(qs, { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, stagger: 0.1, ease: "power3.out" }, 0.2);
      // exit: the reel fades out IN PLACE (it's pinned, so it never moves) as the
      // section's tail leaves and the finale comes up over it.
      const tween = gsap.to(reel, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "bottom 55%", end: "bottom 18%", scrub: 0.7 },
      });
      return () => { pinST?.kill(); introTl.scrollTrigger?.kill(); introTl.kill(); tween.scrollTrigger?.kill(); tween.kill(); };
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
      {/* items-stretch (not items-start) so the LEFT column is as tall as the
          question list — that lets the reel stay sticky for the WHOLE list
          instead of releasing early and leaving a black void. */}
      <div className="md:flex md:items-stretch md:gap-12 lg:gap-16">
        {/* LEFT — heading + video reel, held in place while the questions read. */}
        <div className="relative md:w-[40%] md:pl-6 lg:w-[36%] lg:pl-10">
          <div className="faq-pin">
          <h2 className="faq-head font-display text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[0.95]">
            <span className="text-[var(--gold-text)]">FAQs</span>
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
        </div>

        {/* RIGHT — the questions as a click-to-open accordion. */}
        <MobileReveal className="md:flex-1 md:pt-[2vh]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="faq-q border-t border-[var(--hairline-dark)] last:border-b"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
                >
                  <span className="flex items-baseline gap-4 md:gap-6">
                    <span
                      className={`label-mono shrink-0 text-[11px] tracking-[0.2em] transition-colors duration-300 ${
                        isOpen ? "text-[var(--gold-text)]" : "text-[var(--fg)]/30"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[clamp(1.05rem,1.5vw,1.35rem)] font-medium leading-snug transition-colors duration-300 ${
                        isOpen ? "text-[var(--fg)]" : "text-[var(--fg)]/55"
                      }`}
                    >
                      {f.q}
                    </span>
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
                    <p className="max-w-xl pb-7 text-[15px] leading-relaxed text-[var(--fg)]/80 md:pb-9 md:pl-[2.8rem] md:text-[17px]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </MobileReveal>
      </div>
    </section>
  );
}
