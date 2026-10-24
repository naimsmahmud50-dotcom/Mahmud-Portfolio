import type { Metadata } from "next";
import { getAboutContent, getSkillClusters, getExperiences } from "@/lib/data";
import AboutPageClient from "@/components/about/AboutPageClient";

export const revalidate = 5;

export const metadata: Metadata = {
  title: "About & Engineering Philosophy — Mahmud Hasan",
  description:
    "AI Automation Architect and Full-Stack Software Engineer based in Dhaka, Bangladesh. Explore background, skill matrix, and production milestones.",
};

export default async function AboutPage() {
  const [about, skillClusters, experiences] = await Promise.all([
    getAboutContent(),
    getSkillClusters(),
    getExperiences(),
  ]);

  return (
    <AboutPageClient
      about={about}
      skillClusters={skillClusters}
      experiences={experiences}
    />
  );
}
