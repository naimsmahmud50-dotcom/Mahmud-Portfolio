import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { buildWhatsAppUrl, buildTelegramUrl } from "./contact-links";

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================

export interface SiteSettingsData {
  id: string;
  name: string;
  title: string;
  tagline: string;
  location: string;
  timeZone: string;
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  github: string;
  linkedin: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  socials: Array<{ label: string; href: string }>;
}

export interface HeroData {
  id: string;
  badgeEn: string;
  badgeBn: string;
  name: string;
  dash: string;
  introEn: string;
  introBn: string;
  positioningEn: string;
  positioningBn: string;
  availableBadgeEn: string;
  availableBadgeBn: string;
  roles: string[];
}

export interface AboutData {
  id: string;
  heroHeadlineEn: string;
  heroHeadlineBn: string;
  storyP1En: string;
  storyP1Bn: string;
  storyP2En: string;
  storyP2Bn: string;
  storyP3En: string;
  storyP3Bn: string;
  avatarUrl: string;
  cvUrl: string;
  locationEn: string;
  locationBn: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level?: string | null;
  featured: boolean;
  order: number;
}

export interface SkillCluster {
  category: string;
  iconName: string;
  count: string;
  description: string;
  skills: string[];
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  category: "web" | "android" | "ai";
  filterCategory: "all" | "web" | "android" | "automation";
  summary: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  highlights: string[];
  role: string;
  status: string;
  metrics: string;
  coverImage: string;
  cover: string; // backwards compatibility alias for coverImage
  mockupType: "browser" | "mobile" | "terminal";
  demoUrl?: string | null;
  githubUrl?: string | null;
  link: string; // backwards compatibility alias for githubUrl/demoUrl
  featured: boolean;
  order: number;
}

export interface ServiceData {
  id: string;
  num: string;
  title: string;
  titleEn: string;
  titleBn: string;
  tagline?: string;
  description: string;
  descriptionEn: string;
  descriptionBn: string;
  deliverables: string[];
  icon: string;
  githubRepos?: Array<{ name: string; url: string; badge: string }>;
  caseStudySlug?: string;
  order: number;
}

export interface TestimonialData {
  id: string;
  author: string;
  role: string;
  company: string;
  badge: string;
  quoteEn: string;
  quoteBn: string;
  quote: string;
  avatarUrl?: string | null;
  order: number;
}

export interface ExperienceData {
  id: string;
  period: string;
  year: string;
  roleEn: string;
  roleBn: string;
  company: string;
  phase: string;
  title: string;
  location: string;
  descriptionEn: string;
  descriptionBn: string;
  detail: string;
  technologies: string[];
  order: number;
}

// ============================================================================
// 2. SAFE FALLBACK DEFAULTS (Guarantees zero crashes if DB is unreachable)
// ============================================================================

export const defaultSiteSettings: SiteSettingsData = {
  id: "default",
  name: "Mahmud Hasan",
  title: "Mahmud Hasan — AI Automation & Full-Stack Architect",
  tagline: "Architecting intelligent automation systems and high-craft digital products that scale autonomously.",
  location: "Dhaka, Bangladesh",
  timeZone: "Asia/Dhaka",
  email: "mahmudhasan.infodev@gmail.com",
  phone: "+880 1767-850859",
  whatsapp: "https://wa.me/8801767850859",
  telegram: "https://t.me/naimsmahmud50",
  github: "https://github.com/naimsmahmud50-dotcom",
  linkedin: "https://www.linkedin.com/in/mahmud-hasan-687908269?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  seoDescription: "Portfolio of Mahmud Hasan. Specializing in AI Automation, Autonomous Agent Systems, Full-Stack Next.js Web Applications, and Flutter Android Development.",
  seoKeywords: "Mahmud Hasan, AI Automation, Full-Stack Web Developer, Android Developer, Next.js, Flutter, NestJS, Bangladesh",
  ogImageUrl: "/images/mahmud.jpg",
  socials: [
    { label: "GitHub", href: "https://github.com/naimsmahmud50-dotcom" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mahmud-hasan-687908269?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
    { label: "WhatsApp", href: "https://wa.me/8801767850859" },
    { label: "Telegram", href: "https://t.me/naimsmahmud50" },
  ],
};

export const defaultHero: HeroData = {
  id: "default",
  badgeEn: "AI Automation Expert & Developer",
  badgeBn: "এআই অটোমেশন বিশেষজ্ঞ ও ডেভেলপার",
  name: "Mahmud Hasan",
  dash: "—",
  introEn: "Dedicated to crafting exceptional digital products with uncompromising performance, fluid interaction design, and self-operating AI pipelines.",
  introBn: "আপসহীন পারফরম্যান্স, সাবলীল ইন্টারঅ্যাকশন ডিজাইন এবং স্বয়ংক্রিয় এআই পাইপলাইনের সমন্বয়ে উন্নতমানের ডিজিটাল পণ্য তৈরিতে নিবেদিত।",
  positioningEn: "Based in Dhaka, Bangladesh — architecting intelligent autonomous workflows, full-stack web platforms & mobile ecosystems.",
  positioningBn: "ঢাকা, বাংলাদেশভিত্তিক — বুদ্ধিমত্তা সম্পন্ন স্বায়ত্তশাসিত ওয়ার্কফ্লো, ফুল-স্ট্যাক ওয়েব প্ল্যাটফর্ম ও মোবাইল ইকোসিস্টেম নির্মাতা।",
  availableBadgeEn: "Available for Q4/2026 Collaboration",
  availableBadgeBn: "কিউ৪/২০২৬ যৌথ কাজের জন্য উপলব্ধ",
  roles: [
    "AI Automation Architecture",
    "Full-Stack Web Engineering",
    "Android App Development",
    "Autonomous Agent Systems",
  ],
};

export const defaultAbout: AboutData = {
  id: "default",
  heroHeadlineEn: "Architecting autonomous pipelines & high-craft digital tools from Bangladesh—",
  heroHeadlineBn: "স্বায়ত্তশাসিত এআই পাইপলাইন ও উচ্চমানের ডিজিটাল সিস্টেমের রূপকার—",
  storyP1En: "I am an AI Automation Architect and Full-Stack Software Engineer based in Dhaka, Bangladesh. I bridge the divide between bleeding-edge machine intelligence and surgical web performance.",
  storyP1Bn: "আমি মাহমুদ হাসান, ঢাকা, বাংলাদেশভিত্তিক একজন এআই অটোমেশন আর্কিটেক্ট ও ফুল-স্ট্যাক সফটওয়্যার ইঞ্জিনিয়ার। অত্যাধুনিক কৃত্রিম বুদ্ধিমত্তা ও নিখুঁত ওয়েব পারফরম্যান্সের মেলবন্ধন তৈরি করাই আমার মূল লক্ষ্য।",
  storyP2En: "My engineering philosophy is rooted in self-operating workflows and uncompromising tactile polish. From enterprise madrasah platforms serving thousands to sub-50ms security interceptors, I construct systems that thrive under high real-world demand.",
  storyP2Bn: "স্বয়ংক্রিয় কাজের ধারা এবং অত্যন্ত মসৃণ ইউজার এক্সপেরিয়েন্স আমার কাজের মূল ভিত্তি। হাজারো ব্যবহারকারীর মাদরাসা ম্যানেজমেন্ট সিস্টেম থেকে শুরু করে ৫০ মিলিসেকেন্ডের এন্ডপয়েন্ট সিকিউরিটি ডেমোন—বাস্তব পৃথিবীর কঠিনতম চাহিদা পূরণেই আমার আনন্দ।",
  storyP3En: "Beyond production code, I actively engineer tools tailored for the local and global market, ensuring businesses scale autonomously without unnecessary operational bottlenecks.",
  storyP3Bn: "শুধুমাত্র কোডিং নয়, বরং দেশীয় ও আন্তর্জাতিক বাজারের জন্য স্বয়ংক্রিয় টেক সল্যুশন আর্কিটেক্ট করাই আমার নিয়মিত কাজ, যাতে যেকোনো ব্যবসা স্বয়ংক্রিয়ভাবে নিজের গতি বজায় রাখতে পারে।",
  avatarUrl: "/images/mahmud.jpg",
  cvUrl: "/cv.pdf",
  locationEn: "Dhaka, Bangladesh",
  locationBn: "ঢাকা, বাংলাদেশ",
};

export const defaultProjects: ProjectData[] = [
  {
    id: "1",
    slug: "madrasah-ecosystem",
    title: "Madrasah Ecosystem Software",
    subtitle: "Enterprise Islamic Institution & Hifz Tracking Platform",
    year: "2024",
    category: "android",
    filterCategory: "android",
    summary:
      "A comprehensive multi-tenant management ecosystem built for Islamic educational institutions. Seamlessly unifies Android/mobile apps for parents and teachers with an enterprise web console, WhatsApp-automated fee billing, and real-time Quran Hifz progress tracking.",
    problem:
      "Traditional madrasahs relied on handwritten registers, scattered paper ledgers, and manual SMS systems, creating massive bookkeeping errors and zero transparency for student Quran memorization progress.",
    solution:
      "Engineered an event-driven NestJS backend powering a high-performance Flutter mobile application for parents/teachers alongside a desktop-grade web admin portal with automated WhatsApp milestone triggers.",
    result:
      "Deployed across 15+ institutions serving 3,500+ active students with 99.8% uptime and instant automated attendance reporting.",
    stack: ["Flutter", "Dart", "NestJS", "PostgreSQL", "Prisma", "WhatsApp API", "Docker"],
    highlights: [
      "Custom Quran Hifz progression tracker with Surah/Ayah precision",
      "Automated WhatsApp fee reminders and instant digital payment receipts",
      "Offline-first mobile synchronization for remote campus zones",
      "Role-Based Access Control (Super Admin, Principal, Teacher, Guardian)",
    ],
    role: "Lead Fullstack & Mobile Architect",
    status: "Production",
    metrics: "15+ Institutions · 3,500+ Students · 99.8% Uptime",
    coverImage: "/images/projects/madrasah.svg",
    cover: "/images/projects/madrasah.svg",
    mockupType: "mobile",
    demoUrl: "https://example.com/madrasah-demo",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware",
    link: "https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware",
    featured: true,
    order: 1,
  },
  {
    id: "2",
    slug: "secure-my-pc",
    title: "Secure My PC",
    subtitle: "Endpoint Security & Threat Interception Daemon",
    year: "2024",
    category: "ai",
    filterCategory: "automation",
    summary:
      "Native desktop endpoint security utility and real-time background threat monitoring watchdog. Intercepts unauthorized flash drives with sub-50ms quarantine isolation, detects anomalous background processes, and performs system hygiene with less than 2% CPU overhead.",
    problem:
      "Desktop endpoints are constantly vulnerable to unauthorized USB thumb drives, rogue external media auto-run scripts, and background malware that evade standard consumer antivirus utilities.",
    solution:
      "Built a lightweight native Windows endpoint security monitor that detects mass storage device insertions at Win32 event level in sub-50ms, quarantines suspicious executable files, and logs hardware device identifiers to a local encrypted audit ledger.",
    result:
      "Provides immediate hardware-level USB quarantine and background process surveillance with negligible background CPU overhead (<2%).",
    stack: ["C# / .NET", "Win32 API", "Tauri", "Rust", "SQLite", "Node.js"],
    highlights: [
      "Sub-50ms hardware interrupt detection on USB storage insertion",
      "Automated suspicious payload sandbox isolation and file quarantine",
      "Encrypted local audit trails with zero cloud telemetry dependencies",
      "System process whitelist validation with live memory consumption alerts",
    ],
    role: "Core Systems Engineer",
    status: "Active Release",
    metrics: "Sub-50ms Reaction · <2% Background CPU · 100% Offline",
    coverImage: "/images/projects/security.svg",
    cover: "/images/projects/security.svg",
    mockupType: "terminal",
    demoUrl: "https://example.com/pc-secure-demo",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Pc-Secure-By-apps",
    link: "https://github.com/naimsmahmud50-dotcom/Pc-Secure-By-apps",
    featured: true,
    order: 2,
  },
  {
    id: "3",
    slug: "autonomous-ai-agent",
    title: "AI Agent",
    subtitle: "Self-Operating Browser & API Agent Swarms",
    year: "2024",
    category: "ai",
    filterCategory: "automation",
    summary:
      "Autonomous multi-agent orchestration architecture utilizing LangChain, Claude 3.5 Sonnet, and Playwright. Operates stateful recursive reasoning loops, headless browser DOM execution, API tool-calling, and automated database reconciliation.",
    problem:
      "Modern companies waste hundreds of operational hours navigating disparate SaaS dashboards, copying unstructured web data, and executing repetitive browser tasks that standard APIs cannot cover.",
    solution:
      "Architected a distributed agent framework capable of decomposing high-level directives into verifiable DAG subtasks, autonomously controlling headless Chromium browsers, solving captchas, and verifying outputs.",
    result:
      "Automated end-to-end browser workflows, reducing manual operations from 3 hours daily to automated background jobs.",
    stack: ["LangChain", "Claude API", "OpenAI", "Playwright", "Python", "TypeScript", "Redis"],
    highlights: [
      "Dynamic DOM element selector synthesis resistant to website UI updates",
      "Multi-model arbitration: cheap models for extraction, frontier models for logic",
      "State persistence via Redis checkpoints for zero-loss execution resumes",
      "Human-in-the-loop Slack integration for high-consequence edge decisions",
    ],
    role: "AI Systems Architect",
    status: "Internal System",
    metrics: "94.2% Task Autonomy · 12x Execution Velocity",
    coverImage: "/images/projects/ai-agent.svg",
    cover: "/images/projects/ai-agent.svg",
    mockupType: "terminal",
    demoUrl: "https://example.com/ai-agent-demo",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Autonomous-AI-Agent",
    link: "https://github.com/naimsmahmud50-dotcom/Autonomous-AI-Agent",
    featured: true,
    order: 3,
  },
  {
    id: "4",
    slug: "meta-commerce-suite",
    title: "Facebook Automation Suite",
    subtitle: "Enterprise Meta Graph API Social Selling Engine",
    year: "2024",
    category: "ai",
    filterCategory: "automation",
    summary:
      "Autonomous social selling infrastructure interfacing with Meta's Graph API. Performs real-time webhook parsing, AI comment-to-inbox auto-routing, sentiment filtering, customer phone number extraction, and CRM push.",
    problem:
      "High-volume social e-commerce businesses lose up to 60% of customer interest when inbound comments on viral ad campaigns go unanswered for more than 5 minutes.",
    solution:
      "Engineered a resilient event-driven Node.js automation microservice that listens to live Meta webhooks, passes customer intents through fine-tuned LLM prompts, generates personalized replies, and opens instant Messenger conversations.",
    result:
      "Maintained sub-15-second response times across 5,000+ customer inquiries monthly, boosting direct checkout conversion rates by 38%.",
    stack: ["Meta Graph API", "Node.js", "Express", "PostgreSQL", "BullMQ", "Redis", "OpenAI"],
    highlights: [
      "Sub-15s response latency to commercial product queries across 10+ Facebook pages",
      "Regex & NLP phone number extractor pushing directly into order management CRMs",
      "Automated profanity and spam comment hiding protecting brand ad spend",
      "Meta compliance safeguards guaranteeing zero API rate limit bans",
    ],
    role: "Lead Automation Engineer",
    status: "Operational",
    metrics: "Sub-15s Latency · 38% Conversion Increase · 0 API Bans",
    coverImage: "/images/projects/facebook.svg",
    cover: "/images/projects/facebook.svg",
    mockupType: "browser",
    demoUrl: "https://example.com/meta-demo",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-System",
    link: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-System",
    featured: true,
    order: 4,
  },
  {
    id: "5",
    slug: "travel-with-maijrun",
    title: "Travel with Maijrun",
    subtitle: "Luxury Travel & Visa Concierge Web Application",
    year: "2024",
    category: "web",
    filterCategory: "web",
    summary:
      "Bespoke international travel agency web platform built for high-touch visa guidance and custom itinerary booking. Engineered with Next.js 14 App Router, dynamic package catalogs, and WhatsApp concierge integration.",
    problem:
      "Travel agencies in emerging markets suffer from sluggish WordPress portals with poor mobile performance, resulting in high bounce rates and untracked customer inquiries.",
    solution:
      "Developed an editorial luxury Next.js 14 application featuring optimized edge-rendered travel packages, dynamic search filters, and single-click WhatsApp inquiry deep-links.",
    result:
      "Achieved a 99/100 Google Lighthouse score and instant inquiry dispatch to agency agents.",
    stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel Edge"],
    highlights: [
      "Lighthouse 99/100 Core Web Vitals score on mobile 4G networks",
      "Single-click custom WhatsApp booking payload generators",
      "Dynamic itinerary builder with interactive interactive day-by-day itineraries",
      "Structured JSON-LD schema boosting regional Google Search indexing",
    ],
    role: "Full-Stack Web Architect",
    status: "Live Platform",
    metrics: "Lighthouse 99 · 2.1x Engagement · Sub-800ms FCP",
    coverImage: "/images/projects/travel.svg",
    cover: "/images/projects/travel.svg",
    mockupType: "browser",
    demoUrl: "https://travelwithmaijrun.com",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Travel-With-Maijrun",
    link: "https://github.com/naimsmahmud50-dotcom/Travel-With-Maijrun",
    featured: true,
    order: 5,
  },
  {
    id: "6",
    slug: "b2b-lead-prospector",
    title: "B2B Lead Prospecting Engine",
    subtitle: "High-Volume Business Intelligence Scraper",
    year: "2024",
    category: "ai",
    filterCategory: "automation",
    summary:
      "Distributed asynchronous data extraction crawler. Aggregates and verifies high-intent business decision-makers from public web directories, corporate registries, and social profiles with automated SMTP MX verification.",
    problem:
      "Outbound marketing agencies burn thousands on data providers that supply stale, unverified email lists with bounce rates exceeding 25%.",
    solution:
      "Constructed a multi-threaded Python/Node.js web extraction cluster utilizing rotating proxies, automated headless browser parsers, and real-time DNS MX record verification to compile verified prospect profiles.",
    result:
      "Supplied over 50,000 verified decision-maker records with a measured bounce rate under 2.4%.",
    stack: ["Python", "Playwright", "FastAPI", "MongoDB", "Docker", "RabbitMQ"],
    highlights: [
      "Zero-detection stealth browser fingerprint spoofing",
      "Real-time SMTP handshake verification eliminating invalid corporate emails",
      "Automated CSV export pipeline with custom CRM field mapping",
      "Distributed task queuing scaling horizontally across multi-node servers",
    ],
    role: "Data Infrastructure Engineer",
    status: "Production",
    metrics: "<2.4% Bounce Rate · 50k+ Verified Leads Extracted",
    coverImage: "/images/projects/scraper.svg",
    cover: "/images/projects/scraper.svg",
    mockupType: "terminal",
    demoUrl: "https://example.com/lead-demo",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/B2B-Lead-Scraper",
    link: "https://github.com/naimsmahmud50-dotcom/B2B-Lead-Scraper",
    featured: false,
    order: 6,
  },
  {
    id: "7",
    slug: "hifz-tracker-pro",
    title: "Hifz Milestone Tracker",
    subtitle: "Offline-First Quran Memorization Android Utility",
    year: "2024",
    category: "android",
    filterCategory: "android",
    summary:
      "Specialized offline-first mobile application designed specifically for Islamic scholars and students tracking Quran memorization (Hifz). Features Surah and Ayah precision checklists, audio revision markers, and automatic local SQLite backup.",
    problem:
      "Quran memorization students and teachers struggle with retaining historical revision logs, frequently forgetting previous mistakes without accurate historical notes.",
    solution:
      "Created an intuitive Flutter mobile utility utilizing an offline-first SQLite database that allows students and mentors to log daily recitation accuracy with single-tap precision.",
    result:
      "Adopted by 500+ active students with 100% offline reliability in remote madrasah campuses.",
    stack: ["Flutter", "Dart", "SQLite", "Provider", "Local Notifications"],
    highlights: [
      "100% offline operability with zero internet connectivity required",
      "Complete 114 Surah index with accurate Ayah milestone tracking",
      "Daily revision schedule reminders and streak tracking",
      "Automated encrypted SQLite local database export & restore",
    ],
    role: "Mobile App Developer",
    status: "Active Release",
    metrics: "500+ Active Users · 100% Offline Reliability",
    coverImage: "/images/projects/student.svg",
    cover: "/images/projects/student.svg",
    mockupType: "mobile",
    demoUrl: "https://example.com/hifz-demo",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Hifz-Milestone-Tracker",
    link: "https://github.com/naimsmahmud50-dotcom/Hifz-Milestone-Tracker",
    featured: false,
    order: 7,
  },
];

// ============================================================================
// 3. CACHED FETCH HELPERS (5-second stale-while-revalidate for live admin edits)
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const fn = unstable_cache(
      async () => {
        const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
        if (!row) return defaultSiteSettings;
        const normalizedWhatsApp = buildWhatsAppUrl(row.whatsapp || defaultSiteSettings.whatsapp);
        const normalizedTelegram = buildTelegramUrl(row.telegram || defaultSiteSettings.telegram);
        return {
          ...row,
          whatsapp: normalizedWhatsApp,
          telegram: normalizedTelegram,
          socials: [
            { label: "GitHub", href: row.github || defaultSiteSettings.github },
            { label: "LinkedIn", href: row.linkedin || defaultSiteSettings.linkedin },
            { label: "WhatsApp", href: normalizedWhatsApp },
            { label: "Telegram", href: normalizedTelegram },
          ],
        };
      },
      ["site-settings"],
      { revalidate: 5, tags: ["settings"] }
    );
    return await fn();
  } catch (err) {
    console.error("getSiteSettings DB fallback error:", err);
    return defaultSiteSettings;
  }
}

export async function getHeroContent(): Promise<HeroData> {
  try {
    const fn = unstable_cache(
      async () => {
        const row = await prisma.hero.findUnique({ where: { id: "default" } });
        if (!row) return defaultHero;
        let roles: string[] = defaultHero.roles;
        try {
          roles = JSON.parse(row.roles);
        } catch {}
        return {
          ...row,
          roles,
        };
      },
      ["hero-content"],
      { revalidate: 5, tags: ["hero"] }
    );
    return await fn();
  } catch (err) {
    console.error("getHeroContent DB fallback error:", err);
    return defaultHero;
  }
}

export async function getAboutContent(): Promise<AboutData> {
  try {
    const fn = unstable_cache(
      async () => {
        const row = await prisma.about.findUnique({ where: { id: "default" } });
        if (!row) return defaultAbout;
        return row;
      },
      ["about-content"],
      { revalidate: 5, tags: ["about"] }
    );
    return await fn();
  } catch (err) {
    console.error("getAboutContent DB fallback error:", err);
    return defaultAbout;
  }
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const fn = unstable_cache(
      async () => {
        const rows = await prisma.project.findMany({
          orderBy: { order: "asc" },
        });
        if (!rows || rows.length === 0) return [];

        return rows.map((r): ProjectData => {
          let stack: string[] = [];
          let highlights: string[] = [];
          try {
            stack = JSON.parse(r.stack);
          } catch {
            stack = [r.stack];
          }
          try {
            highlights = JSON.parse(r.highlights);
          } catch {
            highlights = [r.highlights];
          }

          // Normalize category for frontend chips
          let cat: "web" | "android" | "ai" = "web";
          const lowerCat = (r.filterCategory || r.category || "").toLowerCase();
          if (lowerCat.includes("android") || lowerCat.includes("mobile")) {
            cat = "android";
          } else if (lowerCat.includes("ai") || lowerCat.includes("automation")) {
            cat = "ai";
          }

          const link = r.githubUrl || r.demoUrl || "#";

          return {
            id: r.id,
            slug: r.slug,
            title: r.title,
            subtitle: r.subtitle,
            year: r.year,
            category: cat,
            filterCategory: (r.filterCategory as "all" | "web" | "android" | "automation") || "all",
            summary: r.summary,
            problem: r.problem,
            solution: r.solution,
            result: r.result || "",
            stack,
            highlights,
            role: r.role,
            status: r.status,
            metrics: r.metrics,
            coverImage: r.coverImage,
            cover: r.coverImage,
            mockupType: (r.mockupType as "browser" | "mobile" | "terminal") || "browser",
            demoUrl: r.demoUrl,
            githubUrl: r.githubUrl,
            link,
            featured: r.featured,
            order: r.order,
          };
        });
      },
      ["all-projects"],
      { revalidate: 5, tags: ["projects"] }
    );
    return await fn();
  } catch (err) {
    console.error("getProjects DB fallback error:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) || null;
}

export async function getServices(): Promise<ServiceData[]> {
  try {
    const fn = unstable_cache(
      async () => {
        const rows = await prisma.service.findMany({
          orderBy: { order: "asc" },
        });
        if (!rows || rows.length === 0) return [];

        return rows.map((s, idx): ServiceData => {
          let deliverables: string[] = [];
          try {
            deliverables = JSON.parse(s.deliverables);
          } catch {
            deliverables = [s.deliverables];
          }
          const num = String(idx + 1).padStart(2, "0");
          return {
            id: s.id,
            num,
            title: s.titleEn,
            titleEn: s.titleEn,
            titleBn: s.titleBn,
            description: s.descriptionEn,
            descriptionEn: s.descriptionEn,
            descriptionBn: s.descriptionBn,
            deliverables,
            icon: s.icon,
            order: s.order,
          };
        });
      },
      ["all-services"],
      { revalidate: 5, tags: ["services"] }
    );
    return await fn();
  } catch (err) {
    console.error("getServices DB fallback error:", err);
    return [];
  }
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  try {
    const fn = unstable_cache(
      async () => {
        const rows = await prisma.testimonial.findMany({
          orderBy: { order: "asc" },
        });
        if (!rows || rows.length === 0) return [];

        return rows.map((t): TestimonialData => ({
          id: t.id,
          author: t.author,
          role: t.role,
          company: t.company,
          badge: t.company,
          quoteEn: t.quoteEn,
          quoteBn: t.quoteBn,
          quote: t.quoteEn,
          avatarUrl: t.avatarUrl,
          order: t.order,
        }));
      },
      ["all-testimonials"],
      { revalidate: 5, tags: ["testimonials"] }
    );
    return await fn();
  } catch (err) {
    console.error("getTestimonials DB fallback error:", err);
    return [];
  }
}

export async function getExperiences(): Promise<ExperienceData[]> {
  try {
    const fn = unstable_cache(
      async () => {
        const rows = await prisma.experience.findMany({
          orderBy: { order: "asc" },
        });
        if (!rows || rows.length === 0) return [];

        return rows.map((e): ExperienceData => {
          let technologies: string[] = [];
          try {
            technologies = JSON.parse(e.technologies);
          } catch {
            technologies = [e.technologies];
          }
          return {
            id: e.id,
            period: e.period,
            year: e.period,
            roleEn: e.roleEn,
            roleBn: e.roleBn,
            company: e.company,
            phase: e.company,
            title: e.roleEn,
            location: e.location,
            descriptionEn: e.descriptionEn,
            descriptionBn: e.descriptionBn,
            detail: e.descriptionEn,
            technologies,
            order: e.order,
          };
        });
      },
      ["all-experiences"],
      { revalidate: 5, tags: ["experiences"] }
    );
    return await fn();
  } catch (err) {
    console.error("getExperiences DB fallback error:", err);
    return [];
  }
}

export async function getSkills(): Promise<SkillItem[]> {
  try {
    const fn = unstable_cache(
      async () => {
        const rows = await prisma.skill.findMany({
          orderBy: { order: "asc" },
        });
        return rows;
      },
      ["all-skills"],
      { revalidate: 5, tags: ["skills"] }
    );
    return await fn();
  } catch (err) {
    console.error("getSkills DB fallback error:", err);
    return [];
  }
}

export async function getSkillClusters(): Promise<SkillCluster[]> {
  const skills = await getSkills();
  if (!skills || skills.length === 0) {
    return [
      {
        category: "AI & Automation",
        iconName: "Cpu",
        count: "06",
        description: "Autonomous agent swarms, tool-calling pipelines, web scraping, and self-healing background automation.",
        skills: [
          "Multi-Agent Swarm Orchestration",
          "LangChain & LangGraph Workflows",
          "Playwright Headless Automation",
          "LLM Tool Calling & Function Binding",
          "Retrieval-Augmented Generation (RAG)",
          "Automated Lead & Data Extraction",
        ],
      },
      {
        category: "Web Engineering",
        iconName: "Layout",
        count: "07",
        description: "Modern full-stack web applications built with strict type safety, server actions, and fluid 60fps animations.",
        skills: [
          "Next.js 14/15 App Router",
          "TypeScript (Strict Typing)",
          "React Server Components (RSC)",
          "Tailwind CSS & Token Architecture",
          "Framer Motion & GSAP ScrollTrigger",
          "Lenis Smooth Inertial Scrolling",
          "Responsive & Accessible UI/UX",
        ],
      },
      {
        category: "Mobile Engineering",
        iconName: "Smartphone",
        count: "05",
        description: "High-performance cross-platform mobile apps designed for seamless offline-first operation and native hardware APIs.",
        skills: [
          "Flutter Cross-Platform Architecture",
          "Offline-First SQLite / Hive Caching",
          "Riverpod & BLoC State Management",
          "Native Hardware & Camera Sensor APIs",
          "Background Daemons & Push Alerts",
        ],
      },
      {
        category: "Backend & Data",
        iconName: "Database",
        count: "06",
        description: "Resilient RESTful APIs, relational databases, caching layers, and high-concurrency microservices.",
        skills: [
          "Node.js & NestJS Microservices",
          "PostgreSQL & Prisma ORM",
          "Supabase Database Architecture",
          "Redis Caching & Sliding Rate Limits",
          "RESTful API & Webhook Design",
          "Secure Server Actions & Auth",
        ],
      },
      {
        category: "Tools & Environment",
        iconName: "Wrench",
        count: "06",
        description: "Battle-tested developer tooling, version control, automated deployments, and Linux operating systems.",
        skills: [
          "Linux Server Administration",
          "Docker Containerization",
          "Git & GitHub Workflows",
          "Postman API Testing",
          "Vercel & Cloudflare Deployment",
          "VS Code & JetBrains IDE Suite",
        ],
      },
    ];
  }

  // Group skills by category
  const categoryMap = new Map<string, string[]>();
  for (const s of skills) {
    const list = categoryMap.get(s.category) || [];
    list.push(s.name);
    categoryMap.set(s.category, list);
  }

  const clusters: SkillCluster[] = [];
  const metaLookup: Record<string, { icon: string; desc: string }> = {
    "AI & Automation": {
      icon: "Cpu",
      desc: "Autonomous agent swarms, tool-calling pipelines, web scraping, and self-healing background automation.",
    },
    "Web Architecture": {
      icon: "Layout",
      desc: "Modern full-stack web applications built with strict type safety, server actions, and fluid 60fps animations.",
    },
    "Web Engineering": {
      icon: "Layout",
      desc: "Modern full-stack web applications built with strict type safety, server actions, and fluid 60fps animations.",
    },
    "Mobile Engineering": {
      icon: "Smartphone",
      desc: "High-performance cross-platform mobile apps designed for seamless offline-first operation and native hardware APIs.",
    },
    "Cloud & DevOps": {
      icon: "Database",
      desc: "Resilient RESTful APIs, relational databases, caching layers, and high-concurrency microservices.",
    },
    "Backend & Data": {
      icon: "Database",
      desc: "Resilient RESTful APIs, relational databases, caching layers, and high-concurrency microservices.",
    },
    "Core Tools": {
      icon: "Wrench",
      desc: "Battle-tested developer tooling, version control, automated deployments, and Linux operating systems.",
    },
    "Tools & Environment": {
      icon: "Wrench",
      desc: "Battle-tested developer tooling, version control, automated deployments, and Linux operating systems.",
    },
  };

  categoryMap.forEach((names, cat) => {
    const meta = metaLookup[cat] || {
      icon: "Layout",
      desc: "Technical competencies and production technologies.",
    };
    clusters.push({
      category: cat,
      iconName: meta.icon,
      count: String(names.length).padStart(2, "0"),
      description: meta.desc,
      skills: names,
    });
  });

  return clusters;
}
