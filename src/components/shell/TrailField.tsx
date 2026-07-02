"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// TrailField — the 1820 BTS "snake" effect, rebuilt from their bundle's recipe:
// move the mouse through the field and stills spawn at the cursor, stacking and
// fading behind it like a trail. When nobody interacts, an AUTO-PULSE teases the
// effect (random spawns) — and switches off permanently the moment the visitor
// discovers it. Desktop/fine pointers only. No text, just pictures.
interface TrailFieldProps {
  images: string[];
  className?: string;
}

const MOVE_THRESHOLD = 110; // px of cursor travel between spawns
const POOL = 12;

export default function TrailField({ images, className = "" }: TrailFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(field.querySelectorAll<HTMLElement>(".tf-item"));
    let idx = 0;
    let z = 10;
    let last = { x: -9999, y: -9999 };
    let discovered = false;
    let pulseTimer: ReturnType<typeof setTimeout> | null = null;
    const mouse = { x: -9999, y: -9999 };

    const spawn = (cx: number, cy: number) => {
      const el = items[idx];
      if (!el) return;
      idx = (idx + 1) % items.length;
      z += 1;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      gsap.killTweensOf(el);
      gsap.set(el, { x: cx - w / 2, y: cy - h / 2, zIndex: z });
      gsap
        .timeline()
        .fromTo(
          el,
          { autoAlpha: 0, scale: 0.72, clipPath: "inset(18% 18% 18% 18% round 10px)" },
          { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 10px)", duration: 0.38, ease: "power3.out" },
        )
        .to(el, { autoAlpha: 0, scale: 0.94, duration: 0.7, ease: "power2.in" }, "+=0.45");
    };

    const randomSpawn = () => {
      const r = field.getBoundingClientRect();
      spawn(60 + Math.random() * (r.width - 120), 60 + Math.random() * (r.height - 120));
    };

    // idle teaser — three soft pulses, repeating until the visitor discovers it
    const schedulePulse = (delay: number) => {
      if (discovered) return;
      pulseTimer = setTimeout(() => {
        if (discovered) return;
        let n = 0;
        const step = () => {
          if (discovered || n >= 3) { schedulePulse(2600); return; }
          randomSpawn();
          n += 1;
          pulseTimer = setTimeout(step, 620);
        };
        step();
      }, delay);
    };

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting && !discovered && !pulseTimer) schedulePulse(900);
        if (!e.isIntersecting && pulseTimer) { clearTimeout(pulseTimer); pulseTimer = null; }
      }),
      { threshold: 0.35 },
    );
    io.observe(field);

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const r = field.getBoundingClientRect();
      if (mouse.x < r.left || mouse.x > r.right || mouse.y < r.top || mouse.y > r.bottom) return;
      const lx = mouse.x - r.left;
      const ly = mouse.y - r.top;
      if (Math.hypot(lx - last.x, ly - last.y) > MOVE_THRESHOLD) {
        if (!discovered) {
          discovered = true; // the visitor found it — retire the teaser
          if (pulseTimer) { clearTimeout(pulseTimer); pulseTimer = null; }
        }
        last = { x: lx, y: ly };
        spawn(lx, ly);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (pulseTimer) clearTimeout(pulseTimer);
      io.disconnect();
      items.forEach((el) => gsap.killTweensOf(el));
    };
  }, []);

  const pool = Array.from({ length: POOL }, (_, i) => images[i % images.length]);

  return (
    <div ref={fieldRef} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {pool.map((src, i) => (
        <div key={i} className="tf-item invisible absolute left-0 top-0 w-[clamp(140px,16vw,230px)] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="aspect-video w-full rounded-[10px] object-cover" loading="lazy" />
        </div>
      ))}
    </div>
  );
}
