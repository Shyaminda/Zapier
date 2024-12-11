import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";

export default function Home() {
  return (
    <div className="pb-48">
      <Appbar />
      <Hero />
      <div className="pt-8">
        <HeroVideo />
      </div>
    </div>
  );
}
