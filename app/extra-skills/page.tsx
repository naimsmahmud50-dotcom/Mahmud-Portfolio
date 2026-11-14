import type { Metadata } from "next";
import { getExtraSkillVideos, getSiteSettings } from "@/lib/data";
import ExtraSkillsClient from "@/components/extra-skills/ExtraSkillsClient";

export const revalidate = 5;

export const metadata: Metadata = {
  title: "Extra Skills & AI Video Generation — Mahmud Hasan",
  description:
    "Explore Mahmud Hasan's multidisciplinary creative lab featuring autonomous AI video generation, commercial SaaS launch ads, viral faceless reels, and 3D concept cinematics.",
};

export default async function ExtraSkillsPage() {
  const [videos, settings] = await Promise.all([
    getExtraSkillVideos(),
    getSiteSettings(),
  ]);

  return <ExtraSkillsClient initialVideos={videos} settings={settings} />;
}
