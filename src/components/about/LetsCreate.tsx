"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Contact close — dynamic (Luke's "a bubble comes up and it changes colour"):
// a framed film rises from below as you scroll in while a gold wash breathes
// over it, and the headline letters wipe up. Left layout, clean light surface,
// Archivo. Not basic.
export default function LetsCreate() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-lc-line]", {
        yPercent: 112,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 42%", scrub: 0.5 },
      });
      // the bubble rises
      gsap.fromTo(
        "[data-lc-media]",
        { yPercent: 26, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 38%", scrub: 0.6 },
        },
      );
      // and changes colour — the gold wash breathes in then clears as it settles
      gsap.fromTo(
        "[data-lc-wash]",
        { opacity: 0.85 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 62%", end: "top 30%", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        "[data-lc-tail]",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 58%", end: "top 32%", scrub: 0.5 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="ch-contact"
      data-surface="page"
      className="about-body relative overflow-hidden border-t border-[var(--hairline-dark)] px-5 pb-[12vh] pt-[16vh] text-[var(--fg)] md:px-10"
      aria-label="Contact"
    >
      <div className="grid items-end gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
        {/* left — the headline + CTA */}
        <div>
          <span className="about-label text-[var(--gold-text)]">Let&apos;s talk</span>
          <Link href="/contact" aria-label="Let's create — get in touch" className="mt-5 block">
            <h2 className="about-display leading-[0.86] text-[var(--fg)]" style={{ fontSize: "clamp(3rem,13vw,10rem)" }}>
              <span className="block overflow-hidden">
                <span data-lc-line className="block">Let&apos;s</span>
              </span>
              <span className="block overflow-hidden">
                <span data-lc-line className="block text-[var(--gold-text)]">create.</span>
              </span>
            </h2>
          </Link>
          <div data-lc-tail>
            <p className="mt-8 max-w-md text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-[var(--fg)]/70">
              Tell us the brand and the story you need told. We will come to you and shoot it.
            </p>
            <Link
              href="/contact"
              className="about-label group mt-8 inline-flex items-center gap-2 border-b border-current pb-1 text-[var(--fg)] transition-colors hover:text-[var(--gold-text)]"
            >
              Get in touch <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">⟶</span>
            </Link>
          </div>
        </div>

        {/* right — the dynamic bubble (rises + gold wash) */}
        <div data-lc-media className="w-full md:justify-self-end" style={{ willChange: "transform, opacity" }}>
          <div className="relative overflow-hidden rounded-[28px]">
            <video
              src="/videos/films/zuma-w.mp4"
              poster="/videos/films/posters/zuma-w.jpg"
              autoPlay
              muted
              loop
              playsInline
              aria-label="HW Media film"
              className="aspect-[4/5] w-full object-cover"
            />
            <div data-lc-wash className="lc-wash pointer-events-none absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
