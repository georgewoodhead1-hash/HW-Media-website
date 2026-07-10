"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
// FAQ copy lives in content/site.ts — it doubles as FAQPage JSON-LD on the home page
import { FAQS } from "@/content/site";

// 07 — FAQS in plain flow, rows building one by one on their own passage and
// dissipating on exit. (Client final round: split out of the old
// TestimonialsFaqs pair and moved BELOW the Defender band — the old 84vh
// black beat + closer-line wipe that handed off to the pen stroke are gone;
// the bottom line now just draws in and stays.)

export default function Faqs() {
  const faqRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const root = faqRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const kills: (() => void)[] = [];
      const rule = root.querySelector<HTMLElement>(".faq-rule");

      if (rule) {
        gsap.set(rule, { autoAlpha: 0, y: 20 });
        const t = gsap.to(rule, {
          autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", toggleActions: "play none none reverse" },
        });
        kills.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      }

      gsap.utils.toArray<HTMLElement>(".faq-row", root).forEach((row) => {
        const line = row.querySelector<HTMLElement>(".faq-line");
        const rest = Array.from(row.children).filter((c) => c !== line);
        if (line) gsap.set(line, { scaleX: 0, transformOrigin: "center center" });
        gsap.set(rest, { autoAlpha: 0, y: 26 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 86%", toggleActions: "play none none reverse" },
        });
        if (line) tl.to(line, { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0);
        tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.15);
        kills.push(() => { tl.scrollTrigger?.kill(); tl.kill(); });
      });

      // the closing line draws when it arrives — and stays
      const closer = root.querySelector<HTMLElement>(".faq-closer");
      if (closer) {
        gsap.set(closer, { scaleX: 0, transformOrigin: "center center" });
        const t = gsap.to(closer, {
          scaleX: 1, duration: 0.9, ease: "expo.out",
          scrollTrigger: { trigger: closer, start: "top 92%", toggleActions: "play none none reverse" },
        });
        kills.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      }

      // exit: EACH ROW dissipates as it reaches the top of the viewport —
      // you watch them disappear one by one while the page keeps moving.
      gsap.utils.toArray<HTMLElement>(".faq-row", root).forEach((row) => {
        const line = row.querySelector<HTMLElement>(".faq-line");
        const rest = Array.from(row.children).filter((c) => c !== line);
        const t = ScrollTrigger.create({
          trigger: row,
          start: "top 34%",
          end: "top 4%",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(rest, { autoAlpha: 1 - p });
            if (line) gsap.set(line, { autoAlpha: 1 - p });
          },
        });
        kills.push(() => t.kill());
      });
      // the rule dissipates the same way
      if (rule) {
        const t = ScrollTrigger.create({
          trigger: rule,
          start: "top 30%",
          end: "top 4%",
          scrub: true,
          onUpdate: (self) => gsap.set(rule, { autoAlpha: 1 - self.progress }),
        });
        kills.push(() => t.kill());
      }

      return () => kills.forEach((k) => k());
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={faqRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="07 — FAQs"
      className="relative z-30 bg-[var(--bg)] px-5 pb-[14vh] pt-[6vh] text-[var(--fg)] md:px-10 md:pb-[18vh] md:pt-[10vh]"
      aria-label="Frequently asked questions"
    >
      {/* header (George): just the big title, NO side lines — straight into
          the questions */}
      <div className="faq-rule mb-[7vh] text-center">
        <h2 className="inline-block">
          <span
            className="blink font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none"
            style={{ fontFamily: "var(--font-suisse-cond), 'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.015em" }}
          >
            FAQs
          </span>
        </h2>
      </div>

      <div className="w-full">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="faq-row">
              <span aria-hidden className="faq-line block h-px w-full bg-[var(--fg)]" />
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-transform duration-300 hover:translate-x-2 md:py-6"
              >
                <span className="flex items-baseline gap-5 md:gap-8">
                  <span
                    className={`label-mono shrink-0 rounded-[2px] px-1.5 py-0.5 text-[11px] tracking-[0.2em] transition-colors duration-300 ${
                      isOpen ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg)] group-hover:bg-[var(--fg)]/15"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(1.7rem,2.9vw,2.7rem)] leading-[1.05] text-[var(--fg)]">
                    {f.q}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-2xl leading-none text-[var(--fg)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "rotate-[135deg]" : "rotate-0 group-hover:rotate-90"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className="grid overflow-hidden transition-all duration-[400ms] ease-in-out motion-reduce:transition-none"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-[var(--fg)] md:pl-[3.2rem] md:text-[17px]">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {/* the bottom line — draws in and stays */}
        <span aria-hidden className="faq-closer block h-px w-full bg-[var(--fg)]" />
      </div>
    </section>
  );
}
