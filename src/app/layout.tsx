import type { Metadata } from "next";
import {
  Archivo,
  Dancing_Script,
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

export const metadata: Metadata = {
  title: "HW Media — Cinematic Brand Storytelling",
  description:
    "Films for brands with a story worth telling. Brand films, documentary and photography. HW Media, London.",
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
      className={`${archivo.variable} ${instrument.variable} ${hanken.variable} ${plexMono.variable} ${caveat.variable} ${firma.variable} h-full antialiased`}
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
