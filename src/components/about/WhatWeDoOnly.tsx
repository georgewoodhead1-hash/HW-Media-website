"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/content/services";
import FooterReveal from "@/components/shell/FooterReveal";

// About — RESET (George). Only the kept What We Do grid lives here.
// The rest of the page starts fresh, direction to come from George.
export default function WhatWeDoOnly() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rise]", el).forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 44,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 86%" },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        <section data-surface="page" className="relative z-10 bg-[var(--bg)] pb-[14vh] pt-[22vh]">
          <div data-rise className="text-center">
            <h1 className="inline-block">
              <span
                className="blink-title font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none"
                style={{ fontFamily: "var(--font-suisse-cond), 'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.015em" }}
              >
                What we do
              </span>
            </h1>
          </div>
          <div className="mt-[7vh] grid grid-cols-2 gap-0 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-rise
                aria-label={`${s.name} — what we offer`}
                className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black"
                onMouseEnter={(e) => { const v = e.currentTarget.querySelector("video"); v?.play().catch(() => {}); }}
                onMouseLeave={(e) => { e.currentTarget.querySelector("video")?.pause(); }}
              >
                <video
                  className="absolute inset-0 h-full w-full object-cover opacity-25 transition-opacity duration-500 group-hover:opacity-75"
                  src={s.clip}
                  poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden
                />
                <div aria-hidden className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/20" />
                <h3 className="relative text-center">
                  <span className="blink blink-fill text-[clamp(12px,1.05vw,15px)] !text-[#f5f1e6] group-hover:!text-[var(--bg)]">
                    {s.name}
                  </span>
                </h3>
              </Link>
            ))}
          </div>
          <p data-rise className="mt-[7vh] text-center">
            <Link href="/work" className="blink text-[13px] tracking-[0.05em]">
              Discover the work
            </Link>
          </p>
        </section>
      </main>
      <FooterReveal />
    </>
  );
}
