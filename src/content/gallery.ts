// Work gallery hierarchy — the exact order Harry sent (Website Gallery Hierarchy).
// Three blocks: Featured (the wall), Discover More, Coming soon. Reading order is
// left → middle → right, row by row; the page reveals tiles in this DOM order.
//
// EVERY tile now has a `slug` — George: "you're supposed to be able to click on
// a project and it takes you to that project" — so every tile links to its own
// case page in projects.ts. Real films (Harry's Drive drop, transcoded to
// /videos/wall) cover almost all of the wall; the only ambient placeholders
// left are NatWest, GJ — Straker, Spotify and Barclays (no footage in the
// Drive yet — their case pages say "film to follow").

export interface GalleryItem {
  label: string;
  logo?: string; // stem in /public/logos
  mark?: string; // TEXT shown instead of the logo — used when the same client
  // logo would otherwise repeat on the wall (George: no duplicates)
  bare?: boolean; // no overlay at all — the footage carries its own logo
  slug?: string; // /work/<slug> when a detail page exists
  video?: string; // real film (wide 16:9)
  poster?: string;
  micro?: string; // ambient placeholder clip stem (m01..m12) when no real film
  comingSoon?: boolean;
}

export const FEATURED: GalleryItem[] = [
  { label: "McLaren", logo: "mclaren-logo", slug: "mclaren", video: "/videos/films/mclaren-w.mp4", poster: "/videos/films/posters/mclaren-w.jpg" },
  { label: "Zuma", logo: "zuma-white", slug: "zuma", video: "/videos/films/zuma-w.mp4", poster: "/videos/films/posters/zuma-w.jpg" },
  { label: "Otoko — Lake District", slug: "otoko", video: "/videos/films/otoko-w.mp4", poster: "/videos/films/posters/otoko-w.jpg" },
  { label: "Nike", logo: "nike-white", slug: "nike", video: "/videos/films/nike-w.mp4", poster: "/videos/films/posters/nike-w.jpg" },
  { label: "Salomon", logo: "salomon-logo-white", slug: "salomon", video: "/videos/films/salomon-w.mp4", poster: "/videos/films/posters/salomon-w.jpg" },
  // bare: the Hera master has the SM logo BAKED IN — overlaying it again
  // doubled the mark (George's "duplicate" complaint)
  { label: "Sans Matin — The Hera Video", bare: true, slug: "hera", video: "/videos/films/hera-w.mp4", poster: "/videos/films/posters/hera-w.jpg" },
  { label: "Castle Air — Ascot Campaign", logo: "castle-air-white", slug: "castle-air", video: "/videos/films/castle-air-w.mp4", poster: "/videos/films/posters/castle-air-w.jpg" },
  // NatWest + Spotify + Straker: the ambient placeholder loops read as the
  // WRONG footage (George) — logo on plain dark until the real films are named
  { label: "NatWest", logo: "natwest-white", slug: "natwest" },
  { label: "Ferrari", slug: "ferrari", video: "/videos/wall/ferrari.mp4", poster: "/videos/wall/posters/ferrari.jpg" },
  { label: "Defender", logo: "defender-white", slug: "defender", video: "/videos/wall/defender.mp4", poster: "/videos/wall/posters/defender.jpg" },
  { label: "Meta — Campus XR", logo: "meta-logo-white", slug: "meta-campus-xr", video: "/videos/wall/meta-campus-xr.mp4", poster: "/videos/wall/posters/meta-campus-xr.jpg" },
  { label: "Hofmeister — Goffs Video", logo: "hofmeister-png", slug: "hofmeister", video: "/videos/wall/hof-castle-air.mp4", poster: "/videos/wall/posters/hof-castle-air.jpg" },
  { label: "Sans Matin — The Wild Side", logo: "sm-new-logo-design-white-2025", slug: "wild-side", video: "/videos/wall/wild-side.mp4", poster: "/videos/wall/posters/wild-side.jpg" },
  // client final round: the Gents Journal LOGO replaces the THOMAS STRAKER text mark
  { label: "Gentleman\u2019s Journal", logo: "gj-white", slug: "gj-straker" },
  { label: "Spotify Podcast", logo: "spotify-white", slug: "spotify" },
];

export const DISCOVER: GalleryItem[] = [
  { label: "Otoko — Salisbury Plain", slug: "otoko-salisbury", video: "/videos/wall/otoko-hero.mp4", poster: "/videos/wall/posters/otoko-hero.jpg" },
  { label: "Aston Martin — SW1 Video", logo: "aston-martin-white", slug: "am-sw1", video: "/videos/wall/am-sw1.mp4", poster: "/videos/wall/posters/am-sw1.jpg" },
  { label: "Gents Journal — Fiskens Video", logo: "gj-white", slug: "gj-fiskens", video: "/videos/wall/gj-fiskens.mp4", poster: "/videos/wall/posters/gj-fiskens.jpg" },
  { label: "Cycle Pharma — Why Cycle", slug: "cycle-pharma", video: "/videos/wall/cycle-pharma.mp4", poster: "/videos/wall/posters/cycle-pharma.jpg" },
  { label: "MAC Cosmetics", logo: "mac-cosemetics-white", slug: "mac-halloween", video: "/videos/wall/mac-halloween.mp4", poster: "/videos/wall/posters/mac-halloween.jpg" },
  // was mislabelled "Barclays" — the footage is the 2025 showreel (George)
  { label: "Showreel 2025", mark: "SHOWREEL", slug: "showreel", video: "/videos/wall/showreel.mp4", poster: "/videos/wall/posters/showreel.jpg" },
  // mark overrides below: Aston Martin + Castle Air logos already appear
  // above — repeated logos read as duplicates (George)
  { label: "Aston Martin — DB12", logo: "aston-martin-white", mark: "DB12", slug: "aston-db12", video: "/videos/wall/aston-db12.mp4", poster: "/videos/wall/posters/aston-db12.jpg" },
  { label: "Castle Air — AW139", logo: "castle-air-white", mark: "AW139", slug: "aw139", video: "/videos/wall/aw139.mp4", poster: "/videos/wall/posters/aw139.jpg" },
  { label: "Castle Air — AW109", logo: "castle-air-white", mark: "AW109", slug: "aw109", video: "/videos/wall/aw109.mp4", poster: "/videos/wall/posters/aw109.jpg" },
  // the four Drive films that were transcoded but never wired (George)
  { label: "Eleven Bibury", slug: "eleven-bibury", video: "/videos/wall/eleven-bibury.mp4", poster: "/videos/wall/posters/eleven-bibury.jpg" },
  { label: "Pitch Event — Wrap Up", slug: "pitch-event", video: "/videos/wall/pitch-event-wrapup.mp4", poster: "/videos/wall/posters/pitch-event-wrapup.jpg" },
  { label: "YouTube Winner — Wrap Up", slug: "youtube-winner", video: "/videos/wall/youtube-winner-wrapup.mp4", poster: "/videos/wall/posters/youtube-winner-wrapup.jpg" },
  { label: "Event Highlights", slug: "event-highlights", video: "/videos/wall/highlight-v2.mp4", poster: "/videos/wall/posters/highlight-v2.jpg" },
];

export const COMING: GalleryItem[] = [
  { label: "Norton", comingSoon: true },
  { label: "Black Crows", logo: "logo-black-crows-white", comingSoon: true },
  { label: "TBC", comingSoon: true },
];
