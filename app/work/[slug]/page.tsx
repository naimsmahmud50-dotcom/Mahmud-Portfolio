import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjects, getProjectBySlug } from "@/lib/data";
import ProjectDetailView from "@/components/work/ProjectDetailView";

export const revalidate = 5;

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found — Mahmud Hasan" };

  return {
    title: `${project.title} — Case Study by Mahmud Hasan`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — Case Study by Mahmud Hasan`,
      description: project.summary,
      images: [{ url: project.coverImage || project.cover }],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const projects = await getProjects();
  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  if (currentIndex === -1) {
    notFound();
  }

  const project = projects[currentIndex];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return <ProjectDetailView project={project} nextProject={nextProject} />;
}
