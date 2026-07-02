"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// PLAY REEL — the new beat between Trusted By and Featured Projects (the Exo
// Ape converge, made ours): the words PLAY and REEL flank a small centred
// window of the showreel; as you scroll they converge while the window scales
// to full bleed, ending as one full-screen reel moment with a glass
// play-with-sound invitation. One mechanism, pure film.
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (a: number, b: number, t: number) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function PlayReel() {
  const rootRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const win = el.querySelector<HTMLElement>(".pr-win");
      const wordL = el.querySelector<HTMLElement>(".pr-l");
      const wordR = el.querySelector<HTMLElement>(".pr-r");
      const pill = el.querySelector<HTMLElement>(".pr-pill");
      const vid = el.querySelector<HTMLVideoElement>(".pr-vid");
      if (!win || !wordL || !wordR) return;

      gsap.set(pill, { autoAlpha: 0, y: 18 });

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const grow = sm(0.05, 0.7, p);
          // the window scales small → full bleed
          gsap.set(win, {
            width: lerp(0.34 * vw, vw, grow),
            height: lerp(0.42 * vh, vh, grow),
            borderRadius: lerp(12, 0, grow),
          });
          // the words converge from the flanks to sit tight against centre,
          // riding OVER the footage (difference blend) as it swallows them
          const inset = lerp(0.26 * vw, 0.0 * vw, sm(0.05, 0.75, p));
          gsap.set(wordL, { x: -inset - 0.5 * (wordL.offsetWidth + 18) });
          gsap.set(wordR, { x: inset + 0.5 * (wordR.offsetWidth + 18) });
          // glass invitation rises once full bleed
          const e = sm(0.82, 0.94, p);
          gsap.set(pill, { autoAlpha: e, y: lerp(18, 0, e), pointerEvents: e > 0.5 ? "auto" : "none" });
        },
      });

      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { const v = vid; if (!v) return; if (e.isIntersecting) safePlay(v); else v.pause(); }),
        { rootMargin: "20%" },
      );
      io.observe(el);
      return () => { st.kill(); io.disconnect(); };
    }, el);
    return () => ctx.revert();
  }, []);

  const openReel = () => {
    setOpen(true);
    dialogRef.current?.showModal();
    const r = fullRef.current;
    if (r) { r.currentTime = 0; safePlay(r); }
  };
  const closeReel = () => {
    fullRef.current?.pause();
    dialogRef.current?.close();
    setOpen(false);
  };

  return (
    <section ref={rootRef} data-theme="dark" data-surface="media" className="relative h-[260vh] bg-[#050505] text-[#f5f1e6]" aria-label="Play the showreel">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* the reel window */}
        <div className="pr-win relative overflow-hidden will-change-[width,height]" style={{ width: "34vw", height: "42vh", borderRadius: 12 }}>
          <video
            className="pr-vid h-full w-full object-cover"
            src="/videos/showreel-full.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        </div>
        {/* the converging words — riding over the footage */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-difference">
          <span className="pr-l font-display absolute text-[clamp(3rem,8vw,8rem)] leading-none text-white will-change-transform">PLAY</span>
          <span className="pr-r font-display absolute text-[clamp(3rem,8vw,8rem)] leading-none text-white will-change-transform">REEL<span className="text-[var(--gold-text)]">.</span></span>
        </div>
        {/* glass invitation once full bleed */}
        <button
          type="button"
          onClick={openReel}
          className="pr-pill glass backdrop-blur-md backdrop-saturate-150 absolute bottom-[10vh] rounded-full px-9 py-4 text-[clamp(14px,1.3vw,16px)] text-white"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          Play with sound <span aria-hidden>⟶</span>
        </button>
      </div>

      <dialog ref={dialogRef} onClose={closeReel} className="m-0 h-screen max-h-none w-screen max-w-none bg-black p-0 backdrop:bg-black/90">
        <div className="relative flex h-full w-full items-center justify-center">
          <video ref={fullRef} className="h-full w-full object-contain" src="/videos/showreel-full.mp4" controls={open} playsInline />
          <button
            onClick={closeReel}
            className="label-mono absolute right-6 top-6 rounded-full border border-[var(--hairline-dark)] bg-black/40 px-5 py-3 text-[#f5f1e6] backdrop-blur-sm transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            aria-label="Close showreel"
          >
            Close ✕
          </button>
        </div>
      </dialog>
    </section>
  );
}
