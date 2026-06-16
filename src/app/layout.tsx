import type { Metadata } from "next";
import {
  Archivo,
  Caveat,
  DM_Sans,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/shell/SmoothScroll";
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

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "600",
});

// Studiogram's font — used for the Mission section to match it exactly.
const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      className={`${archivo.variable} ${instrument.variable} ${hanken.variable} ${plexMono.variable} ${caveat.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        {/* restore the saved mode before first paint — no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('hwm-mode');if(m==='light'||m==='dark')document.documentElement.dataset.mode=m}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full">
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
