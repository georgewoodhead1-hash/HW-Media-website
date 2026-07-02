import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/shell/SmoothScroll";
import LoadingScreen from "@/components/shell/LoadingScreen";
import Nav from "@/components/shell/Nav";
import Grain from "@/components/shell/Grain";
import Cursor from "@/components/shell/Cursor";
import RouteTransitions from "@/components/shell/RouteTransitions";

// THE 3-FONT SYSTEM (George, 2026-07-02). Nothing else loads.
// 1) DISPLAY — Archivo Expanded (the "TELL US MORE" face). Big headings only.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// 2) MAIN — Suisse Int'l Medium (1820 Productions' main face). All UI, nav,
//    CTAs, labels, sub-headings. Kept on the legacy --font-firma variable so
//    every existing component flips without edits.
//    NOTE: Suisse Int'l is a commercial font (Swiss Typefaces) — pulled from
//    1820's CDN for the dev build; LICENCE BEFORE LAUNCH (same as BR Firma was).
const suisseMain = localFont({
  src: "../fonts/SuisseIntl-Medium.woff2",
  variable: "--font-firma",
  weight: "500",
  display: "swap",
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

const SITE_URL = "https://hw-media-website-5pbo.vercel.app";
const OG_IMAGE = "/images/hero-defocus.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HW Media — Film & Photography, London",
    template: "%s — HW Media",
  },
  description:
    "HW Media is a London director-led film and photography studio. Cinematic brand films, documentary and photography for brands with a story worth telling.",
  keywords: [
    "HW Media",
    "London film studio",
    "brand films",
    "film production London",
    "video production",
    "documentary film",
    "commercial photography",
    "director-led production",
    "cinematic brand storytelling",
    "Harry Wallis",
  ],
  authors: [{ name: "HW Media" }, { name: "Harry Wallis" }],
  creator: "HW Media",
  publisher: "HW Media",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "HW Media",
    title: "HW Media — Film & Photography, London",
    description:
      "London director-led film and photography studio. Cinematic brand films, documentary and photography.",
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
    title: "HW Media — Film & Photography, London",
    description:
      "London director-led film and photography studio. Cinematic brand films, documentary and photography.",
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

// Structured data — static, no user input. Organization + WebSite schema so
// search engines and AI crawlers understand who HW Media is.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HW Media",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/hwmedia-white.png`,
  image: `${SITE_URL}${OG_IMAGE}`,
  description:
    "London director-led film and photography studio. Cinematic brand films, documentary and photography.",
  email: "harry@hwmedia.co.uk",
  areaServed: "London",
  founder: {
    "@type": "Person",
    name: "Harry Wallis",
  },
  sameAs: [
    "https://instagram.com/hwmedia",
    "https://www.linkedin.com/in/harry-wallis-98b47b161/",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HW Media",
  url: SITE_URL,
  publisher: {
    "@type": "Organization",
    name: "HW Media",
  },
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
      className={`${archivo.variable} ${suisseMain.variable} ${suisseBook.variable} ${suisseCond.variable} h-full antialiased`}
    >

      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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
