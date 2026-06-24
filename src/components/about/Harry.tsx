"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

// Scene — Harry. Monumental name, a framed portrait that tilts/warps toward the
// cursor (Luke's mouse-tilt cards), and a real paragraph floating in front. NOTE:
// the portrait is /images/harry-color.jpg, a placeholder until George sends a
// real shot of Harry.
export default function Harry() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frame = el.querySelector<HTMLElement>("[data-h-frame]");
    let move: ((e: PointerEvent) => void) | undefined;
    let leave: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const h = el.querySelector<HTMLElement>("[data-h-name]");
      let split: SplitText | null = null;
      if (h) {
        split = new SplitText(h, { type: "lines,chars", linesClass: "split-line" });
        gsap.set(h, { autoAlpha: 1 });
        gsap.from(split.chars, { yPercent: 115, ease: "power4.out", duration: 1.1, stagger: 0.04, scrollTrigger: { trigger: el, start: "top 70%", once: true } });
      }
      gsap.from("[data-h-rev]", { autoAlpha: 0, y: 30, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 65%", once: true } });
      gsap.fromTo("[data-h-img]", { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 75%", end: "top 35%", scrub: 0.6 } });

      if (frame) {
        const rx = gsap.quickTo(frame, "rotationX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(frame, "rotationY", { duration: 0.5, ease: "power3" });
        move = (e) => {
          const r = frame.getBoundingClientRect();
          const px = (e.clientX - (r.left + r.width / 2)) / r.width;
          const py = (e.clientY - (r.top + r.height / 2)) / r.height;
          ry(px * 10);
          rx(-py * 8);
        };
        leave = () => { rx(0); ry(0); };
        frame.addEventListener("pointermove", move);
        frame.addEventListener("pointerleave", leave);
      }
    }, el);

    return () => {
      if (frame && move) frame.removeEventListener("pointermove", move);
      if (frame && leave) frame.removeEventListener("pointerleave", leave);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="ch-harry" className="relative flex min-h-screen items-center px-5 py-[14vh] md:px-10">
      <div className="grid w-full grid-cols-12 items-center gap-y-8">
        <div data-h-frame data-cursor="Harry" className="relative col-span-12 md:col-span-6 md:col-start-7" style={{ perspective: 900, transformStyle: "preserve-3d", willChange: "transform" }}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm ring-1 ring-[var(--hairline-dark)] md:ml-auto md:max-w-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-h-img src="/images/harry-color.jpg" alt="Harry Wallis, founder of HW Media" className="h-full w-full object-cover" style={{ willChange: "clip-path, transform", filter: "brightness(1.05) contrast(1.03)" }} />
          </div>
        </div>
        <div className="relative z-10 col-span-12 -mt-[12vh] md:col-span-7 md:col-start-1 md:mt-0">
          <h2 data-h-name className="about-display leading-[0.86] text-[#f5f1e6]" style={{ fontSize: "clamp(2.8rem,8.5vw,7rem)", opacity: 0 }}>
            Harry <span className="gold-lg">Wallis.</span>
          </h2>
          <p data-h-rev className="about-body mt-7 max-w-md text-[clamp(1.05rem,1.5vw,1.35rem)] leading-[1.45] text-[#f5f1e6]/85">
            Behind HW Media is one director. Harry writes, shoots and cuts every film himself, and works close to the brand, so the people who commission the film are the people he makes it with.
          </p>
        </div>
      </div>
    </section>
  );
}
