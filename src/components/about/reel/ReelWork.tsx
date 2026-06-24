"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FILMS } from "../_data";

// THE REEL — (03) the work. The films full-bleed and MOVING (oceanfilms.com.br):
// scroll advances one film to the next, the active title runs up the edge as a
// vertical wordmark, the credit sits at the foot, a thin ring frames the frame.
// Real footage plays on the active film; posters crossfade underneath so there is
// never a black flash. The cinematic centrepiece of this version.
export default function ReelWork() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const i = Math.min(FILMS.length - 1, Math.floor(self.progress * FILMS.length * 0.999));
          setActive(i);
        },
      });
      return () => st.kill();
    }, el);
    return () => ctx.revert();
  }, []);

  const film = FILMS[active];

  return (
    <section ref={root} data-surface="media" className="relative bg-black" style={{ height: `${FILMS.length * 80}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* poster crossfade base */}
        {FILMS.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={f.slug} src={`/videos/films/posters/${f.slug}-w.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out" style={{ opacity: active === i ? 1 : 0, filter: "brightness(0.6) contrast(1.04) saturate(1.05)" }} />
        ))}
        {/* active film, moving, on top */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video key={film.slug} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" poster={`/videos/films/posters/${film.slug}-w.jpg`} style={{ filter: "brightness(0.6) contrast(1.04) saturate(1.05)" }}>
          <source src={`/videos/films/${film.slug}-w.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/40" />

        {/* viewfinder ring */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--gold-text)]/30" style={{ width: "60vmin", height: "60vmin" }} />

        {/* vertical title, left edge */}
        <h2 className="about-display absolute left-5 top-1/2 -translate-y-1/2 text-[var(--fg)] transition-opacity duration-500 md:left-9" style={{ writingMode: "vertical-rl", fontSize: "clamp(1.6rem,3.6vw,3rem)", letterSpacing: "0.02em" }}>
          {film.title}
        </h2>

        {/* counter, top-right */}
        <div className="about-label absolute right-5 top-7 text-[var(--fg)]/60 md:right-10">
          <span className="text-[var(--gold-text)]">{String(active + 1).padStart(2, "0")}</span> / {String(FILMS.length).padStart(2, "0")} — Selected work
        </div>

        {/* credit, foot */}
        <div className="absolute bottom-[8vh] left-5 right-5 flex flex-wrap items-end justify-between gap-3 md:left-10 md:right-10">
          <span className="about-label text-[var(--fg)]/75">{film.stat}</span>
          <span className="about-label text-[var(--fg)]/45">Graded · mixed · delivered</span>
        </div>
      </div>
    </section>
  );
}
