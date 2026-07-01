import type { Metadata } from "next";
import AboutClean from "@/components/about/AboutClean";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who's behind the camera. HW Media, a London director-led film and photography studio founded by Harry Wallis.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    siteName: "HW Media",
    title: "About — HW Media",
    description:
      "Who's behind the camera. HW Media, a London director-led film and photography studio founded by Harry Wallis.",
    url: "/about",
    images: [{ url: "/images/harry-color.jpg", width: 720, height: 900, alt: "Harry Wallis — HW Media" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — HW Media",
    description:
      "Who's behind the camera. HW Media, a London director-led film and photography studio founded by Harry Wallis.",
    images: ["/images/harry-color.jpg"],
  },
};

// About — rebuilt clean. Big type, one dimmed film, the crew stated plainly, the
// kept "Let's create". No labels / counters / icon clutter. "About us" intro beat.
export default function About() {
  return <AboutClean />;
}
