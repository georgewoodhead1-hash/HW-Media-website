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
    tagline: "Otoko's launch film, shot sunrise to sunset across the Lake District.",
    stats: "2 shoot days · 4 locations · 1-man crew",
    story:
      "The launch film for Otoko, chasing light across the fells from first sun to last. Two days, four locations and a one-man crew, with the Lakeland weather dictating every move. FPV and drone passes carve through the valleys, then drop into slower, deliberate moments that let the landscape breathe.",
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
    tagline: "A hero film for McLaren's Artura — the marque's first hybrid supercar.",
    stats: "3 shoot days · 6 locations · crew of 2",
    story:
      "A hero campaign film for the McLaren Artura, the brand's first series-production hybrid supercar. Turned around in under 72 hours with a two-man crew and a follow-car rig running tight to the panel. Multiple camera perspectives keep you locked inside the experience of speed as the Artura's V6 and electric motor surge together.",
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
    tagline: "Hera — a considered product story for Sans Matin, told with restraint.",
    stats: "1 shoot day · studio + location",
    story:
      "Hera is a product story for Sans Matin, built on restraint. Quiet, deliberate framing and close, tactile detail let the object carry the film without a word of voiceover. Shot in a single day across studio and location, then graded in house to hold the warmth of the brand.",
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
    tagline: "A destination film for Zuma — the high-end Japanese izakaya, in the Maldives.",
    stats: "on location · Maldives",
    story:
      "A destination film for Zuma, the high-end contemporary izakaya, on residency in the Maldives. Robata smoke, fresh-cut sashimi and turquoise water cut to the rhythm of the room. It sells the feeling of being there — the heat of the grill against the calm of the ocean — rather than reciting the menu.",
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
    tagline: "A social-first spot for the Nike Pegasus 41 running shoe.",
    stats: "vertical master · paid social",
    story:
      "A social-first spot for the Nike Pegasus 41, the everyday running workhorse with its ReactX foam and responsive ride. Cut for the feed — fast, rhythmic and built to stop a thumb in the first second. Mastered vertical from the ground up, never cropped as an afterthought.",
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
    tagline: "Trail speed at altitude — Salomon's S/Lab, on the mountain.",
    stats: "on the mountain · crew of 2",
    story:
      "Salomon's S/Lab line is built with elite trail and mountain athletes, so we filmed it the way it actually gets used. Real athletes, real weather windows and the thin air of altitude, chased with a crew of two light enough to move at running pace. Performance product earning its name on the terrain it was made for.",
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
    tagline: "Norton's land-speed record run across the Bonneville salt flats.",
    stats: "10 days on the salt · crew of 3 · 10-min documentary",
    story:
      "A high-speed record run across the Bonneville salt flats for Norton Motorcycles, the heritage British marque. Ten days on the salt with a crew of three, tracking a hand-built machine flat out toward its top-speed mark. Heritage engineering, blinding white horizons and the riders who refuse to let a legend sit still — a ten-minute documentary about chasing a number that won't come easy.",
    services: ["Concept Development", "Direction", "Cinematography", "Post Production"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Norton Motorcycles" },
    ],
  },
  // Placeholder duplicates to fill the grid (real films to be swapped in).
  {
    slug: "black-crows",
    title: "Black Crows",
    client: "Black Crows",
    category: "Brand film",
    year: "2026",
    ...p("salomon"),
    tagline: "Backcountry skiing with Black Crows — powder, altitude and intent.",
    stats: "on the mountain · crew of 2",
    story:
      "A backcountry film for Black Crows, the freeride ski brand born in Chamonix. Filmed on the mountain across a tight weather window, chasing real lines through deep snow with a crew of two light enough to keep pace.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }],
  },
  {
    slug: "mclaren-750s",
    title: "McLaren 750S",
    client: "McLaren",
    category: "Commercial",
    year: "2026",
    ...p("mclaren"),
    tagline: "A track film for the McLaren 750S — lighter, sharper, faster.",
    stats: "2 shoot days · circuit · crew of 2",
    story:
      "A track-led film for the McLaren 750S, the most power-dense series-production McLaren yet. Follow-car rigs and circuit passes keep you locked to the panel as the V8 sings through the gears.",
    services: ["Direction", "Cinematography", "Post Production"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "McLaren" }],
  },
  {
    slug: "zuma-dubai",
    title: "Zuma Dubai",
    client: "Zuma",
    category: "Brand film",
    year: "2026",
    ...p("zuma"),
    tagline: "A destination film for Zuma — the izakaya, on the Gulf.",
    stats: "on location · Dubai",
    story:
      "A destination film for Zuma in Dubai. Robata smoke, fresh sashimi and skyline light cut to the rhythm of the room — selling the feeling of the place over the menu.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Zuma" }],
  },
  {
    slug: "nike-air",
    title: "Nike Air Max",
    client: "Nike",
    category: "Commercial",
    year: "2026",
    ...p("nike"),
    tagline: "A social-first spot for Nike Air Max — built for the feed.",
    stats: "vertical master · paid social",
    story:
      "A social-first spot for Nike Air Max, cut fast and rhythmic for the feed and mastered vertical from the ground up, never cropped as an afterthought.",
    services: ["Direction", "Edit", "Paid Social Versions"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Nike" }],
  },
  {
    slug: "salomon-trail",
    title: "Salomon Trail",
    client: "Salomon",
    category: "Commercial",
    year: "2026",
    ...p("salomon"),
    tagline: "Trail speed at altitude — Salomon, back on the mountain.",
    stats: "on the mountain · crew of 2",
    story:
      "More trail-running work for Salomon, filmed the way the kit actually gets used — real athletes, real weather windows and the thin air of altitude, chased with a crew light enough to move at running pace.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Salomon" }],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((x) => x.slug === slug);
}
