import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import Footer from "@/components/shell/Footer";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? `${project.title} — HW Media` : "Work — HW Media",
    description: project?.story,
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

  return (
    <>
      <main data-theme="dark" data-surface="page" className="bg-[var(--bg)] text-[var(--fg)]">
        <section className="px-5 pt-[16vh] md:px-10">
          <Link href="/work" className="label-mono text-[11px] tracking-[0.24em] opacity-60 transition-colors hover:text-[var(--gold-text)]">
            ← ALL WORK
          </Link>
          <h1 className="font-display mt-6 text-[clamp(2.6rem,7vw,6rem)] leading-[0.9]" style={{ fontWeight: 400 }}>
            {project.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--fg)]/70">{project.tagline}</p>
        </section>

        {/* the film — Vimeo embed slot (local master as placeholder) */}
        <section className="px-5 py-[6vh] md:px-10">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
            <video
              className="h-full w-full object-cover"
              src={project.wide}
              poster={project.posterWide}
              controls
              playsInline
              muted
              loop
              preload="none"
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
                <p className="label-mono text-[10px] tracking-[0.24em] opacity-45">{k}</p>
                <p className="mt-1 text-lg">{v}</p>
              </div>
            ))}
            <div>
              <p className="label-mono text-[10px] tracking-[0.24em] opacity-45">Services</p>
              <ul className="mt-2 space-y-1">
                {project.services.map((s) => (
                  <li key={s} className="text-[var(--fg)]/80">{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="label-mono text-[10px] tracking-[0.24em] opacity-45">The brief</p>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed md:text-2xl">{project.story}</p>
          </div>
        </section>

        {/* next */}
        <section className="border-t border-[var(--hairline-dark)] px-5 py-[8vh] md:px-10">
          <p className="label-mono mb-4 text-[10px] tracking-[0.24em] opacity-45">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-none transition-colors hover:text-[var(--gold-text)]"
            style={{ fontWeight: 400 }}
          >
            {next.title} ⟶
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
