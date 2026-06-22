import LensIntro from "@/components/home/LensIntro";
import Mission from "@/components/home/Mission";
import TrustedBy from "@/components/home/TrustedBy";
import OurWork from "@/components/home/OurWork";
import EditorFCP from "@/components/home/EditorFCP";
import Testimonials from "@/components/home/Testimonials";
import FAQs from "@/components/home/FAQs";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// Order: hero → mission → trusted by → our work → process → reviews → FAQ →
// finale. "Every film is a chance to break the ordinary" is the finale AND
// the footer — it always lives at the very bottom and never moves.
export default function Home() {
  return (
    <main>
      <LensIntro />
      <Mission />
      <TrustedBy />
      <OurWork />
      <EditorFCP />
      <Testimonials />
      <FAQs />
      <WhirlwindGallery />
    </main>
  );
}
