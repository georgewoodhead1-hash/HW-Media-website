"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/content/projects";
import { safePlay } from "@/lib/video";

// Hover-to-play work card used on /work and "next project" links.
export default function WorkCard({
  project,
  index,
  large = false,
  flush = false,
}: {
  project: Project;
  index: number;
  large?: boolean;
  flush?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block"
      onMouseEnter={() => safePlay(videoRef.current)}
      onMouseLeave={() => videoRef.current?.pause()}
    >
      <div className={`on-media relative overflow-hidden ${flush ? "rounded-none aspect-[16/10]" : large ? "rounded-lg aspect-[16/8]" : "rounded-lg aspect-video"}`}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ transitionTimingFunction: "var(--ease-expo)" }}
          src={project.wide}
          poster={project.posterWide}
          muted
          loop
          playsInline
          preload="none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="label-mono absolute bottom-4 right-4 opacity-0 transition-opacity duration-500 group-hover:opacity-90">
          Watch film ⟶
        </span>
      </div>
      <div className={`flex items-baseline justify-between gap-6 ${flush ? "px-5 py-4" : "mt-3"}`}>
        <span className={`font-display leading-[1.05] ${large ? "display-md" : "text-xl md:text-2xl"}`}>
          {project.title}
        </span>
        <span className="label-mono shrink-0 whitespace-nowrap opacity-60">
          [{String(index + 1).padStart(2, "0")}] {project.category} · {project.year}
        </span>
      </div>
    </Link>
  );
}
