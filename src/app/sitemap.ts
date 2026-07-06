import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { SERVICES } from "@/content/services";
import { SITE_URL } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const caseStudies: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // service pages carry the money keywords ("commercial video production
  // London" etc.) — priority just under the top-level pages
  const services: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...services,
    ...caseStudies,
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
