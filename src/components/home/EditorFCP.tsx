"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import Rule from "@/components/shell/Rule";

// Our process — copied from 1820productions (George's direction, 2026-07-03):
//   1. tiny label, then the staggered STATEMENT stack with subtext lines
//      ("We listen. / We craft. / We deliver." + the sign-off pair) —
//      ⚠ placeholder copy lifted from 1820; reword before launch.
//   2. the SERVICES stack: 01–04 numbered rows on drawn hairlines — number,
//      big condensed title, paragraph, and an image per row (stock/micro
//      posters as placeholders).
// Flowing (no pin), everything mask-rises; the "Deliver." full stop is what
// the testimonials dot peels off (cream now — accents are zero-gold).

const STATEMENTS = [
  { line: "We listen.", sub: "Every film starts with your story, not our showreel." },
  { line: "We craft.", sub: "Cinema standards, whatever the budget." },
  { line: "We deliver.", sub: "The master, plus every cutdown your channels need." },
];

const STAGES = [
  { n: "01", name: "PRE-PRODUCTION", copy: "Brief, treatment, casting, locations, schedule. The film is planned to the minute before a frame is shot.", img: "/videos/micro/posters/m02.jpg" },
  { n: "02", name: "PRODUCTION", copy: "Direction and cinematography on location. If it can be done in-camera, it's done in-camera.", img: "/videos/micro/posters/m07.jpg" },
  { n: "03", name: "EDIT", copy: "Edit, grade, sound and motion under one roof. The film finds its rhythm.", img: "/videos/micro/posters/m10.jpg" },
  { n: "04", name: "DELIVER", copy: "The master plus every cutdown, mastered properly — nothing cropped as an afterthought.", img: "/videos/micro/posters/m12.jpg" },
];

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: gsap.Context | undefined;
    const splits: SplitText[] = [];

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        // statement lines mask-rise one after another as you scroll to them
        gsap.utils.toArray<HTMLElement>(".proc-stmt").forEach((stmt) => {
          const s = new SplitText(stmt.querySelector("h3"), { type: "lines", mask: "lines" });
          splits.push(s);
          const tl = gsap.timeline({ scrollTrigger: { trigger: stmt, start: "top 84%" } });
          tl.from(s.lines, { yPercent: 112, duration: 1.15, ease: "power3.out" })
            .from(stmt.querySelector("p"), { autoAlpha: 0, y: 16, duration: 0.8, ease: "power3.out" }, 0.25);
        });
        // the sign-off pair
        gsap.utils.toArray<HTMLElement>(".proc-sign").forEach((n) => {
          gsap.from(n, { autoAlpha: 0, y: 30, duration: 1, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 86%" } });
        });
        // service rows: hairline draws, number/title/copy rise, image clip-reveals
        gsap.utils.toArray<HTMLElement>(".proc-row").forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 84%" } });
          tl.from(row.querySelector(".proc-hair"), { scaleX: 0, transformOrigin: "left center", duration: 1.3, ease: "expo.out" }, 0)
            .from(row.querySelectorAll(".proc-cell"), { autoAlpha: 0, y: 34, duration: 0.95, ease: "power3.out", stagger: 0.09 }, 0.15)
            .from(row.querySelector(".proc-img"), { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "expo.out" }, 0.2);
          const img = row.querySelector("img");
          if (img) tl.from(img, { scale: 1.15, duration: 1.9, ease: "expo.out" }, 0.2);
        });
      }, el);
    });

    return () => { cancelled = true; ctx?.revert(); splits.forEach((s) => s.revert()); };
  }, []);

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="media"
      className="relative z-20 bg-[#0e0e0d] px-5 py-[16vh] text-[#f5f1e6] md:px-10"
      aria-label="Our process"
    >
      <Rule label="Our process" bg="#0e0e0d" />

      {/* the statement stack (1820 work-page opener) */}
      <div className="mx-auto mt-[10vh] max-w-[1400px]">
        {STATEMENTS.map((s) => (
          <div key={s.line} className="proc-stmt py-[4.5vh]">
            <h3 className="font-display text-[clamp(2.8rem,7.5vw,7.5rem)] leading-[0.94]">{s.line}</h3>
            <p className="mt-3 max-w-[46ch] text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.5] text-[#f5f1e6]/60">{s.sub}</p>
          </div>
        ))}
        <div className="py-[6vh]">
          <h3 className="proc-sign font-display text-[clamp(1.9rem,4.2vw,4.2rem)] leading-[1.02] text-[#f5f1e6]/85">
            Stylish production. Seamless execution.
          </h3>
          <p className="proc-sign mt-4 text-[clamp(1.05rem,1.4vw,1.3rem)] text-[#f5f1e6]/55">
            We&rsquo;re not a cult. But people do keep coming back.
          </p>
        </div>
      </div>

      {/* the services stack: 01–04 with images */}
      <div className="mx-auto mt-[6vh] max-w-[1400px]">
        {STAGES.map((s) => (
          <div key={s.n} className="proc-row relative py-[7vh]">
            <span className="proc-hair absolute left-0 top-0 block h-px w-full bg-[#f5f1e6]/16" />
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[6rem_1.1fr_1fr_0.9fr] md:gap-10">
              <span className="proc-cell text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#f5f1e6]/45" style={{ fontFamily: "var(--font-firma), sans-serif" }}>{s.n}</span>
              <h3 className="proc-cell font-display text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[0.92]">
                {s.name}
                {s.n === "04" && <span className="wd-stop text-[var(--gold-text)]">.</span>}
              </h3>
              <p className="proc-cell max-w-[44ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.55] text-[#f5f1e6]/70">{s.copy}</p>
              <div className="proc-img relative aspect-[4/3] overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.name.toLowerCase()} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        ))}
        <div className="block h-px w-full bg-[#f5f1e6]/16" />
      </div>
    </section>
  );
}
