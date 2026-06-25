"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

// Mobile-only reveal: fades + rises its direct children into view on scroll. A
// no-op on desktop (where each section runs its own choreography) and under
// reduced motion. Used to give the phone build the motion it was missing.
export default function MobileReveal({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const kids = Array.from(el.children) as HTMLElement[];
      if (!kids.length) return;
      const t = gsap.from(kids, {
        autoAlpha: 0,
        y: 42,
        duration: 0.8,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
      return () => { t.scrollTrigger?.kill(); t.kill(); gsap.set(kids, { clearProps: "opacity,transform,visibility" }); };
    });
    return () => mm.revert();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
