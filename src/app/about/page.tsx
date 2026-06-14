import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Crew — HW Media",
  description:
    "Who works for HW Media: Harry Wallis directs and shoots, Glen produces, Will handles stills. A small crew with a collective behind it, London-based, working worldwide.",
};

// The crew page, built on the Chasing The Salt deck's MEDIA TEAM layout:
// staggered B&W frames with red-pen markup, paper-note bios ending in a
// short rule, a creative statement block, and the collective note.

const PROCESS = [
  ["01", "Listen", "Every brief starts with the story you already have. We find the heritage worth filming."],
  ["02", "Author", "Treatment, story arcs, shot design: authored with intention before a camera comes out."],
  ["03", "Direct", "On the day: one crew, every department, no corners cut."],
  ["04", "Deliver", "The edit, the grade, the masters, and the cutdowns your channels actually need."],
] as const;

const CREW = [
  {
    name: "Glen",
    script: "Glen · Cam Op & Producer",
    img: "/images/stills/s03.jpg",
    note: "real photo soon",
    bio: "Glen keeps the shoot standing up: schedules, locations, permits, weather calls, and a second camera when the day needs one. Ten years of production across commercials and live events. If the day feels calm, that's Glen.",
  },
  {
    name: "Will",
    script: "Will · Photographer & Cam Op",
    img: "/images/stills/s05.jpg",
    note: "real photo soon",
    bio: "Will shoots the stills: campaign frames, editorial sets and the behind-the-scenes record of every project. Same eye as the films, so the photography never feels like an afterthought.",
  },
];

export default function About() {
  return (
    <main>
      {/* hero */}
      <section data-theme="light" className="px-5 pb-[12vh] pt-40 md:px-10">
        <p className="label-mono mb-10 opacity-50">SC.A — The crew</p>
        <h1 className="font-display display-xl max-w-5xl text-[var(--ink)]">
          Who&apos;s behind
          <br />
          the <span className="font-accent text-[var(--gold)]">camera.</span>
        </h1>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <p className="max-w-md leading-relaxed text-[var(--ink)]/75">
            HW Media is a small crew on purpose. One director who shoots,
            one producer who runs the day, one photographer, and a collective
            of trusted creatives who scale around the job.
          </p>
          <p className="max-w-md leading-relaxed text-[var(--ink)]/75 md:justify-self-end">
            Based in London. Working wherever the story is:
            salt flats, grass strips, festival floors, factory lines.
          </p>
        </div>
      </section>

      {/* media team — the deck's marked-up contact sheet */}
      <section data-theme="dark" className="px-5 py-[14vh] md:px-10">
        <p className="scene-marker label-mono mb-16 opacity-60">
          <span>Media team</span>
        </p>

        {/* Harry — lead block */}
        <div className="grid gap-12 md:grid-cols-[44%_1fr] md:gap-16">
          <div className="relative">
            <span className="font-hand absolute -top-8 left-2 z-10 rotate-[-3deg] text-2xl md:text-3xl">
              Harry · Director &amp; DP
            </span>
            <div className="group relative overflow-hidden rounded-xl">
              <Image
                src="/images/harry-bw.jpg"
                alt="Harry Wallis on set"
                width={1600}
                height={900}
                className="w-full grayscale"
              />
              <Image
                src="/images/harry-color.jpg"
                alt=""
                aria-hidden
                width={1600}
                height={900}
                className="absolute inset-0 w-full transition-[clip-path] duration-500 [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0%)]"
                style={{ transitionTimingFunction: "var(--ease-expo)" }}
              />
              <span className="font-hand absolute bottom-2 right-3 rotate-[-4deg] text-xl">
                the grade ⟶
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-display display-lg">Harry Wallis</h2>
            <p className="label-mono mt-3 text-[var(--gold)]">Founder · Director · DP</p>
            <div className="note-rule mt-8 max-w-md space-y-4">
              <p className="leading-relaxed text-[var(--paper-text)]/75">
                Harry has spent the last few years making films for performance
                and legacy brands: McLaren, Aston Martin, Norton, Defender. He
                directs and shoots every HW Media project himself, with
                documentary instincts and commercial discipline.
              </p>
              <p className="leading-relaxed text-[var(--paper-text)]/75">
                He believes in beautiful, timeless, emotional storytelling. If
                a project doesn&apos;t have those qualities in it somewhere, it
                isn&apos;t the right story to tell.
              </p>
            </div>
          </div>
        </div>

        {/* Glen + Will — staggered pair, deck-style */}
        <div className="mt-[12vh] grid gap-x-16 gap-y-20 md:grid-cols-2">
          {CREW.map((m, i) => (
            <div key={m.name} className={`grid max-w-xl gap-8 md:grid-cols-[240px_1fr] ${i === 1 ? "md:mt-24 md:justify-self-end" : ""}`}>
              <div className="relative">
                <span className="font-hand absolute -top-7 left-1 z-10 rotate-[-3deg] whitespace-nowrap text-xl">
                  {m.script}
                </span>
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={m.img}
                    alt={`${m.name} — HW Media crew`}
                    width={800}
                    height={1000}
                    className="aspect-[4/5] w-full object-cover grayscale"
                  />
                  <span className="font-hand absolute bottom-2 right-2 rotate-[-4deg] text-lg opacity-80">
                    {m.note}
                  </span>
                </div>
              </div>
              <p className="note-rule self-center text-sm leading-relaxed text-[var(--paper-text)]/70">
                {m.bio}
              </p>
            </div>
          ))}
        </div>

        {/* the collective note — straight from the deck's team page */}
        <div className="mx-auto mt-[12vh] max-w-2xl text-center">
          <span className="bar-label">The collective</span>
          <p className="mt-7 leading-relaxed text-[var(--paper-text)]/75">
            One of the strengths of HW Media is the flexibility of our
            creatives. Depending on what a project needs, we bring in extra
            crew from a collective of world-class people: sound, drone,
            colour, second units. The team scales. The standard doesn&apos;t.
          </p>
        </div>
      </section>

      {/* creative statement — deck block, adapted */}
      <section data-theme="light" className="px-5 py-[13vh] md:px-10">
        <div className="mx-auto max-w-3xl">
          <span className="bar-label">Creative statement</span>
          <h2 className="font-display mt-8 text-[clamp(1.9rem,1.1rem+2.2vw,3.1rem)] leading-[1.02] text-[var(--ink)]">
            Every film needs a story at its core, not just coverage.
          </h2>
          <div className="mt-8 max-w-2xl space-y-4">
            <p className="leading-relaxed text-[var(--ink)]/75">
              A film has to go beyond documenting what happened. We look for
              the relationship at the heart of it: person and machine, maker
              and craft, brand and the people who keep it alive. That&apos;s
              where the emotion is, and emotion is what people remember.
            </p>
            <p className="leading-relaxed text-[var(--ink)]/75">
              In every brief we chase three things: unfinished business, the
              discipline behind the result, and the legacy it earns. Get those
              right and the film holds its value for years.
            </p>
          </div>
        </div>
      </section>

      {/* how we work */}
      <section data-theme="light" className="px-5 pb-[12vh] md:px-10">
        <p className="label-mono mb-12 opacity-50">How we work</p>
        <div className="grid gap-px overflow-hidden rounded-lg bg-[var(--hairline-light)] md:grid-cols-4">
          {PROCESS.map(([n, title, body]) => (
            <div key={n} className="bg-[var(--cream)] p-8">
              <p className="label-mono mb-6 text-[var(--gold)]">{n}</p>
              <h3 className="font-display display-md text-[var(--ink)]">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--ink)]/70">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* pledge */}
      <section data-theme="dark" className="px-5 py-[14vh] text-center md:px-10">
        <p className="font-accent text-3xl text-[var(--gold)] md:text-4xl">
          — No corners should be cut to make this master piece. —
        </p>
        <Link
          href="/contact"
          className="label-mono mt-12 inline-block rounded-full border border-[var(--hairline-dark)] bg-[var(--tint-w)] px-10 py-5 backdrop-blur-sm transition-colors duration-500 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
        >
          Start a project
        </Link>
      </section>
    </main>
  );
}
