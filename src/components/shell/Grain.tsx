"use client";

// Animated film grain — SVG turbulence tile jittered with steps().
// Visible over dark sections only (CSS keyed off html[data-nav]).
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='240' height='240' filter='url(%23n)' opacity='0.9'/></svg>`,
  );

export default function Grain() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-40 mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE}")` }}
    />
  );
}
