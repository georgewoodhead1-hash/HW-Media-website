import type { Metadata } from "next";
import {
  Archivo,
  Dancing_Script,
  Geist,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  Instrument_Serif,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/shell/SmoothScroll";
import LoadingScreen from "@/components/shell/LoadingScreen";
import Nav from "@/components/shell/Nav";
import Grain from "@/components/shell/Grain";
import Cursor from "@/components/shell/Cursor";
import ThemeToggle from "@/components/shell/ThemeToggle";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Geist — the clean grotesque 1820 Productions serves (free / OFL). Adopted as
// the body/UI face to match their font style. (Their display face is the paid
// Suisse Int'l Condensed; buy a licence if an exact match is wanted later.)
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const hanken = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const caveat = Dancing_Script({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "600",
});

// BR Firma SemiBold — the ACTUAL auteurstudios font, pulled from their CDN.
// On auteur this is the face on "Get in touch" and "PIONEERS IN BRAND
// STORYTELLING" (verified: computed font-family "BR Firma", weight 600). Used
// for every CTA / label / subtext here, exactly as auteur uses it, via
// --font-firma. NOTE: BR Firma is a licensed commercial font — buy a licence
// before launch.
const firma = localFont({
  src: "../fonts/BRFirma-SemiBold.otf",
  variable: "--font-firma",
  weight: "600",
  display: "swap",
});

const SITE_URL = "https://hw-media-website-y7yi.vercel.app";
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
      className={`${archivo.variable} ${geist.variable} ${instrument.variable} ${hanken.variable} ${plexMono.variable} ${caveat.variable} ${firma.variable} h-full antialiased`}
    >
      <head>
        {/* restore the saved mode before first paint — no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('hwm-mode-v2');if(m==='light'||m==='dark')document.documentElement.dataset.mode=m}catch(e){}",
          }}
        />
      </head>
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
          <ThemeToggle />
        </SmoothScroll>
      </body>
    </html>
  );
}
