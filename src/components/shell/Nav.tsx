"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Nav (client feedback): logo left; Home/Work/About/Contact links right on
// desktop, or a fullscreen hamburger menu on mobile; social rail bottom-left.
// No external "Start here" link — keep visitors on the site (client).

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const rootRef = useRef<HTMLElement>(null);
  const navListRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // sliding nav pill (auteur): one outlined capsule that glides to the hovered
  // item instead of every link drawing its own ring.
  const movePill = (e: MouseEvent<HTMLElement>) => {
    const pill = pillRef.current;
    const list = navListRef.current;
    if (!pill || !list) return;
    const lr = list.getBoundingClientRect();
    const ir = e.currentTarget.getBoundingClientRect();
    gsap.to(pill, {
      x: ir.left - lr.left,
      y: ir.top - lr.top,
      width: ir.width,
      height: ir.height,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  };
  const hidePill = () => {
    if (pillRef.current) gsap.to(pillRef.current, { autoAlpha: 0, duration: 0.3, ease: "power2.out", overwrite: true });
  };

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

  // hide on scroll-down, reveal on scroll-up (whole site). Stays put near the
  // top so the hero always shows it.
  useEffect(() => {
    const nav = rootRef.current;
    if (!nav) return;
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (self.direction === 1 && !hidden && self.scroll() > 140) {
          hidden = true;
          gsap.to(nav, { yPercent: -145, duration: 0.5, ease: "power3.out", overwrite: true });
        } else if ((self.direction === -1 || self.scroll() <= 140) && hidden) {
          hidden = false;
          gsap.to(nav, { yPercent: 0, duration: 0.5, ease: "power3.out", overwrite: true });
        }
      },
    });
    return () => st.kill();
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
          <img src="/logos/hwmedia-dark.png" alt="HW Media" className="nav-logo-color h-14 w-auto md:h-16" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/hwmedia-light.png" alt="" aria-hidden className="nav-logo-black h-14 w-auto md:h-16" />
        </Link>

        {/* RIGHT — flat nav. No permanent borders; a hard-line ring appears
            ONLY around the item you hover (client req). "Start here" links out
            to the booking scheduler; the rest stay internal. */}
        <nav
          ref={navListRef}
          onMouseLeave={hidePill}
          className="relative hidden items-center gap-3 md:flex md:gap-7"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          {/* sliding pill — one outlined capsule that glides to the hovered item */}
          <span
            ref={pillRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 rounded-full border border-[var(--fg)] opacity-0 will-change-transform"
          />
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onMouseEnter={movePill}
              className="nav-enter relative rounded-full px-4 py-2 text-[14px] font-medium uppercase tracking-[0.14em] text-[var(--fg)] transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="nav-enter relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className={`block h-[1.5px] w-6 bg-[var(--fg)] transition-transform duration-300 ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-6 bg-[var(--fg)] transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-[1.5px] w-6 bg-[var(--fg)] transition-transform duration-300 ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>
      </header>

      {/* mobile menu overlay — fullscreen, mode-aware, giant links */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[var(--bg)] transition-opacity duration-300 md:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ fontFamily: "var(--font-firma), sans-serif" }}
      >
        {LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="font-display text-[clamp(2rem,9vw,3rem)] uppercase tracking-[-0.01em] text-[var(--fg)]"
          >
            {l.label}
          </Link>
        ))}
      </div>

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
