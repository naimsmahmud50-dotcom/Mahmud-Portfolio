import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { ThemeProvider } from "@/components/ThemeToggle";
import { I18nProvider } from "@/lib/i18n";
import { TransitionProvider } from "@/context/TransitionContext";
import PageTransition from "@/components/PageTransition";

import { getSiteSettings } from "@/lib/data";

// Lazy-load heavy overlay widgets for maximum initial performance
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), {
  ssr: false,
});
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), {
  ssr: false,
});
const FloatingWhatsApp = dynamic(
  () => import("@/components/FloatingWhatsApp"),
  { ssr: false }
);

export const revalidate = 5;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const keywords = settings.seoKeywords
    ? settings.seoKeywords.split(",").map((s) => s.trim())
    : [
        "Mahmud Hasan",
        "AI Automation Expert",
        "Full-Stack Web Developer",
        "Android Developer",
        "Bangladesh",
      ];

  return {
    metadataBase: new URL("https://mahmudhasan.dev"),
    title: settings.title,
    description: settings.seoDescription,
    keywords,
    authors: [{ name: settings.name, url: "https://mahmudhasan.dev" }],
    creator: settings.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://mahmudhasan.dev",
      title: settings.title,
      description: settings.tagline,
      siteName: `${settings.name} Portfolio`,
      images: [
        {
          url: settings.ogImageUrl || "/images/mahmud.jpg",
          width: 1200,
          height: 630,
          alt: settings.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.title,
      description: settings.tagline,
      images: [settings.ogImageUrl || "/images/mahmud.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    url: "https://mahmudhasan.dev",
    image: `https://mahmudhasan.dev${settings.ogImageUrl || "/images/mahmud.jpg"}`,
    sameAs: [
      settings.github,
      settings.linkedin,
      settings.whatsapp,
      settings.telegram,
    ].filter(Boolean),
    jobTitle: "AI Automation Architect & Full-Stack Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.location?.split(",")[0] || "Dhaka",
      addressCountry: "BD",
    },
    knowsAbout: [
      "AI Automation",
      "Autonomous Agents",
      "Next.js",
      "Flutter",
      "NestJS",
      "PostgreSQL",
      "TypeScript",
      "Meta Automation",
    ],
  };

  return (
    <html lang="en" className="dark" data-theme="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Anti-Flash Theme & Locale Initialization Script (Guarantees Zero Flash) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mahmud_theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.remove('dark');}else{document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}var l=localStorage.getItem('mahmud_portfolio_lang');if(l==='bn'){document.documentElement.setAttribute('lang','bn');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground relative selection:bg-accent selection:text-black"
      >
        {/* Accessible Skip-to-Content Link for Screen Readers & Keyboard Users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999999] focus:px-5 focus:py-2.5 focus:bg-accent focus:text-accent-ink focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:rounded-full focus:shadow-2xl"
        >
          Skip to main content
        </a>

        <ThemeProvider>
          <I18nProvider>
            <TransitionProvider>
              {/* Film Grain Noise Texture */}
              <div className="noise-overlay" aria-hidden="true" />

              {/* Dennis Snellenberg Liquid Page Transition Curtain */}
              <PageTransition />

              {/* Custom Trailing Spring Cursor */}
              <CustomCursor />

              {/* Multilingual Preloader */}
              <Preloader />

              {/* Easter Egg Command Palette (Press K or Cmd/Ctrl+K) */}
              <CommandPalette />

              {/* Smooth Lenis Inertial Scroll Wrapper */}
              <SmoothScroll>
                {/* Editorial Header & Fullscreen Navigation */}
                <Header settings={settings} />

                {/* Main Content Viewport */}
                <main id="main-content" className="min-h-screen relative">{children}</main>

                {/* Global Footer with Dhaka Time & Curved Edge */}
                <Footer settings={settings} />
              </SmoothScroll>

              {/* Autonomous AI Chat Assistant ("Ask about Mahmud") */}
              <ChatWidget />

              {/* Floating WhatsApp CTA (bottom-left, opposite the AI chat) */}
              <FloatingWhatsApp phone={settings.phone || "+8801767850859"} />
            </TransitionProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
