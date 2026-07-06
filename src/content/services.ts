// The services HW Media offers — powers the About "What we do" grid AND the
// /services/<slug> pages (George: click a service, get a little page of what
// we offer for that thing). ⚠ COPY IS PLACEHOLDER — Harry approves pre-launch.

export interface Service {
  slug: string;
  name: string;
  clip: string; // ambient loop behind the tile / page header
  blurb: string; // the one-paragraph pitch
  deliverables: string[]; // what you actually get
  related: string[]; // project slugs to show as proof
}

export const SERVICES: Service[] = [
  {
    slug: "brand-films",
    name: "Brand films",
    clip: "/videos/micro/m01.mp4",
    blurb:
      "The flagship piece — the film that says who you are before anyone reads a word. Directed, shot and graded in-house, built around one idea and made to outlive the campaign it launched with.",
    deliverables: ["Concept & treatment", "Direction & cinematography", "Edit, grade & sound", "A master built to last"],
    related: ["otoko", "hera", "defender"],
  },
  {
    slug: "documentary",
    name: "Documentary",
    clip: "/videos/micro/m03.mp4",
    blurb:
      "Real people, real places, no script worth keeping. We follow the story where it goes and cut it honestly — films people choose to watch, not adverts they sit through.",
    deliverables: ["Story development", "On-location shooting", "Interview direction", "Long-form edit & grade"],
    related: ["chasing-the-salt", "otoko-salisbury"],
  },
  {
    slug: "commercial",
    name: "Commercial",
    clip: "/videos/micro/m05.mp4",
    blurb:
      "Campaign work with cinema standards — launches, product films and event coverage delivered at the pace a campaign demands, without the standard drop in craft.",
    deliverables: ["Campaign concepting", "Production & crew", "Fast-turnaround edit", "Versions for every channel"],
    related: ["ferrari", "nike", "mclaren"],
  },
  {
    slug: "photography",
    name: "Photography",
    clip: "/videos/micro/m04.mp4",
    blurb:
      "Stills with the same eye as the films — campaign photography, BTS and brand libraries shot alongside the moving work so everything matches.",
    deliverables: ["Campaign stills", "BTS coverage", "Brand image libraries", "Retouch & delivery"],
    related: ["mclaren", "zuma"],
  },
  {
    slug: "live-events",
    name: "Live events",
    clip: "/videos/micro/m06.mp4",
    blurb:
      "Launches, activations and one-night-only moments, covered as films rather than highlight tapes — cut around the moment that mattered and delivered while it's still news.",
    deliverables: ["Multi-camera coverage", "Same-week masters", "Social cutdowns", "Photography add-on"],
    related: ["ferrari", "hofmeister"],
  },
  {
    slug: "aerial",
    name: "Aerial",
    clip: "/videos/micro/m08.mp4",
    blurb:
      "Aerials stay in-house — Harry is a CAA-authorised drone pilot, so the shots that usually need a second crew are part of the day, from FPV passes to air-to-air work.",
    deliverables: ["CAA-authorised operation", "FPV & cinematic drone", "Air-to-air coverage", "Fully insured"],
    related: ["aw139", "aw109", "castle-air"],
  },
  {
    slug: "edit-grade",
    name: "Edit & grade",
    clip: "/videos/micro/m10.mp4",
    blurb:
      "The finish is the film. Edit, colour and sound handled by the same eyes that shot it — so the intent survives all the way to the master.",
    deliverables: ["Offline & online edit", "Colour grade", "Sound design & mix", "Delivery in every format"],
    related: ["salomon", "otoko"],
  },
  {
    slug: "social-cutdowns",
    name: "Social cutdowns",
    clip: "/videos/micro/m11.mp4",
    blurb:
      "Every master comes with the verticals, squares and shorts your channels need — recomposed properly for each frame, never cropped as an afterthought.",
    deliverables: ["Vertical & square masters", "Platform-length cuts", "Subtitled versions", "Paid-social variants"],
    related: ["am-sw1", "aston-db12", "mac-halloween"],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
