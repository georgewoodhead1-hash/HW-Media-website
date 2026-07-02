// V2 "References" — shared content data.
// Auteur (framed reel) + Luke Baffait (rail, ghost rows) + Noxediem (rushes,
// viewfinder) + Bennett&Clive (split wordmark, roster-as-copy).

export const CHAPTERS = ["Reel", "Statement", "Work", "Process", "Contact"] as const;

export const ROSTER = [
  "MCLAREN",
  "NIKE",
  "RED BULL",
  "DEFENDER",
  "SPOTIFY",
  "SALOMON",
] as const;

export interface Rush {
  slug: string;
  title: string;
  category: string;
  tcStart: number; // seconds — where this rush's timecode begins ticking
  director: string;
}

export const WORK: readonly Rush[] = [
  { slug: "otoko", title: "Otoko", category: "Fragrance", tcStart: 84, director: "Harry Wallis" },
  { slug: "mclaren", title: "McLaren", category: "Automotive", tcStart: 128, director: "Harry Wallis" },
  { slug: "salomon", title: "Salomon", category: "Outdoor", tcStart: 107, director: "Harry Wallis" },
  { slug: "castle-air", title: "Castle Air", category: "Aviation", tcStart: 192, director: "Harry Wallis" },
];

export interface Stage {
  n: string;
  name: string;
  copy: string;
}

export const STAGES: readonly Stage[] = [
  { n: "01", name: "Pre-production", copy: "Brief, treatment, casting, locations, schedule." },
  { n: "02", name: "Production", copy: "Direction and cinematography, on location, in-camera." },
  { n: "03", name: "Post-production", copy: "Edit, grade, sound and motion, all under one roof." },
  { n: "04", name: "In motion", copy: "Aerial and motion design by the same crew." },
];

export const TRUSTED =
  "McLaren · Nike · Red Bull · Defender · Spotify · Salomon · Aston Martin · Diageo";

/** Format a frame count as a 24fps timecode — HH:MM:SS:FF. */
export function formatTimecode(totalFrames: number): string {
  const fps = 24;
  const frames = Math.floor(totalFrames % fps);
  const totalSeconds = Math.floor(totalFrames / fps);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const p = (v: number) => String(v).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(frames)}`;
}

/** Run cb once the loading veil lifts (hw:reveal), with a safety timeout. */
export function onReveal(cb: () => void): () => void {
  let fired = false;
  const run = () => {
    if (fired) return;
    fired = true;
    cb();
  };
  window.addEventListener("hw:reveal", run);
  const t = window.setTimeout(run, 4600);
  return () => {
    window.removeEventListener("hw:reveal", run);
    window.clearTimeout(t);
  };
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
