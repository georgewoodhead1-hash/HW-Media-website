"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/content/services";
import TrailField from "@/components/shell/TrailField";

// The two KEPT About sections (client: "What We Do is really good… Behind
// the Camera is cool"), shared by all three redesign variants so the words
// and behaviour stay identical while only the new sections differ.

export function useRises(root: React.RefObject<HTMLElement | null>) {
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
  }, [root]);
}

export function WhatWeDo() {
  const root = useRef<HTMLElement>(null);
  useRises(root);
  return (
    <section ref={root} data-surface="page" className="relative z-10 bg-[var(--bg)] pb-[14vh] pt-[10vh]">
      <div data-rise className="text-center">
        <h2 className="inline-block">
          <span
            className="blink-title font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none"
            style={{ fontFamily: "var(--font-suisse-cond), 'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.015em" }}
          >
            What we do
          </span>
        </h2>
      </div>
      {/* mobile = 2-up little squares (George: single column was way too long) */}
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
  );
}

export function BehindTheCamera() {
  const root = useRef<HTMLElement>(null);
  useRises(root);
  return (
    <section ref={root} data-surface="page" className="abx-crew relative z-20 bg-[var(--bg)] py-[26vh] md:py-[30vh]">
      <TrailField images={["m01", "m02", "m03", "m04", "m05", "m06", "m08", "m10", "m11", "m12"].map((m) => `/videos/micro/posters/${m}.jpg`)} />
      <div className="pointer-events-none relative z-10 mx-auto flex flex-col items-center justify-center text-center">
        <h2 data-rise className="about-display text-[clamp(2.6rem,7vw,6.4rem)] leading-[0.94]">
          Behind
          <br />
          the
          <br />
          camera
        </h2>
      </div>
    </section>
  );
}
