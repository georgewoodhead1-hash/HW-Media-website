"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// FAQ, ponder.ai's "Designed for your specialty" mechanic. The left column
// is "FAQs" + a tall vertical reel. The HEADING is sticky and stays frozen at
// the same line for the whole section while the questions scroll up past it.
// The reel is positioned out of flow (so it doesn't drag the sticky release
// point down) and clears away near the end — so by the time the LAST question
// rises into line with the heading, you're left with just the heading and that
// final question, then the page moves to the finale.
//
// CUT-OFF FIX: each question lights up via an IntersectionObserver band centred
// on the viewport (middle ~16%). For the LAST questions to reach that band they
// need scroll room *below* them — otherwise the section ends and the page moves
// on before they ever climb to centre, so they read as "cut off". A trailing
// spacer after the list gives the final question that room. The spacer also
// extends the flex container, which is what the sticky left column measures its
// release against, so the heading stays put until the very end.

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
  const rootRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const reel = reelRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(".faq-item"));

    // which question is in the middle of the screen lights up
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.getAttribute("data-i")));
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    items.forEach((it) => io.observe(it));

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (!reel) return;
      // the reel drifts down and clears out over the back half of the section —
      // power3.in keeps it fully present for most of the scroll, then drops it
      // away so the final question lands with just the heading beside it.
      const clear = gsap.fromTo(
        reel,
        { yPercent: 0, autoAlpha: 1 },
        {
          yPercent: 26, autoAlpha: 0, ease: "power3.in",
          // clear out over the questions, finishing before the trailing spacer
          // so the heading sits alone with the final question. Tied to the
          // section centre rather than its bottom (the spacer makes the section
          // much taller now), keeping the timing stable across widths.
          scrollTrigger: { trigger: root, start: "12% top", end: "62% top", scrub: 1.1 },
        },
      );
      return () => {
        clear.scrollTrigger?.kill();
        clear.kill();
      };
    });

    return () => {
      io.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="06 — FAQs"
      className="relative bg-[var(--bg)] px-5 pb-[12vh] pt-[7vh] text-[var(--fg)] md:px-10"
      aria-label="Frequently asked questions"
    >
      <div className="md:flex md:items-start md:gap-12 lg:gap-16">
        {/* LEFT — heading is sticky + frozen; the reel sits out of flow below it.
            Bumped higher (top-[9vh]) and widened a touch so the reel never
            clips off the left edge at laptop widths. */}
        <div className="relative md:sticky md:top-[9vh] md:w-[40%] md:self-start lg:w-[36%]">
          <h2 className="font-display text-[clamp(2.4rem,4.4vw,4.2rem)] leading-[0.95]">
            <span className="text-[var(--gold)]">FAQs</span>
          </h2>
          <div
            ref={reelRef}
            className="mt-9 aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-xl border border-[var(--hairline-dark)] bg-black will-change-transform md:absolute md:left-0 md:top-[7.5rem] md:mt-0 md:w-[clamp(180px,80%,300px)]"
          >
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

        {/* RIGHT — the questions; a lead gap lets the heading settle at the
            top before the first question climbs into the highlight band.
            Lead trimmed (the whole section moved up) so the first question
            isn't pushed too low. */}
        <div className="md:flex-1 md:pt-[18vh]">
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              data-i={i}
              className="faq-item border-t border-dashed border-[var(--hairline-dark)] py-9 last:border-b md:py-12"
            >
              <p
                className={`text-[clamp(1.25rem,1.8vw,1.85rem)] font-medium leading-tight transition-colors duration-500 ${
                  active === i ? "text-[var(--fg)]" : "text-[var(--fg)]/30"
                }`}
                style={{ fontFamily: "var(--font-dm), sans-serif" }}
              >
                {f.q}
              </p>
              <div
                className={`grid transition-all duration-500 ${
                  active === i ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
                style={{ transitionTimingFunction: "var(--ease-expo)" }}
              >
                <p className="max-w-xl overflow-hidden text-base leading-relaxed text-[var(--fg)]/65 md:text-lg">
                  {f.a}
                </p>
              </div>
            </div>
          ))}
          {/* Trailing run-out: lets the final question scroll up into the
              centred highlight band (it can't light up without room below it),
              and keeps the flex container — and therefore the sticky heading —
              alive right to the end. Without this the last questions read as
              cut off because the section ends before they reach centre. */}
          <div aria-hidden className="hidden md:block md:h-[55vh]" />
        </div>
      </div>
    </section>
  );
}
