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
    slug: "castle-air",
    title: "Castle Air",
    client: "Castle Air",
    category: "Brand film",
    year: "2025",
    ...p("castle-air"),
    tagline: "A cinematic campaign for Castle Air, the luxury helicopter charter — London to Ascot.",
    stats: "1 shoot day · London & Ascot · 1-man crew",
    story:
      "A brand film for Castle Air, the UK's premier private helicopter charter. We followed the client experience from a London street to the Ascot heli-pad — the suit, the classic car, the lift-off — cutting between ground glamour and aerial scale to sell the feeling of arriving in a way nobody else can.",
    services: ["Direction", "Cinematography", "Aerial", "Post Production"],
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

// ── The rest of the wall (2026-07-04): every gallery tile now links to its
// own case page. Media = the 9s wall loops cut from Harry's Drive masters
// (/videos/wall). No portrait cuts exist for these, so loop mirrors wide.
// ⚠ COPY IS PLACEHOLDER — grounded in the footage + client, but Harry must
// approve every story before launch (same rule as the process copy).
const w = (file: string) => ({
  loop: `/videos/wall/${file}.mp4`,
  wide: `/videos/wall/${file}.mp4`,
  poster: `/videos/wall/posters/${file}.jpg`,
  posterWide: `/videos/wall/posters/${file}.jpg`,
});
// placeholder media for films still to land — ambient micro loop, dimmed
const m = (clip: string) => ({
  loop: `/videos/micro/${clip}.mp4`,
  wide: `/videos/micro/${clip}.mp4`,
  poster: `/videos/micro/posters/${clip}.jpg`,
  posterWide: `/videos/micro/posters/${clip}.jpg`,
});

const wallProjects: Project[] = [
  {
    slug: "ferrari",
    title: "Ferrari — Celindri 12 Launch",
    client: "Ferrari",
    category: "Event film",
    year: "2026",
    ...w("ferrari"),
    tagline: "The Celindri 12 unveiled — a launch event film cut to the drop of the cover.",
    stats: "1 evening · same-week delivery",
    story:
      "Ferrari's Celindri 12 launch, covered as a film rather than a highlights tape. We built the edit around the moment the cover comes off — the room, the faces, the car — so the film carries the same tension the evening did. Delivered within the week, while the launch was still news.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Ferrari" }],
  },
  {
    slug: "defender",
    title: "Defender",
    client: "Defender",
    category: "Brand film",
    year: "2026",
    ...w("defender"),
    tagline: "The Defender reel — dust, fields and last light, shot from the passenger seat out.",
    stats: "on location · aerials in-house",
    story:
      "A running reel for Defender built from real drives — dust kicked across a field at golden hour, camera rigs hanging off the bodywork, the landscape doing the talking. Ground and aerial coverage shot in-house, cut to feel like the drive itself.",
    services: ["Direction", "Cinematography", "Aerial", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Defender" }],
  },
  {
    slug: "hofmeister",
    title: "Hofmeister — Goffs",
    client: "Hofmeister",
    category: "Brand film",
    year: "2026",
    ...w("hof-castle-air"),
    tagline: "Hofmeister at Goffs — Bavarian lager meets the bloodstock sales, by helicopter.",
    stats: "1 shoot day · with Castle Air",
    story:
      "Hofmeister's day at the Goffs sales, filmed with Castle Air along for the ride. The brief was swagger without send-up: the helicopter arrival, the ring, the pour — graded warm and cut with a straight face, which is exactly why it works.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Hofmeister" }],
  },
  {
    slug: "meta-campus-xr",
    title: "Meta — Campus XR",
    client: "Meta",
    category: "Corporate film",
    year: "2026",
    ...w("meta-campus-xr"),
    tagline: "Campus XR for Meta — the headset demo that had to feel like the future, on film.",
    stats: "campus shoot · tech demo coverage",
    story:
      "A film for Meta's Campus XR programme — capturing a technology demo without the usual corporate-video flatness. Real reactions in the headset, clean product coverage out of it, cut at a pace that keeps the energy of the room.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Meta" }],
  },
  {
    slug: "wild-side",
    title: "Sans Matin — The Wild Side",
    client: "Sans Matin",
    category: "Brand film",
    year: "2025",
    ...w("wild-side"),
    tagline: "The Wild Side — Sans Matin off the pavement and into the landscape.",
    stats: "on location · 1-man crew",
    story:
      "The second Sans Matin film takes the brand off the pavement — boots, weather and open country, shot handheld and close. A one-man crew moving at walking pace, so the film feels like being there rather than watching an advert.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Sans Matin" }],
  },
  {
    slug: "otoko-salisbury",
    title: "Otoko — Salisbury Plain",
    client: "Otoko",
    category: "Brand film",
    year: "2026",
    ...w("otoko-hero"),
    tagline: "Otoko's second film — hero footage across the open sweep of Salisbury Plain.",
    stats: "1 shoot day · FPV + drone",
    story:
      "After the Lake District launch, Otoko came back for a second landscape — the open sweep of Salisbury Plain. Big skies, long lenses and FPV passes low across the grass, cut around the product without ever feeling like a product film.",
    services: ["Direction", "Cinematography", "Aerial", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Otoko" }],
  },
  {
    slug: "am-sw1",
    title: "Aston Martin × SW1",
    client: "Aston Martin",
    category: "Social campaign",
    year: "2026",
    ...w("am-sw1"),
    tagline: "Aston Martin with SW1 — a social film with showroom polish.",
    stats: "social-first · vertical cutdowns",
    story:
      "A social-first film for Aston Martin with SW1 — showroom polish at feed pace. Shot to hold up full-screen and cut down clean to vertical, so the same film works on the timeline and on the wall of the dealership.",
    services: ["Direction", "Cinematography", "Edit", "Social Cutdowns"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Aston Martin" }],
  },
  {
    slug: "gj-fiskens",
    title: "Gents Journal × Fiskens",
    client: "Gentleman's Journal",
    category: "Brand film",
    year: "2026",
    ...w("gj-fiskens"),
    tagline: "Fiskens' historic motor cars through the Gentleman's Journal lens.",
    stats: "1 shoot day · London",
    story:
      "Gentleman's Journal meets Fiskens, the historic motor car specialists. Machines with seven-figure histories, filmed the way they deserve — patient camera moves, natural light and a grade that lets the paintwork do the talking.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Gentleman's Journal" }],
  },
  {
    slug: "cycle-pharma",
    title: "Cycle Pharma — Why Cycle",
    client: "Cycle Pharma",
    category: "Corporate film",
    year: "2026",
    ...w("cycle-pharma"),
    tagline: "Why Cycle — a brand story for a pharmaceutical company that talks like a human.",
    stats: "brand film · full campaign",
    story:
      "Cycle Pharma needed their story told without the stock-footage gloss that plagues the sector. Why Cycle is people, purpose and place — real staff, real labs, a script that talks like a human — cut into a film the whole company actually shows people.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Cycle Pharma" }],
  },
  {
    slug: "mac-halloween",
    title: "MAC Cosmetics — Halloween",
    client: "MAC Cosmetics",
    category: "Social campaign",
    year: "2025",
    ...w("mac-halloween"),
    tagline: "MAC's Halloween drop — beauty content with actual production values.",
    stats: "studio shoot · social masters",
    story:
      "MAC's Halloween campaign, shot in studio with the looks front and centre. Beauty content usually gets phone-and-ringlight treatment; this got cinema glass, controlled light and an edit cut to the drop — and it performed like it.",
    services: ["Direction", "Cinematography", "Edit", "Social Cutdowns"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "MAC Cosmetics" }],
  },
  {
    slug: "aston-db12",
    title: "Aston Martin DB12",
    client: "Aston Martin",
    category: "Social campaign",
    year: "2024",
    ...w("aston-db12"),
    tagline: "The DB12 social campaign — grand touring, cut for the feed.",
    stats: "social campaign · 2024",
    story:
      "A social campaign ad for the Aston Martin DB12 — the grand tourer treated with proper car-film craft, then cut to the length and rhythm the feed demands. Full-bleed beauty work up front, pace where it counts.",
    services: ["Direction", "Cinematography", "Edit", "Social Cutdowns"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Aston Martin" }],
  },
  {
    slug: "aw139",
    title: "Castle Air — AW139",
    client: "Castle Air",
    category: "Brand film",
    year: "2026",
    ...w("aw139"),
    tagline: "The AW139 — Castle Air's flagship, filmed air-to-air and in-house.",
    stats: "air-to-air · CAA-authorised",
    story:
      "A film for Castle Air's flagship AW139 — the machine that does the heavy lifting of their charter fleet. Ground beauty work and air-to-air passes, all flown and filmed in-house under CAA authorisation, graded to match the rest of the Castle Air campaign.",
    services: ["Direction", "Cinematography", "Aerial", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Castle Air" }],
  },
  {
    slug: "aw109",
    title: "Castle Air — AW109",
    client: "Castle Air",
    category: "Brand film",
    year: "2026",
    ...w("aw109"),
    tagline: "The AW109 — the fast twin, shot with the same air-to-air discipline.",
    stats: "air-to-air · CAA-authorised",
    story:
      "The AW109 is Castle Air's fast twin — smaller, quicker, and every bit as filmable. Same in-house aerial unit, same discipline: clean air-to-air lines, patient ground coverage and a grade that keeps the fleet looking like one family.",
    services: ["Direction", "Cinematography", "Aerial", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Castle Air" }],
  },
  {
    slug: "natwest",
    title: "NatWest",
    client: "NatWest",
    category: "Corporate film",
    year: "2026",
    ...m("m02"),
    tagline: "Event and campaign film work for NatWest — full film coming to the site soon.",
    stats: "corporate · film to follow",
    story:
      "Corporate film work for NatWest — event coverage and campaign content delivered with the same standards as the brand work. The full film lands on the site soon.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "NatWest" }],
  },
  {
    slug: "gj-straker",
    title: "Gentleman\u2019s Journal",
    client: "Gentleman's Journal",
    category: "Brand film",
    year: "2026",
    ...m("m08"),
    tagline: "Thomas Straker with Gentleman's Journal — full film coming to the site soon.",
    stats: "brand film · film to follow",
    story:
      "A Gentleman's Journal feature with chef Thomas Straker — kitchen, craft and character. The full film lands on the site soon.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Gentleman's Journal" }],
  },
  {
    slug: "eleven-bibury",
    title: "Eleven Bibury",
    client: "Eleven Bibury",
    category: "Brand film",
    year: "2026",
    ...w("eleven-bibury"),
    tagline: "A highlight film for Eleven Bibury — the hotel, the grounds and the people who run it.",
    stats: "brand film · hospitality",
    story:
      "A highlight film for Eleven Bibury. The hotel, the grounds and the people who run it, shot and cut to feel like the stay does.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Eleven Bibury" }],
  },
  {
    slug: "pitch-event",
    title: "Pitch Event — Wrap Up",
    client: "Event film",
    category: "Event film",
    year: "2026",
    ...w("pitch-event-wrapup"),
    tagline: "A same-week wrap-up film for a pitch event — the room, the people and the moments that mattered.",
    stats: "event film · same-week delivery",
    story:
      "The wrap-up film for a pitch event, cut around the room and the people rather than a highlights checklist, and delivered while the event was still news.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }],
  },
  {
    slug: "youtube-winner",
    title: "YouTube Winner — Wrap Up",
    client: "Event film",
    category: "Event film",
    year: "2025",
    ...w("youtube-winner-wrapup"),
    tagline: "The 2025 wrap-up film — a year of work in one cut.",
    stats: "event film · 2025",
    story:
      "The 2025 winner wrap-up film. A year of work condensed into one cut that holds its pace from the first frame to the last.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }],
  },
  {
    slug: "event-highlights",
    title: "Event Highlights",
    client: "Event film",
    category: "Event film",
    year: "2026",
    ...w("highlight-v2"),
    tagline: "An event highlights film — shot, cut and delivered while it was still news.",
    stats: "event film",
    story:
      "An event highlights film shot and delivered at campaign pace. Covered as a film rather than a highlight tape.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }],
  },
  {
    slug: "spotify",
    title: "Spotify Podcast",
    client: "Spotify",
    category: "Commercial",
    year: "2026",
    ...m("m09"),
    tagline: "Podcast content for Spotify — full film coming to the site soon.",
    stats: "multi-cam · film to follow",
    story:
      "Multi-camera podcast production for Spotify — studio coverage, edit and delivery built for the platform. The full film lands on the site soon.",
    services: ["Direction", "Multi-cam Production", "Edit"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }, { role: "Client", name: "Spotify" }],
  },
  {
    slug: "showreel",
    title: "Showreel 2025",
    client: "HW Media",
    category: "Showreel",
    year: "2025",
    ...w("showreel"),
    tagline: "One year of films in ninety seconds — the 2025 showreel.",
    stats: "12 months · every client",
    story:
      "The 2025 showreel — a year of brand films, commercials and campaigns cut into one run. McLaren to MAC, mountains to launch events: if you only watch one thing on this site, watch this.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }],
  },
];

projects.push(...wallProjects);

export function getProject(slug: string): Project | undefined {
  return projects.find((x) => x.slug === slug);
}
