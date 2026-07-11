"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

// The footer, LAYERED BEHIND the page (sticky reveal), final-round spec:
// GET IN TOUCH + the email (email in the UI face, sat lower); THREE columns
// under drawn lines — WORK / ABOUT / CONTACT as clickable titles with their
// sub-lines beneath (nothing greyed); the wordmark rides BIG bottom-right,
// SOLID (no film through it). A dark veil lifts away with the page.

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

    // gentle parallax between the footer's layers (George: just a bit of
    // spice) — top zone travels most, columns less, the wordmark least
    const travel = [64, 40, 22, 14];
    zones.forEach((z, i) => gsap.set(z, { autoAlpha: 0, y: travel[i % travel.length] }));
    gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: spacer, start: "top bottom", end: "bottom 88%", scrub: 0.7 },
    });
    tl.fromTo(veil, { opacity: 0.9 }, { opacity: 0, ease: "none", duration: 1 }, 0)
      .to(zones, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.14, ease: "power2.out" }, 0.05)
      .to(lines, { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0.35);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
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
              className="u-link mt-6 inline-block text-[clamp(1.4rem,3vw,2.6rem)] leading-none text-[var(--fg)]"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              harry@hwmedia.co.uk
            </a>
          </div>

        </div>

        {/* middle zone — THREE columns under drawn lines: the page titles,
            clickable and bright, each with its sub-lines beneath */}
        <div className="ft-zone relative grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          <div>
            <span className="ft-line mb-6 block h-px w-full bg-[var(--fg)]" />
            <Link href="/work" className="u-link inline-block text-[19px] leading-none text-[var(--fg)]">
              Work
            </Link>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg)]">The films.</p>
          </div>
          <div>
            <span className="ft-line mb-6 block h-px w-full bg-[var(--fg)]" />
            <Link href="/about" className="u-link inline-block text-[19px] leading-none text-[var(--fg)]">
              About
            </Link>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg)]">London, United Kingdom</p>
            <p className="text-[15px] leading-relaxed text-[var(--fg)]">Harry Wallis</p>
          </div>
          <div>
            <span className="ft-line mb-6 block h-px w-full bg-[var(--fg)]" />
            <Link href="/contact" className="u-link inline-block text-[19px] leading-none text-[var(--fg)]">
              Contact
            </Link>
            <div className="mt-4 flex flex-col items-start gap-1">
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
            bottom-right corner and the showreel is visible ONLY through it
            (the logo is a mask over the playing film) */}
        <div className="ft-zone relative z-10 flex items-end pb-1">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--fg)]/55">
            <span>© {new Date().getFullYear()} HW MEDIA · LONDON</span>
            <Link href="/privacy" className="transition-colors hover:text-[var(--fg)]">Privacy Policy</Link>
          </div>
        </div>
        <div
          className="ft-zone pointer-events-none absolute bottom-4 right-0 h-[clamp(10rem,26vw,22rem)] w-[min(58vw,980px)]"
          role="img"
          aria-label="HW Media"
          style={{
            WebkitMask: "url(/logos/hwmedia-white.png) right bottom / contain no-repeat",
            mask: "url(/logos/hwmedia-white.png) right bottom / contain no-repeat",
            background: "var(--fg)",
          }}
        />

        {/* the lift-away dark — scrubbed out as the page reveals the footer */}
        <div aria-hidden className="ft-veil pointer-events-none absolute inset-0 bg-[var(--page-bg)]" />
      </footer>
    </>
  );
}
