// Shared About-page content — single source of truth, lifted verbatim where
// possible from COPY.md. Agency framing throughout: HW Media is a creative
// agency & production company. Director-led, but the voice is always
// "we / the crew / the collective" — never "one guy with a camera".
// Both about versions (The Index, The Reel) import from here so the words
// stay identical and only the design differs.

export const AGENCY = {
  eyebrow: "Creative agency & production company",
  place: "London",
  reach: "Worldwide",
  est: "Est. 2018",
  h1Lines: ["Who's behind", "the camera."],
  statement: "A creative agency for brands that refuse to be ordinary.",
  statementGold: "refuse to be ordinary",
  lead: "HW Media is a London production agency led by director Harry Wallis. A small senior crew on every job, and no layers between you and the people making the work.",
  crewLead:
    "Small on purpose, and direct. Harry shoots every project himself, with a trusted collective of creatives who scale around the job when it gets bigger.",
  reachLine:
    "Based in London. Working wherever the story is: salt flats, grass strips, festival floors, factory lines.",
  creative: "Every film needs a story at its core, not just coverage.",
  pledge: "No corners should be cut to make this master piece.",
  aristotle: "The whole is greater than the sum of its parts.",
  motto: "Break the ordinary.",
  thesis: "The strongest brands are built on great stories.",
  email: "harry@hwmedia.co.uk",
} as const;

export interface CrewMember {
  name: string;
  role: string;
  line: string;
  still: string;
}

// Stills stand in for the crew contact-sheet (real photos pending Harry).
export const CREW: CrewMember[] = [
  {
    name: "Harry Wallis",
    role: "Director / DP",
    line: "Directs and shoots every project himself — the person who promises the film is the person behind the camera. A CAA-authorised drone pilot, so the aerials are in-house too.",
    still: "/images/stills/s01.jpg",
  },
];

export const COLLECTIVE =
  "When the job is bigger, a trusted collective of creatives scales around him.";

export interface Film {
  title: string;
  stat: string;
  // Asset slug → poster `/videos/films/posters/<slug>-p.jpg` (portrait),
  // `<slug>-w.jpg` (wide), film `/videos/films/<slug>-w.mp4`.
  slug: string;
}

export const FILMS: Film[] = [
  { title: "Chasing the Salt", stat: "10 days on the salt · crew of 3 · 10-min documentary", slug: "chasing-the-salt" },
  { title: "Marque", stat: "3 shoot days · 6 locations · crew of 2", slug: "mclaren" },
  { title: "Otoko", stat: "1 day · crew of 2 · 60-second film", slug: "otoko" },
  { title: "Heritage Flight", stat: "2 shoot days · air to air · one weather window", slug: "hera" },
  { title: "Off Piste", stat: "2 days at altitude · crew of 2 · 60-second promo", slug: "salomon" },
  { title: "The Launch", stat: "3 shoot days · studio and location", slug: "nike" },
  { title: "The Set", stat: "one night · 4 cameras · cut by sunrise", slug: "zuma" },
];

export interface Service {
  name: string;
  line: string;
  job: string;
}

export const SERVICES: Service[] = [
  { name: "Brand films", line: "One film that says who you are, built to carry you for years.", job: "2–4 shoot days · crew of 1–3" },
  { name: "Documentary", line: "Real people, real stakes, given the time to breathe.", job: "Stay long enough and the truth films itself" },
  { name: "Commercial", line: "Campaign work with cinema standards, every format mastered.", job: "Verticals included" },
  { name: "Live events", line: "Coverage that feels like being in the room.", job: "Shot, edited and delivered the same night" },
  { name: "Photography", line: "Stills with the same eye as the films.", job: "On film days or on their own" },
];

export interface Stat {
  figure: string;
  label: string;
}

export const NUMBERS: Stat[] = [
  { figure: "60+", label: "Films delivered" },
  { figure: "14", label: "Countries filmed in" },
  { figure: "Same day", label: "Fastest turnaround" },
  { figure: "Most", label: "Clients who come back" },
];

export interface ClientLogo {
  src: string;
  alt: string;
}

// Verified client wall (COPY.md, Norton deck p3) — real logo files in /public/logos.
export const CLIENTS: ClientLogo[] = [
  { src: "/logos/mclaren-logo.png", alt: "McLaren" },
  { src: "/logos/aston-martin-white.png", alt: "Aston Martin" },
  { src: "/logos/nike-white.png", alt: "Nike" },
  { src: "/logos/spotify-white.png", alt: "Spotify" },
  { src: "/logos/diageo-white.png", alt: "Diageo" },
  { src: "/logos/defender-white.png", alt: "Defender" },
  { src: "/logos/salomon-logo-white.png", alt: "Salomon" },
  { src: "/logos/natwest-white.png", alt: "NatWest" },
  { src: "/logos/airbus-white.png", alt: "Airbus" },
  { src: "/logos/waldorf-astoria-white.png", alt: "Waldorf Astoria" },
  { src: "/logos/abby-road-studios-white.png", alt: "Abbey Road Studios" },
  { src: "/logos/meta-logo-white.png", alt: "Meta" },
];
