import type { Metadata } from "next";
import { projects } from "@/content/projects";
import WorkCard from "@/components/work/WorkCard";

export const metadata: Metadata = {
  title: "The Collection — HW Media",
  description: "Brand films, documentary and commercial work by HW Media, London.",
};

// The full gallery, per the client call: a clean 3x3 grid, flush edge to
// edge. Five real films today; the remaining cells fill as Harry sends
// projects across.
export default function WorkIndex() {
  return (
    <main data-theme="dark" className="pb-[10vh] pt-28">
      <div className="mb-10 flex items-end justify-between px-5 md:px-10">
        <h1 className="font-display display-xl">
          The <span className="font-accent text-[var(--gold)]">collection.</span>
        </h1>
        <span className="label-mono opacity-50">[{String(projects.length).padStart(2, "0")}] films</span>
      </div>

      {/* flush 3x3 — no gutters, edge to edge */}
      <div className="grid grid-cols-1 gap-px bg-[var(--hairline-dark)] sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <div key={p.slug} className="bg-[var(--bg)]">
            <WorkCard project={p} index={i} flush />
          </div>
        ))}
      </div>
      <div className="flex h-[160px] items-center justify-center border-t border-[var(--hairline-dark)]">
        <span className="label-mono tracking-[0.3em] opacity-40">More soon — (02) in the edit</span>
      </div>
    </main>
  );
}
