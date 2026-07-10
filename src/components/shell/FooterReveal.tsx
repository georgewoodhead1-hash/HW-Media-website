"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// The footer, LAYERED BEHIND the page (sticky reveal). George's spec: the
// SHOWREEL plays see-through behind everything; the big email + columns
// (OUR BASE / SOCIALS) sit pushed to the LEFT; the wordmark rides BIG in the
// bottom-right with the film glowing through it. A dark veil lifts away with
// the page so the reveal reads as one continuous move. Only grey lives here.

const PAGES: [string, string][] = [
  ["Work", "/work"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function FooterReveal() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const spacer = spacerRef.current;
    const foot = footRef.current;
    if (!spacer || !foot) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const veil = foot.querySelector<HTMLElement>(".ft-veil");
    const zones = gsap.utils.toArray<HTMLElement>(".ft-zone", foot);
    const lines = gsap.utils.toArray<HTMLElement>(".ft-line", foot);

    gsap.set(zones, { autoAlpha: 0, y: 44 });
    gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: spacer, start: "top bottom", end: "bottom 88%", scrub: 0.7 },
    });
    tl.fromTo(veil, { opacity: 0.9 }, { opacity: 0, ease: "none", duration: 1 }, 0)
      .to(zones, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.14, ease: "power2.out" }, 0.05)
      .to(lines, { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0.35);

    // the reel only runs while the footer is actually on show
    const video = foot.querySelector<HTMLVideoElement>("video");
    let io: IntersectionObserver | null = null;
    if (video) {
      io = new IntersectionObserver(
        (es) => es.forEach((e) => {
          if (e.isIntersecting) safePlay(video); else video.pause();
        }),
        { threshold: 0.1 },
      );
      io.observe(spacer);
    }

    return () => { tl.scrollTrigger?.kill(); tl.kill(); io?.disconnect(); };
  }, []);

  return (
    <>
      {/* scroll room — the page lifts through this to reveal the footer */}
      <div ref={spacerRef} aria-hidden className="h-[82vh]" />

      <footer
        ref={footRef}
        className="fixed inset-x-0 bottom-0 z-0 flex h-[82vh] flex-col justify-between overflow-hidden bg-[var(--bg)] px-5 pb-7 pt-[10vh] md:px-10"
        style={{ fontFamily: "var(--font-firma), sans-serif" }}
        aria-label="Footer"
      >
        {/* SOLID BLACK footer (George) — the film lives ONLY inside the logo */}

        {/* top zone — the big email left, quick links right */}
        <div className="ft-zone relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="label-mono mb-4 text-[11px] tracking-[0.22em] text-[var(--fg)]/55">GET IN TOUCH</p>
            <a
              href="mailto:harry@hwmedia.co.uk"
              className="about-display u-link inline-block text-[clamp(1.7rem,4.2vw,4rem)] leading-none text-[var(--fg)]"
              style={{ textTransform: "none" }}
            >
              harry@hwmedia.co.uk
            </a>
          </div>
          {/* one line of page links; the spacer mirrors the email's eyebrow so
              "Work" tops out level with the K in .uk (client) */}
          <div>
            <p aria-hidden className="label-mono invisible mb-4 text-[11px] tracking-[0.22em]">.</p>
            <nav className="flex items-start gap-7" aria-label="Footer pages">
              {PAGES.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="u-link text-[15px] leading-none text-[var(--fg)]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* middle zone — the columns, pushed LEFT (half width, left-aligned) */}
        <div className="ft-zone relative grid max-w-xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8">
          <div>
            <span className="ft-line mb-6 block h-px w-full bg-[var(--fg)]" />
            <p className="label-mono mb-5 text-[11px] tracking-[0.22em] text-[var(--fg)]/55">OUR BASE</p>
            <p className="text-[15px] leading-relaxed text-[var(--fg)]">London</p>
            <p className="text-[15px] leading-relaxed text-[var(--fg)]">United Kingdom</p>
          </div>
          <div>
            <span className="ft-line mb-6 block h-px w-full bg-[var(--fg)]" />
            <p className="label-mono mb-5 text-[11px] tracking-[0.22em] text-[var(--fg)]/55">SOCIALS</p>
            <div className="flex flex-col items-start gap-1">
              <a href="https://www.instagram.com/hwmedia/" target="_blank" rel="noopener noreferrer" className="u-link inline-block text-[15px] leading-relaxed text-[var(--fg)]">
                Instagram
              </a>
              <a href="https://www.linkedin.com/in/harry-wallis-98b47b161/" target="_blank" rel="noopener noreferrer" className="u-link inline-block text-[15px] leading-relaxed text-[var(--fg)]">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* bottom zone — © bottom-left; the WORDMARK is HUGE in the far
            bottom-right corner, SOLID (client: no film playing through it) */}
        <div className="ft-zone relative z-10 flex items-end pb-1">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--fg)]/55">
            <span>© {new Date().getFullYear()} HW Media · London</span>
            <Link href="/privacy" className="transition-colors hover:text-[var(--fg)]">Privacy Policy</Link>
          </div>
        </div>
        <div
          className="ft-zone logo-mark-solid pointer-events-none absolute bottom-4 right-0 h-[clamp(10rem,26vw,22rem)] w-[min(58vw,980px)]"
          role="img"
          aria-label="HW Media"
          style={{
            WebkitMask: "url(/logos/hwmedia-white.png) right bottom / contain no-repeat",
            mask: "url(/logos/hwmedia-white.png) right bottom / contain no-repeat",
          }}
        />

        {/* the lift-away dark — scrubbed out as the page reveals the footer */}
        <div aria-hidden className="ft-veil pointer-events-none absolute inset-0 bg-[var(--page-bg)]" />
      </footer>
    </>
  );
}
