"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Client-only mount for the About WebGL canvases (R3F Canvas can't SSR). CRITICAL:
// each canvas only renders while it is on (or near) screen — an IntersectionObserver
// flips `active`, and each GL surface stops its render loop (frameloop "never")
// when off-screen, so we never burn the CPU running four canvases at once.
//   "band"          — scrolling film row (legacy)
//   "constellation" — z-depth scattered film field (Scene 04)
//   "portrait"      — Harry's warping framed portrait (Scene 02)
//   "halftone"      — dot-matrix wordmark backing
//   "bubble"        — masked duotone circle (contact)

const FilmBandGL = dynamic(() => import("./FilmBandGL"), { ssr: false });
const PortraitWarpGL = dynamic(() => import("./PortraitWarpGL"), { ssr: false });
const HalftoneWordmarkGL = dynamic(() => import("./HalftoneWordmarkGL"), { ssr: false });
const BubbleMediaGL = dynamic(() => import("./BubbleMediaGL"), { ssr: false });

type Surface = "band" | "constellation" | "portrait" | "halftone" | "bubble";

interface FilmBandMountProps {
  className?: string;
  surface?: Surface;
  src?: string;
  interactive?: boolean;
  resolveOnScroll?: boolean;
}

export default function FilmBandMount({ className, surface = "band", src, interactive = false, resolveOnScroll = false }: FilmBandMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px 0px 120px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden={!interactive}>
      {surface === "band" && <FilmBandGL mode="band" active={active} />}
      {surface === "constellation" && <FilmBandGL mode="constellation" active={active} />}
      {surface === "portrait" && <PortraitWarpGL src={src} active={active} />}
      {surface === "halftone" && <HalftoneWordmarkGL src={src} resolveOnScroll={resolveOnScroll} active={active} />}
      {surface === "bubble" && <BubbleMediaGL src={src} active={active} />}
    </div>
  );
}
