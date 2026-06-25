// Work gallery hierarchy — the exact order Harry sent (Website Gallery Hierarchy).
// Three blocks: Featured (the wall), Discover More, Coming soon. Reading order is
// left → middle → right, row by row; the page reveals tiles in this DOM order.
//
// Real films exist for McLaren, Zuma, Otoko, Nike, Salomon, Hera and Defender;
// everything else is a placeholder (logo over an ambient loop, dimmed) until Harry
// sends the coloured thumbnails. `slug` links a tile to its case page when one
// exists. `micro` is the ambient placeholder clip used when there is no real film.

export interface GalleryItem {
  label: string;
  logo?: string; // stem in /public/logos
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
  { label: "Sans Matin — The Hera Video", logo: "sm-new-logo-design-white-2025", slug: "hera", video: "/videos/films/hera-w.mp4", poster: "/videos/films/posters/hera-w.jpg" },
  { label: "Castle Air — Ascot Campaign", logo: "castle-air-white", micro: "m01" },
  { label: "NatWest", logo: "natwest-white", micro: "m02" },
  { label: "Ferrari", micro: "m03" },
  { label: "Defender", logo: "defender-white", video: "/videos/films/defender-reel.mp4", poster: "/videos/micro/posters/m04.jpg" },
  { label: "Meta — Campus XR", logo: "meta-logo-white", micro: "m05" },
  { label: "Hofmeister — Goffs Video", logo: "hofmeister-png", micro: "m06" },
  { label: "Sans Matin — The Wild Side", logo: "sm-new-logo-design-white-2025", micro: "m07" },
  { label: "Gents Journal — Thomas Straker", logo: "gj-white", micro: "m08" },
  { label: "Spotify Podcast", logo: "spotify-white", micro: "m09" },
];

export const DISCOVER: GalleryItem[] = [
  { label: "Otoko — Salisbury Plain", micro: "m10" },
  { label: "Aston Martin — SW1 Video", logo: "aston-martin-white", micro: "m11" },
  { label: "Gents Journal — Fiskens Video", logo: "gj-white", micro: "m12" },
  { label: "Cycle Pharma — Why Cycle", micro: "m01" },
  { label: "MAC Cosmetics", logo: "mac-cosemetics-white", micro: "m02" },
  { label: "Barclays", micro: "m03" },
];

export const COMING: GalleryItem[] = [
  { label: "Norton", comingSoon: true },
  { label: "Black Crows", logo: "logo-black-crows-white", comingSoon: true },
  { label: "TBC", comingSoon: true },
];
