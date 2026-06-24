"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface WorkTileProps {
  slug: string;
  wide: string;
  posterWide: string;
  client: string;
  logo?: string;
}

// Work grid tile (client feedback): 16:9 and in COLOUR. Frozen on its poster by
// default; on hover it plays.
export default function WorkTile({ slug, wide, posterWide, client, logo }: WorkTileProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLAnchorElement>(null);

  // reveal up as it scrolls into view (client: tiles come up one by one)
  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const play = () => {
    const v = ref.current;
    if (v) v.play().catch(() => {});
  };
  const stop = () => {
    const v = ref.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <Link
      ref={rootRef}
      href={`/work/${slug}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      className="group relative block aspect-video overflow-hidden"
    >
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full scale-[1.05] object-cover transition-all duration-700 ease-out group-hover:scale-[1.1]"
        src={wide}
        poster={posterWide}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/45 transition-opacity duration-500 group-hover:opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/logos/${logo}.png`}
            alt={client}
            className="h-10 w-auto max-w-[58%] object-contain opacity-95 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <span
            className="text-[clamp(1.1rem,2vw,1.6rem)] uppercase tracking-[0.12em] text-white/95"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            {client}
          </span>
        )}
      </div>
    </Link>
  );
}
