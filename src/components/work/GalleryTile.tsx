"use client";

import Link from "next/link";
import { useRef } from "react";
import type { GalleryItem } from "@/content/gallery";

// One work-gallery tile. Real films play on hover and link to their case page;
// placeholder tiles run a dimmed, desaturated ambient loop under the client logo
// until Harry's coloured thumbnail lands. 16:9, flush (no gutters). The reveal
// animation is driven by the parent (reading-order batch), so the tile only needs
// the `gtile` hook and its initial hidden state.
export default function GalleryTile({ item }: { item: GalleryItem }) {
  const vid = useRef<HTMLVideoElement>(null);
  const isReal = Boolean(item.video);

  const play = () => { const v = vid.current; if (v) v.play().catch(() => {}); };
  const stop = () => { const v = vid.current; if (v) { v.pause(); v.currentTime = 0; } };

  const Mark = (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/logos/${item.logo}.png`} alt={item.label} className="h-10 w-auto max-w-[58%] object-contain opacity-95 transition-transform duration-500 group-hover:scale-105 md:h-12" />
      ) : (
        <span className="about-display max-w-[80%] text-center text-[clamp(1.1rem,2vw,1.7rem)] leading-tight text-white/95">{item.label.split(" — ")[0]}</span>
      )}
    </div>
  );

  const inner = (
    <>
      {isReal ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video ref={vid} className="absolute inset-0 h-full w-full scale-[1.05] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1]" src={item.video} poster={item.poster} muted loop playsInline preload="metadata" />
      ) : item.micro ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video ref={vid} className="absolute inset-0 h-full w-full scale-[1.05] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1]" src={`/videos/micro/${item.micro}.mp4`} poster={`/videos/micro/posters/${item.micro}.jpg`} muted loop playsInline preload="metadata" />
      ) : (
        <div className="absolute inset-0 bg-[#0a0a0a]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/45 transition-opacity duration-500 group-hover:opacity-30" />
      {Mark}
      {!isReal && (
        <span className="about-label absolute bottom-3 left-3 text-[10px] text-[var(--fg)]/45">
          {item.comingSoon ? "Coming soon" : "Film coming"}
        </span>
      )}
    </>
  );

  const cls = "gtile group relative block aspect-video overflow-hidden bg-black";

  if (item.slug) {
    return (
      <Link href={`/work/${item.slug}`} onMouseEnter={play} onMouseLeave={stop} className={cls} aria-label={item.label}>
        {inner}
      </Link>
    );
  }
  return (
    <div onMouseEnter={play} onMouseLeave={stop} className={cls} aria-label={item.label}>
      {inner}
    </div>
  );
}
