// HARRY'S REAL FILMS (Drive drop, 2026-06-11), landing order as specified:
// Otoko Lake District, McLaren, Sans Matin Hera, Zuma, Nike, Salomon —
// plus Chasing the Salt as the seventh. Loops cut from the masters in
// Clients/hw-media/assets/films/ (wide -w 16:9, portrait -p 3:4).
// Stats for Otoko + McLaren are REAL (Norton deck p10); others TBC.

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  loop: string; // portrait 3:4 — the crate / landing scroll
  wide: string; // 16:9 — work grid, case pages
  poster: string;
  posterWide: string;
  tagline: string;
  stats: string;
  story: string;
  services: string[];
  credits: { role: string; name: string }[];
}

const p = (slug: string) => ({
  loop: `/videos/films/${slug}-p.mp4`,
  wide: `/videos/films/${slug}-w.mp4`,
  poster: `/videos/films/posters/${slug}-p.jpg`,
  posterWide: `/videos/films/posters/${slug}-w.jpg`,
});

export const projects: Project[] = [
  {
    slug: "otoko",
    title: "Otoko",
    client: "Otoko",
    category: "Brand film",
    year: "2026",
    ...p("otoko"),
    tagline: "A launch film shot across the Lake District, sunrise to sunset.",
    stats: "2 shoot days · 4 locations · 1-man crew",
    story:
      "Captured across two shoot days with the weather setting the tone. Drone work, FPV movement and fast-paced action balanced with slower, intentional moments.",
    services: ["Direction", "Cinematography", "Post Production"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }],
  },
  {
    slug: "mclaren",
    title: "McLaren Artura",
    client: "McLaren",
    category: "Commercial",
    year: "2025",
    ...p("mclaren"),
    tagline: "A hero campaign film built around pace, movement and impact.",
    stats: "3 shoot days · 6 locations · crew of 2",
    story:
      "Organised in under 72 hours with a two-man crew. Follow-car rig shots and multiple camera perspectives keep the audience inside the experience of speed.",
    services: ["Direction", "Cinematography", "Post Production"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "McLaren" },
    ],
  },
  {
    slug: "hera",
    title: "Hera",
    client: "Sans Matin",
    category: "Brand film",
    year: "2026",
    ...p("hera"),
    tagline: "A product story for Sans Matin, told with restraint.",
    stats: "1 shoot day · studio + location",
    story:
      "Quiet, deliberate framing that lets the product carry the film. Shot in a day, graded in house.",
    services: ["Direction", "Cinematography", "Colour"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Sans Matin" },
    ],
  },
  {
    slug: "zuma",
    title: "Zuma Maldives",
    client: "Zuma",
    category: "Brand film",
    year: "2025",
    ...p("zuma"),
    tagline: "A destination film for Zuma's Maldives residency.",
    stats: "on location · Maldives",
    story:
      "Food, water and light. A hospitality film that sells the feeling of being there rather than the menu.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Zuma" },
    ],
  },
  {
    slug: "nike",
    title: "Nike Pegasus 41",
    client: "Nike",
    category: "Commercial",
    year: "2025",
    ...p("nike"),
    tagline: "A social-first ad for the Pegasus 41.",
    stats: "vertical master · paid social",
    story:
      "Cut for the feed: fast, rhythmic, built to stop a thumb. Mastered vertical, never cropped as an afterthought.",
    services: ["Direction", "Edit", "Paid Social Versions"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Nike" },
    ],
  },
  {
    slug: "salomon",
    title: "Salomon S/Lab",
    client: "Salomon",
    category: "Commercial",
    year: "2025",
    ...p("salomon"),
    tagline: "Trail speed, shot at altitude for Salomon.",
    stats: "on the mountain · crew of 2",
    story:
      "Athletes, weather windows and thin air. Performance product filmed the way it gets used.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Salomon" },
    ],
  },
  {
    slug: "chasing-the-salt",
    title: "Chasing the Salt",
    client: "Norton",
    category: "Documentary",
    year: "2026",
    ...p("chasing-the-salt"),
    tagline: "A land speed record attempt at Bonneville, with Norton.",
    stats: "10 days on the salt · crew of 3 · 10-min documentary",
    story:
      "A land-speed record attempt on the Bonneville salt flats. Heritage machines, thin air, and the people who refuse to let legends rest. The salt remembers.",
    services: ["Concept Development", "Direction", "Cinematography", "Post Production"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Norton Motorcycles" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((x) => x.slug === slug);
}
