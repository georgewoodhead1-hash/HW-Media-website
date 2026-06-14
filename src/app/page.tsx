import LensIntro from "@/components/home/LensIntro";
import Mission from "@/components/home/Mission";
import TrustedBy from "@/components/home/TrustedBy";
import OurWork from "@/components/home/OurWork";
import EditorFCP from "@/components/home/EditorFCP";
import Testimonials from "@/components/home/Testimonials";
import FAQs from "@/components/home/FAQs";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// Rebuilding section by section. So far: hero (lens) → trusted by →
// footer. Mission, gallery, process and testimonials drop in between as
// each is designed and approved.
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
