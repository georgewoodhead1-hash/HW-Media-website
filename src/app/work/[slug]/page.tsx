import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import WorkCard from "@/components/work/WorkCard";

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
    <main data-theme="dark">
      {/* film hero */}
      <section className="relative h-[86vh] overflow-hidden">
        <video
          className="h-full w-full object-cover"
          src={project.wide}
          poster={project.posterWide}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10">
          <h1 className="font-display display-xl">{project.title}</h1>
        </div>
      </section>

      {/* meta block */}
      <section className="grid gap-6 border-b border-[var(--hairline-dark)] px-5 py-10 md:grid-cols-4 md:px-10">
        {[
          ["Client", project.client],
          ["Category", project.category],
          ["Year", project.year],
          ["Role", "Direction · Cinematography"],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="label-mono mb-2 opacity-40">{k}</p>
            <p className="text-lg">{v}</p>
          </div>
        ))}
      </section>

      {/* story */}
      <section className="grid gap-10 px-5 py-[10vh] md:grid-cols-[1fr_2fr] md:px-10">
        <p className="label-mono opacity-40">The story</p>
        <div>
          <p className="max-w-2xl text-2xl leading-snug md:text-3xl">{project.story}</p>
          <p className="font-accent mt-10 text-2xl text-[var(--gold)] md:text-3xl">
            — The whole is greater than the sum of its parts. —
          </p>
          <ul className="label-mono mt-12 flex flex-wrap gap-x-8 gap-y-3 opacity-70">
            {project.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* credits */}
      <section className="border-t border-[var(--hairline-dark)] px-5 py-[8vh] md:px-10">
        <p className="label-mono mb-8 opacity-40">Credits</p>
        <div className="grid gap-4 md:grid-cols-2 md:gap-x-20">
          {project.credits.map((c) => (
            <div key={c.role} className="flex justify-between border-b border-[var(--hairline-dark)] pb-3">
              <span className="label-mono opacity-60">{c.role}</span>
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* next project */}
      <section className="px-5 py-[10vh] md:px-10">
        <p className="label-mono mb-8 opacity-40">Next project</p>
        <WorkCard project={next} index={(idx + 1) % projects.length} large />
      </section>
    </main>
  );
}
