import type { Metadata } from "next";
import AboutClean from "@/components/about/AboutClean";
import SiteIntro from "@/components/shell/SiteIntro";

export const metadata: Metadata = {
  title: "About — HW Media",
  description: "Who's behind the camera. HW Media, a London creative agency and production company.",
};

// About — rebuilt clean. Big type, one dimmed film, the crew stated plainly, the
// kept "Let's create". No labels / counters / icon clutter. "About us" intro beat.
export default function About() {
  return (
    <>
      <SiteIntro words={["About", "us"]} />
      <AboutClean />
    </>
  );
}
