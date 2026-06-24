import Footer from "@/components/shell/Footer";
import AboutHero from "@/components/about/AboutHero";
import Founder from "@/components/about/Founder";
import HowWeWork from "@/components/about/HowWeWork";
import LetsCreate from "@/components/about/LetsCreate";

// About — clean editorial (Bar Studios) animated with Luke-grade scroll motion.
// A big "ABOUT" open, Harry first (the person behind the creative media company),
// then how we operate, then a dynamic "Let's create" close. One light surface
// the whole way down, every block revealing as you reach it so it reads as one
// continuous, linked animation. Archivo stands in for Owners Wide.

export default function About() {
  return (
    <>
      <main className="about-body bg-[var(--bg)] text-[var(--fg)]">
        <AboutHero />
        <Founder />
        <HowWeWork />
        <LetsCreate />
      </main>
      <Footer />
    </>
  );
}
