"use client";

import Link from "next/link";
import { useRef } from "react";

interface WorkTileProps {
  slug: string;
  wide: string;
  posterWide: string;
  client: string;
  logo?: string;
}

// Work grid tile (client feedback): black-and-white and FROZEN (poster, paused)
// by default; on hover it plays and comes into colour.
export default function WorkTile({ slug, wide, posterWide, client, logo }: WorkTileProps) {
  const ref = useRef<HTMLVideoElement>(null);

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
      href={`/work/${slug}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      className="group relative block aspect-[4/3] overflow-hidden"
    >
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full scale-[1.08] object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.14] group-hover:grayscale-0"
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
