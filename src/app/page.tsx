import LensIntro from "@/components/home/LensIntro";
import Mission from "@/components/home/Mission";
import TrustedBy from "@/components/home/TrustedBy";
import OurWork from "@/components/home/OurWork";
import EditorFCP from "@/components/home/EditorFCP";
import Testimonials from "@/components/home/Testimonials";
import FAQs from "@/components/home/FAQs";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";
import Footer from "@/components/shell/Footer";

// Order (client feedback): hero → mission → trusted by → our work → process →
// reviews → "Get in touch" finale → FAQ → footer. FAQ now sits BELOW the
// finale, and the footer is the shared site-wide one.
export default function Home() {
  return (
    <main>
      <LensIntro />
      <Mission />
      <TrustedBy />
      <OurWork />
      <EditorFCP />
      <Testimonials />
      <WhirlwindGallery />
      <FAQs />
      <Footer />
    </main>
  );
}
