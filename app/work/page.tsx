import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import WorkPageClient from "@/components/work/WorkPageClient";

export const revalidate = 5;

export const metadata: Metadata = {
  title: "Work & Production Archive — Mahmud Hasan",
  description:
    "Explore the architectural catalog of AI automation systems, Next.js web applications, and Flutter Android platforms engineered by Mahmud Hasan.",
};

export default async function WorkPage() {
  const projects = await getProjects();
  return <WorkPageClient initialProjects={projects} />;
}
