import type { Metadata } from "next";
import AboutReel from "@/components/about/reel/AboutReel";

export const metadata: Metadata = {
  title: "HW Media — The crew (Version 2: The Reel)",
  description: "Break the ordinary. HW Media, a London creative agency and production company, on film.",
};

// Version 2 of the rebuilt About page — "The Reel" (cinematic full-bleed).
export default function AboutVersionTwo() {
  return <AboutReel />;
}
