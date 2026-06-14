"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Testimonials, ponder.ai style: a see-through outline heading, then an
// INFINITE manual carousel of quote cards — about 2.5 on screen, driven
// by the two arrows. The loop never ends (GSAP horizontalLoop). Each card
// is a bordered box with a gold dotted aperture mark, the quote up top,
// and the brand mark + who said it in the bottom-left. Placeholder quotes.

interface Quote {
  quote: string;
  name: string;
  role: string;
  logo: string;
}

const QUOTES: Quote[] = [
  { quote: "The film outlived the campaign. Two years on, we still open every pitch with it.", name: "Brand Director", role: "Heritage Motoring", logo: "mclaren-logo" },
  { quote: "One small crew, zero friction. They were on a plane within the week.", name: "Head of Marketing", role: "Aviation", logo: "airbus-white" },
  { quote: "They turned a product launch into a film people actually chose to watch.", name: "Founder", role: "Hospitality Group", logo: "zuma-white" },
  { quote: "Cinema standards on a social budget. We haven't gone anywhere else since.", name: "Brand Lead", role: "Sportswear", logo: "nike-white" },
  { quote: "Direction you can trust at full speed. Nothing was ever too much to ask.", name: "Marketing Director", role: "Motorsport", logo: "red-bull-7" },
  { quote: "They made our heritage feel current without losing what made it ours.", name: "Brand Manager", role: "Spirits", logo: "diageo-white" },
  { quote: "From brief to master in under three weeks, and the quality never dipped.", name: "Comms Lead", role: "Hospitality", logo: "soho-house-white" },
  { quote: "The kind of film people stop scrolling for. That's the whole point.", name: "Head of Content", role: "Music", logo: "spotify-white" },
];

type Loop = gsap.core.Timeline & {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween;
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
};

// GSAP's official horizontalLoop helper — seamless infinite loop of items.
function horizontalLoop(items: HTMLElement[], config: { paddingRight?: number; speed?: number }): Loop {
  const cfg = config || {};
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } }) as Loop;
  const length = items.length;
  const startX = items[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const pixelsPerSecond = (cfg.speed || 1) * 100;
  const snap = gsap.utils.snap(1);

  gsap.set(items, {
    xPercent: (i: number, el: Element) => {
      const w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string));
      xPercents[i] = snap((parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 + (gsap.getProperty(el, "xPercent") as number));
      return xPercents[i];
    },
  });
  gsap.set(items, { x: 0 });
  const last = items[length - 1];
  const totalWidth = last.offsetLeft + (xPercents[length - 1] / 100) * widths[length - 1] - startX + last.offsetWidth + (cfg.paddingRight || 0);

  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop = distanceToStart + widths[i];
    tl.to(item, { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
      .fromTo(
        item,
        { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
        { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false },
        distanceToLoop / pixelsPerSecond,
      );
    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index: number, vars?: gsap.TweenVars) {
    const v: gsap.TweenVars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) index += index > curIndex ? -length : length;
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      v.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    v.overwrite = true;
    return tl.tweenTo(time, v);
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.progress(1, true).progress(0, true);
  return tl;
}

function Aperture() {
  return (
    <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-[var(--gold)]/55">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
    </span>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<Loop | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = gsap.utils.toArray<HTMLElement>(".tm-card", track);
    if (!cards.length) return;
    const loop = horizontalLoop(cards, { paddingRight: 24, speed: 1 });
    loopRef.current = loop;
    return () => { loop.kill(); };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const loop = loopRef.current;
    if (!loop) return;
    (dir > 0 ? loop.next : loop.previous)({ duration: 0.6, ease: "power2.inOut" });
  };

  return (
    <section
      data-theme="dark"
      data-surface="page"
      data-chapter="05 — Testimonials"
      className="relative overflow-hidden bg-[var(--bg)] py-[12vh] text-[var(--fg)]"
      aria-label="Testimonials"
    >
      <div className="flex items-end justify-between px-5 md:px-10">
        <h2 className="svc-outline font-display max-w-2xl text-[clamp(1.8rem,3vw,3.2rem)] leading-[1.04]">
          Trusted by brands who care about{" "}
          <span className="text-[var(--gold)] [-webkit-text-stroke:0]">craft &amp; storytelling.</span>
        </h2>
        <div className="hidden shrink-0 gap-3 md:flex">
          <button onClick={() => nudge(-1)} aria-label="Previous" className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--hairline-dark)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]">←</button>
          <button onClick={() => nudge(1)} aria-label="Next" className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--hairline-dark)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]">→</button>
        </div>
      </div>

      <div className="mt-12 overflow-hidden px-5 md:px-10">
        <div ref={trackRef} className="flex gap-6">
          {QUOTES.map((q) => (
            <figure
              key={q.name + q.role}
              className="tm-card flex w-[min(82vw,500px)] shrink-0 flex-col justify-between rounded-2xl border border-[var(--hairline-dark)] p-9 md:w-[min(42vw,520px)]"
              style={{ minHeight: "350px" }}
            >
              <div>
                <Aperture />
                <blockquote className="mt-7 text-[clamp(1.25rem,1.6vw,1.6rem)] leading-snug">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--hairline-dark)] bg-[var(--bg)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/logos/${q.logo}.png`} alt="" aria-hidden className="logo-mark max-h-5 max-w-8 object-contain opacity-90 [html[data-mode=light]_&]:invert" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{q.name}</span>
                  <span className="block text-xs opacity-55">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
