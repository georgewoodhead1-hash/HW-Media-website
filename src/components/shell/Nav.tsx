"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import MenuOverlay from "./MenuOverlay";

// kookie-style numbered index, top-left, always shown (desktop)
const INDEX = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const rootRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  // the wordmark belongs to the hero; once its bottom passes the nav line we
  // swap it out for the numbered index
  useEffect(() => {
    const hero = document.querySelector("main")?.querySelector("section");
    if (!hero) return;
    const st = ScrollTrigger.create({
      trigger: hero,
      start: "bottom top+=70",
      onEnter: () => setPastHero(true),
      onLeaveBack: () => setPastHero(false),
    });
    return () => st.kill();
  }, []);

  // Quick entrance — links visible within the first beat of the page.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".nav-enter");
    gsap.fromTo(
      items,
      { y: -14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07, ease: "expo.out", delay: 0.15 },
    );
  }, []);

  // The nav re-themes to the surface it sits over. Cinema sections
  // (data-surface="media") force it dark; editorial sections
  // (data-surface="page") let it follow the global light/dark mode — so
  // light mode never bleeds a cream band over the footage.
  useEffect(() => {
    const nav = rootRef.current;
    if (!nav) return;
    const NAV_LINE = 44;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));
    const apply = (s: string) => { nav.dataset.surface = s; };

    // initialise to whichever section the nav line currently sits in
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
        className="nav-root fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10"
      >
        {/* scrim: keeps the links readable over anything that scrolls under */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/65 to-transparent"
        />
        {/* LEFT — the wordmark rides the hero, then swaps for the numbered
            index once you're past it (they share the same slot) */}
        <div className="grid">
          <Link
            href="/"
            className={`font-hand col-start-1 row-start-1 self-center text-2xl leading-none nav-wordmark transition-all duration-500 ${
              pastHero ? "md:pointer-events-none md:-translate-y-1 md:opacity-0" : "md:opacity-100"
            }`}
            aria-label="HW Media — home"
          >
            HW <span className="label-mono ml-1 align-middle text-[9px] tracking-[0.3em]">media</span>
          </Link>
          <ul
            className={`col-start-1 row-start-1 hidden flex-col gap-[3px] self-center transition-opacity duration-500 md:flex ${
              pastHero ? "md:opacity-100" : "md:pointer-events-none md:opacity-0"
            }`}
          >
            {INDEX.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center gap-2 text-[10px] leading-none tracking-[0.18em] transition-opacity hover:opacity-100"
                >
                  <span className="label-mono text-[var(--gold)]">{String(i + 1).padStart(3, "0")}</span>
                  <span className="label-mono nav-link uppercase">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — Start here + the three-dash menu */}
        <nav className="flex items-center gap-6 md:gap-8">
          <Link
            href="/contact"
            className="label-mono nav-enter rounded-full border border-[var(--gold)] px-5 py-2 text-[var(--gold)] transition-colors duration-300 hover:bg-[var(--gold)] hover:text-[#050505]"
          >
            Start here
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="nav-enter group flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
          >
            <span className="block h-px w-6 bg-current transition-all duration-300 group-hover:w-7" />
            <span className="block h-px w-6 bg-current transition-all duration-300 group-hover:w-4" />
            <span className="block h-px w-6 bg-current transition-all duration-300 group-hover:w-7" />
          </button>
        </nav>
      </header>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
