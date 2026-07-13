import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/shell/SmoothScroll";
import LoadingScreen from "@/components/shell/LoadingScreen";
import Nav from "@/components/shell/Nav";
import Grain from "@/components/shell/Grain";
import { jsonLd } from "@/lib/jsonld";
import Cursor from "@/components/shell/Cursor";
import RouteTransitions from "@/components/shell/RouteTransitions";
import { EMAIL, SITE_URL, SOCIALS } from "@/content/site";

// THE 3-FONT SYSTEM (George, 2026-07-02; display face corrected 2026-07-13).
// Nothing else loads.
// 1) DISPLAY — Inter with the opsz axis = Inter Display at heading sizes:
//    the EXACT face behind Stone Visuals' "Selected work" (their .display
//    voice — Inter 450, tight tracking, sentence case). NOT the gothic;
//    that is only their wordmark moments.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

// 2) MAIN — Suisse Int'l Medium (1820 Productions' main face). All UI, nav,
//    CTAs, labels, sub-headings. Kept on the legacy --font-firma variable so
//    every existing component flips without edits.
//    NOTE: Suisse Int'l is a commercial font (Swiss Typefaces) — pulled from
//    1820's CDN for the dev build; LICENCE BEFORE LAUNCH (same as BR Firma was).
const suisseMain = localFont({
  // the 1820 kit, corrected: their SMALL/UI face is Suisse Intl Medium at
  // REGULAR width with near-zero tracking (probe: -0.125px) — NOT condensed.
  src: "../fonts/SuisseIntl-Medium.woff2",
  variable: "--font-firma",
  weight: "500",
  display: "swap",
});

// Geist Mono — 1820's micro-label face (tiny technical labels only)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// 3) SUBTEXT — Suisse Int'l Book (1820's body face). Paragraphs and quiet text,
//    wired as the site-wide body default in globals.css.
const suisseBook = localFont({
  src: "../fonts/SuisseIntl-Book.woff2",
  variable: "--font-suisse-book",
  weight: "400",
  display: "swap",
});

// Suisse Int'l Condensed (Medium + SemiBold) — 1820's display cuts, loaded for
// the process rebuild / accents where the condensed voice is wanted.
const suisseCond = localFont({
  src: [
    { path: "../fonts/SuisseIntl-MediumCondensed.woff2", weight: "500" },
    { path: "../fonts/SuisseIntl-SemiBoldCondensed.woff2", weight: "600" },
  ],
  variable: "--font-suisse-cond",
  display: "swap",
});

const OG_IMAGE = "/images/hero-defocus.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HW Media — Film Production Company, London",
    template: "%s — HW Media",
  },
  description:
    "HW Media is a director-led film production company in London. Brand films, commercials and photography for McLaren, Nike, Aston Martin, Land Rover and more.",
  keywords: [
    "HW Media",
    "film production company London",
    "video production agency London",
    "brand films",
    "commercial video production",
    "automotive film production",
    "luxury brand videographer",
    "documentary film",
    "commercial photography",
    "director-led production",
    "Harry Wallis",
  ],
  authors: [{ name: "HW Media" }, { name: "Harry Wallis" }],
  creator: "HW Media",
  publisher: "HW Media",
  // NO global canonical here — a root-level `canonical: "/"` is inherited by
  // every page that doesn't override it, telling Google all 13 case pages ARE
  // the homepage (the audit's worst finding). Each page sets its own.
  openGraph: {
    type: "website",
    siteName: "HW Media",
    title: "HW Media — Film Production Company, London",
    description:
      "Director-led film production company in London. Brand films, commercials and photography for McLaren, Nike, Aston Martin and more.",
    url: SITE_URL,
    locale: "en_GB",
    images: [
      {
        url: OG_IMAGE,
        width: 1920,
        height: 1080,
        alt: "HW Media — Film & Photography, London",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HW Media — Film Production Company, London",
    description:
      "Director-led film production company in London. Brand films, commercials and photography for McLaren, Nike, Aston Martin and more.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Structured data — static, no user input. Organization (as a local
// professional service, so "film production company London" queries and AI
// answer engines get location + services), Person (Harry — the E-E-A-T
// expertise signal) and WebSite schema.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "HW Media",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/hwmedia-white.png`,
  image: `${SITE_URL}${OG_IMAGE}`,
  description:
    "Director-led film production company in London. Brand films, commercials, documentary and photography for McLaren, Nike, Aston Martin, Land Rover and more.",
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "City", name: "London" },
    { "@type": "Country", name: "United Kingdom" },
  ],
  knowsAbout: [
    "brand film production",
    "commercial video production",
    "automotive film production",
    "documentary filmmaking",
    "aerial cinematography",
    "commercial photography",
  ],
  founder: { "@id": `${SITE_URL}/#harry` },
  sameAs: [SOCIALS.instagram, SOCIALS.linkedin],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#harry`,
  name: "Harry Wallis",
  jobTitle: "Director & Cinematographer",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  description:
    "Director and cinematographer behind every HW Media film, and a CAA-authorised drone pilot — aerials stay in-house.",
  knowsAbout: ["film direction", "cinematography", "drone cinematography", "editing and colour grading"],
  sameAs: [SOCIALS.linkedin, SOCIALS.instagram],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HW Media",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-mode="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${suisseMain.variable} ${suisseBook.variable} ${suisseCond.variable} h-full antialiased`}
    >

      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[var(--fg)] focus:px-4 focus:py-2 focus:text-[var(--bg)]"
        >
          Skip to content
        </a>
        <LoadingScreen />
        <SmoothScroll>
          <Nav />
          {children}
          <Grain />
          <Cursor />
          <RouteTransitions />
        </SmoothScroll>
      </body>
    </html>
  );
}
