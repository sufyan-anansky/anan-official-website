import { Hero } from "@/components/sections/hero/hero";
import { About } from "@/components/sections/about/about";
import { Achievements } from "@/components/sections/achievements";
import { Contact } from "@/components/sections/contact/contact";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Faq } from "@/components/sections/faq/faq";
import { Features } from "@/components/sections/features/features";
import { HowWeWork } from "@/components/sections/how-we-work/how-we-work";
import { Services } from "@/components/sections/services/services";
import { VisionMission } from "@/components/sections/vision-mission";
import { WhoWeServe } from "@/components/sections/who-we-serve";
import { OurValues } from "@/components/sections/our-values";
import { ExperienceProjects } from "@/components/sections/experience-projects";

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-dvh bg-transparent">
      <Hero />
      <About />
      <VisionMission />
      <Achievements />
      <WhoWeServe />
      <OurValues />
      <Services />
      <ExperienceProjects />
      <Features />
      <HowWeWork />
      <Faq />
      <Contact />
      <ClosingCta />
    </main>
  );
}
