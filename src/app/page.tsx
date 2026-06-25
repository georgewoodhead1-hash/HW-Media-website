import LensIntro from "@/components/home/LensIntro";
import Mission from "@/components/home/Mission";
import StatsBlock from "@/components/home/StatsBlock";
import TrustedBy from "@/components/home/TrustedBy";
import OurWork from "@/components/home/OurWork";
import EditorFCP from "@/components/home/EditorFCP";
import Testimonials from "@/components/home/Testimonials";
import LetsCreate from "@/components/home/LetsCreate";
import FAQs from "@/components/home/FAQs";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";
import SceneFlow from "@/components/shell/SceneFlow";

// Order: hero → mission → trusted by → our work → process → reviews → FAQ →
// finale. "Every film is a chance to break the ordinary" is the finale AND
// the footer — it always lives at the very bottom and never moves.
export default function Home() {
  return (
    <main>
      <SceneFlow />
      <LensIntro />
      <Mission />
      <StatsBlock />
      <TrustedBy />
      <OurWork />
      <EditorFCP />
      <Testimonials />
      <LetsCreate />
      <FAQs />
      <WhirlwindGallery />
    </main>
  );
}
