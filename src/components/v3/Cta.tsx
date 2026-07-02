"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

// V3 §6a — THE ASK. A quiet centred beat between the process and the finale:
// label, masked headline, glass CTA. Entrance is choreographed, exit hands
// straight into the whirlwind on plain canvas — no cut.

export default function Cta() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 72%" },
        defaults: { ease: "power3.out" },
      });
      tl.from(".v3t-label", { autoAlpha: 0, y: 16, duration: 0.8 }, 0)
        .from(".v3t-line", { yPercent: 112, duration: 1.1, ease: "expo.out" }, 0.15)
        .from(".v3t-btn", { autoAlpha: 0, y: 22, duration: 0.9 }, 0.55);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="px-5 pb-[14vh] pt-[16vh] text-center md:px-10" aria-label="Start a project">
      <p
        className="v3t-label text-[11px] uppercase tracking-[0.32em] text-[#c3c3c3]/55"
        style={{ fontFamily: "var(--font-firma), sans-serif" }}
      >
        New business
      </p>
      <h2 className="font-display mt-6 text-[clamp(2.4rem,6vw,6rem)] leading-[0.94] text-[#f5f1e6]">
        <span className="block overflow-hidden pb-[0.08em]">
          {/* gold is reserved for full stops — the "?" stays cream */}
          <span className="v3t-line block">Have a project in mind?</span>
        </span>
      </h2>
      <div className="v3t-btn mt-9">
        <Link
          href="/contact"
          className="glass inline-flex items-center gap-2 rounded-full px-9 py-4 text-[clamp(14px,1.3vw,16px)] text-white backdrop-blur-md backdrop-saturate-150"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          Start here <span aria-hidden>⟶</span>
        </Link>
      </div>
    </section>
  );
}
