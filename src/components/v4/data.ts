// V4 shared data — the films, credits and process stages.

export interface Film {
  slug: string;
  title: string;
  year: string;
}

export interface Credit {
  line: string;
  forr: string;
  slug: string;
  side: "left" | "right";
}

/** Screening-room reel — the four hero films. */
export const REEL: Film[] = [
  { slug: "otoko", title: "Otoko", year: "2025" },
  { slug: "mclaren", title: "McLaren", year: "2025" },
  { slug: "salomon", title: "Salomon", year: "2025" },
  { slug: "castle-air", title: "Castle Air", year: "2026" },
];

/** Filmography text index. */
export const INDEX: Film[] = [
  { slug: "otoko", title: "Otoko", year: "2025" },
  { slug: "mclaren", title: "McLaren", year: "2025" },
  { slug: "hera", title: "Hera", year: "2024" },
  { slug: "salomon", title: "Salomon", year: "2025" },
  { slug: "nike", title: "Nike", year: "2024" },
  { slug: "castle-air", title: "Castle Air", year: "2026" },
];

/** Somesuch-style director-first credit beats. */
export const CREDITS: Credit[] = [
  { line: "Directed by Harry Wallis", forr: "for McLaren", slug: "mclaren", side: "left" },
  { line: "Shot on location", forr: "for Salomon", slug: "salomon", side: "right" },
  { line: "Cut, graded and mastered in-house", forr: "for Castle Air", slug: "castle-air", side: "left" },
];

export const STAGES = ["Pre-production", "Production", "Post-production", "In motion"];

export const STATEMENT = "FILMS PEOPLE CHOOSE TO WATCH.";

/** UI face — Suisse Medium via --font-firma. */
export const FIRMA = { fontFamily: "var(--font-firma), sans-serif" } as const;

export const filmSrc = (slug: string) => `/videos/films/${slug}-w.mp4`;
export const filmPoster = (slug: string) => `/videos/films/posters/${slug}-w.jpg`;
