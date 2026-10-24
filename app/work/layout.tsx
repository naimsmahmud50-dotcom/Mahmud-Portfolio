import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work & Engineering Archive — Mahmud Hasan",
  description:
    "Explore production-grade enterprise software, autonomous AI agent pipelines, mobile Flutter applications, and high-performance web platforms engineered by Mahmud Hasan.",
  openGraph: {
    title: "Work & Engineering Archive — Mahmud Hasan",
    description:
      "Explore production-grade enterprise software, autonomous AI agent pipelines, mobile Flutter applications, and high-performance web platforms engineered by Mahmud Hasan.",
    url: "https://mahmudhasan.dev/work",
    images: [
      {
        url: "/images/mahmud.jpg",
        width: 1200,
        height: 630,
        alt: "Mahmud Hasan Portfolio Work",
      },
    ],
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
