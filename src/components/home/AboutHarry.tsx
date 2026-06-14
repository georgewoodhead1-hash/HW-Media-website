"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ScrollWords from "@/components/shell/ScrollWords";

// SC.06 — about (just Harry for now, per the client call; expands later).
// Marked-up portrait, grade hover, plain words, and the stats counting up.
const STATS = [
  { k: "Years filming", v: 8, suffix: "+" },
  { k: "Films delivered", v: 60, suffix: "+" },
  { k: "Clients who come back", v: 8, suffix: " in 10" },
];

export default function AboutHarry() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-portrait",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%" },
        },
      );
      // the portrait drifts inside its frame as you pass — film, not print
      gsap.fromTo(
        ".about-portrait img",
        { yPercent: -7, scale: 1.12 },
        {
          yPercent: 7, scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      // heading words rise like the rest of the house copy
      const h = root.querySelector(".about-head");
      if (h) {
        const words = h.querySelectorAll("span.w");
        gsap.set(words, { opacity: 0.1, y: 14 });
        gsap.to(words, {
          opacity: 1, y: 0, stagger: 0.08, ease: "power1.out",
          scrollTrigger: { trigger: h, start: "top 84%", end: "top 50%", scrub: 0.5 },
        });
      }
      gsap.fromTo(
        ".about-rise",
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 72%" },
        },
      );
      gsap.utils.toArray<HTMLElement>(".stat-count", root).forEach((el) => {
        const target = parseInt(el.dataset.count ?? "0", 10);
        const suffix = el.dataset.suffix ?? "";
        const state = { n: 0 };
        gsap.to(state, {
          n: target, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => { el.textContent = `${Math.round(state.n)}${suffix}`; },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="crew"
      data-theme="dark"
      data-chapter="05 — About"
      className="px-5 pb-24 pt-56 md:px-10"
      aria-label="About Harry"
    >
      <p className="scene-marker label-mono mb-16 opacity-60">
        <span>05 — About</span>
      </p>
      <div className="mx-auto grid max-w-[1560px] items-center gap-14 md:grid-cols-12">
        <div className="about-rise relative md:col-span-5">
          <span className="font-hand absolute -top-8 left-2 z-10 rotate-[-3deg] text-2xl">
            Harry · Director &amp; DP
          </span>
          <div className="about-portrait group relative overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/harry-bw.jpg" alt="Harry Wallis, founder and director of HW Media, on set" className="block w-full grayscale" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/harry-color.jpg"
              alt=""
              aria-hidden
              className="absolute inset-0 w-full transition-[clip-path] duration-500 [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0%)]"
              style={{ transitionTimingFunction: "var(--ease-expo)" }}
            />
            <span className="font-hand absolute bottom-2 right-2 rotate-[-4deg] text-xl">the grade ⟶</span>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="about-head font-display display-lg">
            <span className="w inline-block">Behind</span>{" "}
            <span className="w inline-block">the</span>{" "}
            <span className="w inline-block font-accent text-[var(--gold)]">camera.</span>
          </h2>
          <ScrollWords
            className="mt-8 max-w-lg leading-relaxed text-[var(--paper-text)]/80"
            text="HW Media is led by Harry Wallis: a London director and cinematographer who has filmed for McLaren, Aston Martin, Norton and NatWest. He shoots every project himself, and he's a CAA-authorised drone pilot, so the aerials are in-house too."
          />
          <ScrollWords
            className="mt-4 max-w-lg leading-relaxed text-[var(--paper-text)]/80"
            text="Around him sits a trusted collective: producers, camera ops, sound, colour. The team scales with the job. The standard doesn't move."
          />
          <div className="about-rise mt-10 grid grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.k}>
                <span className="stat-count font-display text-3xl md:text-4xl" data-count={s.v} data-suffix={s.suffix}>
                  0{s.suffix}
                </span>
                <p className="label-mono mt-2 text-[10px] opacity-55">{s.k}</p>
              </div>
            ))}
          </div>
          <Link href="/about" className="about-rise font-hand mt-8 inline-block rotate-[-2deg] text-[1.6rem]">
            the full story ⟶
          </Link>
        </div>
      </div>
    </section>
  );
}
