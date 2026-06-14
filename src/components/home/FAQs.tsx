"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// FAQ, ponder.ai's "Designed for your specialty" mechanic. The left column
// is "Questions answered" + a tall vertical reel. The HEADING is sticky and
// stays frozen at the same line for the whole section while the questions
// scroll up past it. The reel is positioned out of flow (so it doesn't drag
// the sticky release point down) and clears away near the end — so by the
// time the LAST question rises into line with the heading, you're left with
// just the heading and that final question, then the page moves to the finale.

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
          scrollTrigger: { trigger: root, start: "18% top", end: "bottom 64%", scrub: 1.1 },
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
      className="relative bg-[var(--bg)] px-5 pb-[12vh] pt-[14vh] text-[var(--fg)] md:px-10"
      aria-label="Frequently asked questions"
    >
      <div className="md:flex md:items-start md:gap-16">
        {/* LEFT — heading is sticky + frozen; the reel sits out of flow below it */}
        <div className="relative md:sticky md:top-[16vh] md:w-[36%] md:self-start lg:w-[34%]">
          <span className="label-mono text-[11px] tracking-[0.28em] text-[var(--gold)]/80">FAQ</span>
          <h2 className="font-display mt-5 text-[clamp(2rem,3.4vw,3.4rem)] leading-[0.95]">
            Questions<br /><span className="text-[var(--gold)]">answered.</span>
          </h2>
          <div
            ref={reelRef}
            className="mt-9 aspect-[9/16] w-full max-w-[330px] overflow-hidden rounded-xl border border-[var(--hairline-dark)] bg-black will-change-transform md:absolute md:left-0 md:top-[9.5rem] md:mt-0"
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
            top before the first question climbs into the highlight band */}
        <div className="md:flex-1 md:pt-[26vh]">
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
        </div>
      </div>
    </section>
  );
}
