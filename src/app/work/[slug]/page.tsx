import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import FooterReveal from "@/components/shell/FooterReveal";
import PageBuild from "@/components/shell/PageBuild";
import { SITE_URL } from "@/content/site";
import { jsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// SERP description: the tagline (already a one-line pitch) padded with the
// client + category so it lands in the 120–160 char sweet spot.
const serpDescription = (p: (typeof projects)[number]) => {
  const base = `${p.tagline} A ${p.category.toLowerCase()} by HW Media, the director-led film production company in London.`;
  return base.length > 158 ? `${base.slice(0, 155).trimEnd()}…` : base;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Work" };
  return {
    title: `${project.title} — ${project.category} for ${project.client}`,
    description: serpDescription(project),
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "video.other",
      siteName: "HW Media",
      title: `${project.title} — ${project.category} — HW Media`,
      description: serpDescription(project),
      url: `/work/${slug}`,
      images: [{ url: project.posterWide, width: 1280, height: 720, alt: `${project.title} — ${project.category} by HW Media` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${project.category} — HW Media`,
      description: serpDescription(project),
      images: [project.posterWide],
    },
  };
}

// Project page, Aussie "Audi page" model (client feedback): title, the film
// (Vimeo embed slot — local master as placeholder until Vimeo links land),
// then client / date / discipline / services and the brief. Shared footer.
export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  // VideoObject — lets Google/AI surface the film itself in video results —
  // and BreadcrumbList so case pages sit under Work in the SERP trail.
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${project.title} — ${project.category} for ${project.client}`,
    description: project.story,
    thumbnailUrl: `${SITE_URL}${project.posterWide}`,
    contentUrl: `${SITE_URL}${project.wide}`,
    uploadDate: `${project.year}-01-01`,
    creator: { "@id": `${SITE_URL}/#organization` },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
      { "@type": "ListItem", position: 3, name: project.title, item: `${SITE_URL}/work/${project.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(videoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }}
      />
      <main data-theme="dark" data-surface="page" className="relative z-10 bg-[var(--bg)] text-[var(--fg)]">
        <PageBuild />
        <section className="px-5 pt-[16vh] md:px-10">
          <Link href="/work" className="blink text-[12px] tracking-[0.05em]">
            All work
          </Link>
          <h1 className="font-display mt-6 text-[clamp(2.6rem,7vw,6rem)] leading-[0.9]" style={{ fontWeight: 400 }}>
            {project.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--fg)]/70">{project.tagline}</p>
        </section>

        {/* the film — plays like every other film on the site: auto, silent,
            no default browser chrome (polish review: the flagship film sat
            paused behind a stock Chromium player). Vimeo embed slot later. */}
        <section className="px-5 py-[6vh] md:px-10">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
            <video
              className="h-full w-full object-cover"
              src={project.wide}
              poster={project.posterWide}
              autoPlay
              playsInline
              muted
              loop
              preload="metadata"
            />
          </div>
        </section>

        {/* meta + brief */}
        <section className="grid gap-10 px-5 pb-[8vh] md:grid-cols-[1fr_2fr] md:px-10">
          <div className="space-y-6">
            {([
              ["Client", project.client],
              ["Date", project.year],
              ["Discipline", project.category],
            ] as const).map(([k, v]) => (
              <div key={k}>
                <p className="label-mono text-[10px] tracking-[0.24em] text-[var(--fg)]">{k}</p>
                <p className="mt-1 text-lg">{v}</p>
              </div>
            ))}
            <div>
              <p className="label-mono text-[10px] tracking-[0.24em] text-[var(--fg)]">Services</p>
              <ul className="mt-2 space-y-1">
                {project.services.map((s) => (
                  <li key={s} className="text-[var(--fg)]/80">{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="label-mono text-[10px] tracking-[0.24em] text-[var(--fg)]">The brief</p>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed md:text-2xl">{project.story}</p>
          </div>
        </section>

        {/* next */}
        <section className="border-t border-[var(--hairline-dark)] px-5 py-[8vh] md:px-10">
          <p className="label-mono mb-4 text-[10px] tracking-[0.24em] text-[var(--fg)]">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-none transition-colors hover:text-[var(--gold-text)]"
            style={{ fontWeight: 400 }}
          >
            {next.title}
          </Link>
        </section>
      </main>
      <FooterReveal />
    </>
  );
}
