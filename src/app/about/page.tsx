import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

const DESC =
  "Who's behind the camera. HW Media is a director-led film and photography agency in London founded by Harry Wallis — every film directed, shot and graded in-house.";

export const metadata: Metadata = {
  title: "About — Director-Led Film Production, London",
  description: DESC,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    siteName: "HW Media",
    title: "About — HW Media",
    description: DESC,
    url: "/about",
    images: [{ url: "/images/harry-color.jpg", width: 720, height: 900, alt: "Harry Wallis — HW Media" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — HW Media",
    description: DESC,
    images: ["/images/harry-color.jpg"],
  },
};

// About — rebuilt clean. Big type, one dimmed film, the crew stated plainly, the
// kept "Let's create". No labels / counters / icon clutter. "About us" intro beat.
export default function About() {
  return <AboutPage />;
}
