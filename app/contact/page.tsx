import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const revalidate = 5;

export const metadata: Metadata = {
  title: "Contact & Collaboration — Mahmud Hasan",
  description:
    "Initiate collaboration with Mahmud Hasan. Reach out for AI automation systems, fullstack web applications, and Android engineering.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactPageClient settings={settings} />;
}
