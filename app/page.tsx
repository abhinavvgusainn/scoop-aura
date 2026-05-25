import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import Marquees from "@/components/home/Marquees";
import Process from "@/components/home/Process";
import Reviews from "@/components/home/Reviews";
import Scoops from "@/components/home/Scoops";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Marquees />
      <Scoops />
      <Process />
      <Reviews />
      <Footer />
    </div>
  );
}
