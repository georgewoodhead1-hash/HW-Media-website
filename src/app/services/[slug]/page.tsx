import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, SERVICES } from "@/content/services";
import { getProject } from "@/content/projects";
import FooterReveal from "@/components/shell/FooterReveal";
import { SITE_URL } from "@/content/site";
import { jsonLd } from "@/lib/jsonld";

// Service page (George: "click on it and it takes you to the editing grade
// page — just a little thing of the services we offer for that thing").
// Small and clean: bracketed title, the pitch, what you get, proof films.

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "What we do" };
  const desc = `${service.blurb.slice(0, 130).trimEnd()}… ${service.name} by HW Media, London.`;
  return {
    title: `${service.name} — Film Production Services, London`,
    description: desc,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { type: "website", siteName: "HW Media", title: `${service.name} — HW Media`, description: desc, url: `/services/${slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const proof = service.related.map((s) => getProject(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
      { "@type": "ListItem", position: 3, name: service.name, item: `${SITE_URL}/services/${service.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }}
      />
      <main data-theme="dark" data-surface="page" className="relative z-10 bg-[var(--bg)] text-[var(--fg)]">
        {/* header — the bracketed title over the service's ambient loop */}
        <section className="relative flex min-h-[62vh] items-center justify-center overflow-hidden px-5 md:px-10">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            src={service.clip}
            poster={service.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[var(--bg)]" />
          <div className="relative z-10 pt-[10vh] text-center">
            <h1 className="inline-block">
              <span
                className="blink font-display text-[clamp(1.9rem,4vw,3.4rem)] leading-none"
                style={{ fontFamily: "var(--font-suisse-cond), 'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.015em" }}
              >
                {service.name}
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-[46ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.6]">
              {service.blurb}
            </p>
          </div>
        </section>

        {/* what you get */}
        <section className="px-5 pb-[10vh] pt-[6vh] md:px-10">
          <p className="label-mono mb-6 text-center text-[10px] tracking-[0.24em] text-[var(--fg)]">WHAT YOU GET</p>
          <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-3">
            {service.deliverables.map((d) => (
              <li key={d} className="text-[15px] text-[var(--fg)]/85" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                {d}
              </li>
            ))}
          </ul>
        </section>

        {/* proof — the films that show it */}
        {proof.length > 0 && (
          <section className="px-5 pb-[8vh] md:px-10">
            <p className="label-mono mb-6 text-center text-[10px] tracking-[0.24em] text-[var(--fg)]">SEE IT IN THE WORK</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {proof.map((p) => (
                <Link key={p.slug} href={`/work/${p.slug}`} className="group relative block aspect-video overflow-hidden rounded-md bg-black" aria-label={p.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.posterWide} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" loading="lazy" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-[12px] uppercase tracking-[0.18em] text-white" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                    {p.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-[14vh] text-center">
          <Link href="/contact" className="blink text-[14px] tracking-[0.05em]">
            Start a project
          </Link>
        </section>
      </main>
      <FooterReveal />
    </>
  );
}
