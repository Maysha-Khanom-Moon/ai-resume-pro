import CTA from "@/components/CTA";
import FindCandidates from "@/components/FindCandidates";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import MatchCard from "@/components/MatchCard";
import { ModeToggle } from "@/components/ModeToggle";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <div className="bg-black">
      <Navbar />
      <Hero />
      <MatchCard />
      <Stats />
      <HowItWorks />
      <FindCandidates />
      <CTA />
      <Footer />
    </div>
  )
}