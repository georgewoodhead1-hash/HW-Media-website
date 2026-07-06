"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// The Defender band + THE PEN STROKE (George's revised spec, 2026-07-04):
// the FAQ's bottom line now WIPES AWAY left→right and a black beat follows —
// so the pen no longer retraces it. Instead the stroke FOLLOWS DOWN out of
// that black: it enters from the top right, descends into the frame, then
// draws TWO anti-clockwise hand-drawn loops around "Wherever the story is"
// (the loops George likes). No dot, no pin — drawn on passage with a custom
// pen-pace, deliberate through the loops. Geometry is MEASURED at runtime
// from the real headline box (+ fixed clearance), so the ring can never clip
// the words at any viewport.

const TOP_EXT_VH = 0.5; // how far the stroke reaches up into the black beat

// hand wobble — deterministic, so paths are stable across rebuilds
const wob = (i: number, amp = 7) => Math.sin(i * 12.9898) * amp;

export default function FeatureBand() {
  const root = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const sec = root.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!sec || !svg || !path) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const img = sec.querySelector<HTMLElement>(".fb-img");
      const cta = sec.querySelector<HTMLElement>(".fb-cta");
      const line = sec.querySelector<HTMLElement>(".fb-line");
      let len = 1;
      // the words hold back until the pen has ringed their space
      gsap.set(line, { autoAlpha: 0, y: 14 });

      // ── build the stroke from MEASURED geometry ──
      const build = () => {
        if (!line) return;
        const vw = sec.clientWidth;
        const ext = Math.round(window.innerHeight * TOP_EXT_VH);
        const secTop = sec.getBoundingClientRect().top + window.scrollY;
        const orig = secTop - ext; // svg's top edge in document coords
        const H = sec.clientHeight + ext;
        svg.setAttribute("viewBox", `0 0 ${vw} ${H}`);

        // the headline box (+ generous clearance = the ring can't clip words)
        const hB = line.getBoundingClientRect();
        const cx = hB.left + hB.width / 2;
        const cy = hB.top + window.scrollY - orig + hB.height / 2;
        const rx = hB.width / 2 + 96;
        const ry = hB.height / 2 + 72;
        const k = 0.5523; // circle-from-beziers handle ratio

        // one anti-clockwise lap: top → LEFT → bottom → right → top
        const lap = (r1: number, r2: number, seed: number) => {
          const w = (i: number, amp?: number) => wob(seed + i, amp);
          return (
            ` C ${cx - r1 * k + w(1)} ${cy - r2 + w(2)}, ${cx - r1 + w(3)} ${cy - r2 * k + w(4)}, ${cx - r1 + w(5)} ${cy + w(6)}` +
            ` C ${cx - r1 + w(7)} ${cy + r2 * k + w(8)}, ${cx - r1 * k + w(9)} ${cy + r2 + w(10)}, ${cx + w(11)} ${cy + r2 + w(12)}` +
            ` C ${cx + r1 * k + w(13)} ${cy + r2 + w(14)}, ${cx + r1 + w(15)} ${cy + r2 * k + w(16)}, ${cx + r1 + w(17)} ${cy + w(18)}` +
            ` C ${cx + r1 + w(19)} ${cy - r2 * k + w(20)}, ${cx + r1 * k + w(21)} ${cy - r2 + w(22)}, ${cx + w(23)} ${cy - r2 + w(24)}`
          );
        };

        // the pen FOLLOWS DOWN out of the black beat: in from the top right
        // edge, a long easing descent leftwards to the ring's top
        const startX = vw + 60;
        const startY = ext * 0.12;
        let d = `M ${startX} ${startY}`;
        d += ` C ${vw - 260} ${startY + 140 + wob(80, 10)}, ${cx + rx + 260} ${cy - ry - 220}, ${cx + 10} ${cy - ry + wob(90)}`;
        // TWO anti-clockwise laps, second slightly different = hand-drawn
        d += lap(rx, ry, 1);
        d += lap(rx * 0.94, ry * 1.07, 40);
        // tail flick off the second lap
        d += ` C ${cx - rx * 0.5} ${cy - ry - 26}, ${cx - rx * 0.72} ${cy - ry * 0.7}, ${cx - rx * 0.6} ${cy - ry * 0.4}`;

        path.setAttribute("d", d);
        len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
      };
      build();
      // re-measure once fonts and layout have truly settled — mis-joins came
      // from measuring before the closer line reached its final position
      if (document.fonts?.ready) document.fonts.ready.then(() => { build(); ScrollTrigger.refresh(); });
      const settle = window.setTimeout(() => { build(); ScrollTrigger.refresh(); }, 1200);

      // the pen's pace — a custom piecewise map from scroll progress to drawn
      // length: quick on the descent, deliberate through the loops
      const pace = (p: number) => {
        if (p <= 0.3) return (p / 0.3) * 0.3;              // descent: quick
        return 0.3 + ((p - 0.3) / 0.7) * 0.7;              // loops: deliberate
      };
      const sm = (a: number, b: number, t: number) => {
        const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
        return x * x * (3 - 2 * x);
      };

      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top 96%",
        end: "center 38%",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onRefresh: build,
        onUpdate: (self) => {
          const p = self.progress;
          path.style.strokeDashoffset = `${len * (1 - pace(p))}`;
          if (img) gsap.set(img, { scale: 1.08 - 0.08 * p });
          // sequence (George): fade FAQs → draw the line → THEN the writing
          const wIn = sm(0.66, 0.8, p);
          if (line) gsap.set(line, { autoAlpha: wIn, y: (1 - wIn) * 14 });
          const e = sm(0.82, 0.94, p);
          if (cta) gsap.set(cta, { autoAlpha: e, y: (1 - e) * 18, pointerEvents: e > 0.5 ? "auto" : "none" });
        },
      });

      const onResize = () => { build(); ScrollTrigger.refresh(); };
      window.addEventListener("resize", onResize);
      return () => { st.kill(); window.clearTimeout(settle); window.removeEventListener("resize", onResize); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      data-theme="dark"
      data-surface="media"
      className="relative z-[35] bg-[var(--bg)]"
      aria-label="HW Media"
    >
      <div className="fb-stage relative h-[80vh] overflow-hidden md:h-screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/harry-field.jpg"
          alt="HW Media film production"
          className="fb-img absolute inset-x-0 top-[-9%] h-[118%] w-full object-cover object-[center_26%] will-change-transform"
        />
        {/* the fade-down George likes — image sinks into the dark at the bottom */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-40% to-[var(--page-bg)]" />

        {/* the words the pen will ring */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 md:px-10">
          <div className="fb-line relative will-change-transform">
            <h2 className="font-display text-center text-[clamp(2rem,4.6vw,4.4rem)] leading-[0.98] text-[#f5f1e6]">
              Wherever
              <br />
              the story is<span className="text-[var(--gold-text)]">.</span>
            </h2>
          </div>
        </div>

        {/* the interactive cue — bracket grammar, hover fills solid */}
        <div className="fb-cta absolute inset-x-0 bottom-[26vh] flex justify-center">
          <a href="/contact" className="blink text-[clamp(13px,1.2vw,15px)] tracking-[0.05em]">
            Start here
          </a>
        </div>
      </div>

      {/* THE PEN STROKE — reaches up into the black beat after the FAQ line
          wipes away, following the page down into the band */}
      <svg
        ref={svgRef}
        aria-hidden
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 top-[-50vh] hidden h-[calc(100%+50vh)] w-full md:block"
        fill="none"
      >
        <path
          ref={pathRef}
          stroke="var(--fg)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
}
