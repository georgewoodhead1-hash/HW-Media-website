"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { SERVICES } from "@/content/services";
import { EMAIL } from "@/content/site";

// THE ABOUT PANEL (ROUND-8, George — the bymonolog.com move): clicking
// About doesn't route anywhere. The page you're on fades, blurs and
// darkens under a scrim, and the About content slides in as a panel on
// the RIGHT of the screen — a short portfolio of Harry: who he is, why he
// started HW Media, the mission, what we offer. Esc / scrim / ✕ closes it.
// Opened by the "hw:about" window event (the nav dispatches it).
// /about stays reachable by direct URL for deep links.

export default function AboutPanel() {
  const [mounted, setMounted] = useState(false);
  const scrimRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);

  const animateClose = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    getLenis()?.start();
    document.documentElement.style.overflow = "";
    const done = () => setMounted(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }
    gsap.to(panelRef.current, { xPercent: 100, duration: 0.55, ease: "power3.in" });
    gsap.to(scrimRef.current, { autoAlpha: 0, duration: 0.45, delay: 0.15, onComplete: done });
  }, []);

  useEffect(() => {
    const open = () => {
      if (openRef.current) return;
      openRef.current = true;
      setMounted(true);
    };
    window.addEventListener("hw:about", open);
    return () => window.removeEventListener("hw:about", open);
  }, []);

  // the open choreography runs once the overlay exists in the DOM
  useEffect(() => {
    if (!mounted) return;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      const rows = panelRef.current?.querySelectorAll("[data-ap-row]") ?? [];
      gsap.set(scrimRef.current, { autoAlpha: 0 });
      gsap.set(panelRef.current, { xPercent: 100 });
      gsap.set(rows, { autoAlpha: 0, y: 22 });
      gsap
        .timeline()
        .to(scrimRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0)
        .to(panelRef.current, { xPercent: 0, duration: 0.75, ease: "power4.out" }, 0.08)
        .to(rows, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }, 0.35);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") animateClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, animateClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label="About HW Media">
      {/* the page behind: fades, blurs, darkens */}
      <div
        ref={scrimRef}
        onClick={animateClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
      />

      {/* the panel — rides in from the right. data-lenis-prevent lets it
          scroll natively (Lenis hijacks the wheel globally, so without this
          the panel wouldn't scroll — George) */}
      <div
        ref={panelRef}
        data-lenis-prevent
        className="absolute right-0 top-0 flex h-full w-[min(600px,94vw)] flex-col overflow-y-auto overscroll-contain border-l border-[var(--hairline-dark)] bg-[#0a0a09] px-7 py-8 text-[#f5f1e6] md:px-12 md:py-12"
      >
        <div data-ap-row className="mb-[7vh] flex items-center justify-between">
          <span className="label-mono text-[10px] tracking-[0.24em] text-white/55">ABOUT</span>
          <button
            type="button"
            onClick={animateClose}
            aria-label="Close"
            className="label-mono px-2 py-1 text-[11px] tracking-[0.2em] text-white/70 transition-colors hover:text-white"
          >
            CLOSE ✕
          </button>
        </div>

        <h2 data-ap-row className="font-display text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[0.98]">
          Harry Wallis
        </h2>
        <p data-ap-row className="label-mono mt-3 text-[10px] tracking-[0.24em] text-white/55">
          FOUNDER — DIRECTOR &amp; CINEMATOGRAPHER
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-ap-row
          src="/images/harry-field.jpg"
          alt="Harry Wallis on location"
          className="mt-8 aspect-[3/2] w-full rounded-md object-cover"
        />

        <div data-ap-row className="about-body mt-8 space-y-5 text-[15px] leading-relaxed text-white/90">
          <p>
            HW Media is the London film production company of Harry Wallis. We
            make brand films, documentaries and commercials for brands that
            want cinema standards.
          </p>
          <p>
            Harry started HW Media because most branded content is made to be
            skipped. The mission has stayed the same since day one: make films
            people choose to watch.
          </p>
          <p>
            Every project is planned properly, shot on location and finished
            under one roof — edit, grade, sound and delivery.
          </p>
        </div>

        <div data-ap-row className="mt-10">
          <p className="label-mono mb-4 text-[10px] tracking-[0.24em] text-white/55">WHAT WE OFFER</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                onClick={animateClose}
                className="blink blink-bare text-[12px] tracking-[0.04em]"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        <div data-ap-row className="mt-auto pt-12">
          <Link href="/contact" onClick={animateClose} className="blink text-[14px] tracking-[0.05em]">
            Start a project
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-4 block text-[15px] text-white/80 transition-colors hover:text-white"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            {EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
