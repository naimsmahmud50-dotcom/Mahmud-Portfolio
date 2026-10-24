import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesAccordion from "@/components/home/ServicesAccordion";
import {
  getHeroContent,
  getSiteSettings,
  getProjects,
  getAboutContent,
  getServices,
} from "@/lib/data";

export const revalidate = 5;

export default async function Home() {
  const [hero, settings, projects, about, services] = await Promise.all([
    getHeroContent(),
    getSiteSettings(),
    getProjects(),
    getAboutContent(),
    getServices(),
  ]);

  return (
    <>
      {/* 1. HERO: Huge name parallax, mask letter stagger, 2-column positioning, circular About me button */}
      <Hero hero={hero} settings={settings} />

      {/* 2. RECENT WORK LIST: full-width rows, sibling dimming, vertical stacked slider preview modal */}
      <FeaturedProjects projects={projects} />

      {/* 3. ABOUT TEASER: word-by-word scroll scrub opacity, photo parallax, rotating circular text badge */}
      <AboutPreview about={about} />

      {/* 4. SERVICES: 6 expandable capability rows with deliverables and smooth micro-interactions */}
      <ServicesAccordion services={services} />
    </>
  );
}

