"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { BOOKING_URL } from "@/content/site";

// Flat, always-visible nav (client feedback): logo left, the three links and
// a persistent "Start here" right, social rail pinned bottom-left. No
// hamburger, no disappearing wordmark — branding and nav stay consistent the
// whole way down the page.

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const rootRef = useRef<HTMLElement>(null);

  // quick entrance
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll(".nav-enter"),
      { y: -12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: "expo.out", delay: 0.2, clearProps: "opacity,transform" },
    );
  }, []);

  // the nav re-themes to the surface it sits over so it stays readable
  useEffect(() => {
    const nav = rootRef.current;
    if (!nav) return;
    const NAV_LINE = 56;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));
    const apply = (s: string) => { nav.dataset.surface = s; };
    const here = sections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= NAV_LINE && r.bottom > NAV_LINE;
    });
    apply(here?.dataset.surface ?? sections[0]?.dataset.surface ?? "media");
    const triggers = sections.map((sec) =>
      ScrollTrigger.create({
        trigger: sec,
        start: `top ${NAV_LINE}px`,
        end: `bottom ${NAV_LINE}px`,
        onToggle: (self) => { if (self.isActive) apply(sec.dataset.surface ?? "page"); },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <>
      <header
        ref={rootRef}
        className="nav-root fixed inset-x-0 top-3 z-50 flex items-center justify-between px-5 py-2.5 md:top-4 md:px-10"
      >
        {/* LEFT — the real HW Media logo. Colour (gold) on dark; the black mark
            swaps in only in light mode over a page surface. */}
        <Link href="/" className="nav-enter block shrink-0" aria-label="HW Media — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/hwmedia-dark.png" alt="HW Media" className="nav-logo-color h-12 w-auto md:h-14" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/hwmedia-light.png" alt="" aria-hidden className="nav-logo-black h-12 w-auto md:h-14" />
        </Link>

        {/* RIGHT — flat nav. No permanent borders; a hard-line ring appears
            ONLY around the item you hover (client req). "Start here" links out
            to the booking scheduler; the rest stay internal. */}
        <nav
          className="flex items-center gap-1.5 md:gap-2"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="nav-enter rounded-full border border-transparent px-5 py-2 text-[14px] font-medium uppercase tracking-[0.06em] text-[var(--fg)] transition-colors duration-300 hover:border-[var(--fg)]"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-enter rounded-full border border-transparent px-5 py-2 text-[14px] font-medium uppercase tracking-[0.06em] text-[var(--fg)] transition-colors duration-300 hover:border-[var(--fg)]"
          >
            Start here
          </a>
        </nav>
      </header>

      {/* social rail — pinned bottom-left, always visible (mix-blend keeps it
          legible over any footage or surface) */}
      <div className="pointer-events-none fixed bottom-4 left-5 z-40 flex items-center gap-4 mix-blend-difference md:bottom-5 md:left-10">
        <a
          href="https://www.instagram.com/hwmedia/"
          aria-label="Instagram"
          className="pointer-events-auto text-white/90 transition-opacity hover:opacity-60"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/harry-wallis-98b47b161/"
          aria-label="LinkedIn"
          className="pointer-events-auto text-white/90 transition-opacity hover:opacity-60"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5A2.49 2.49 0 1 1 5 8.48a2.49 2.49 0 0 1-.02-4.98zM3 9.75h4v10.75H3zM9.5 9.75h3.83v1.47h.05c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.79 2.6 4.79 5.98v5.25h-4v-4.65c0-1.11-.02-2.54-1.58-2.54-1.59 0-1.83 1.21-1.83 2.46v4.73h-4.04z" />
          </svg>
        </a>
      </div>
    </>
  );
}
