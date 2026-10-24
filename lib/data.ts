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
    stack: ["Flutter", "NestJS", "PostgreSQL", "WhatsApp API", "Docker", "Tailwind CSS"],
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
    demoUrl: "https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware",
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
      "A lightweight, native Windows endpoint security utility and background threat watchdog. Intercepts unauthorized flash drives with sub-50ms quarantine isolation, monitors anomalous background processes, and executes emergency lockouts with less than 2% CPU overhead.",
    problem:
      "Workstations in shared offices and campus labs face constant security risks from rogue USB devices and auto-run executable payloads that standard antivirus scanners fail to intercept immediately.",
    solution:
      "Built a native Win32 device surveillance hook in C# combined with a Rust Tauri system daemon. Implemented sub-50ms hardware interception and automated flash drive quarantine.",
    result:
      "Sub-50ms hardware interception, automated quarantine vault, and background CPU utilization kept below 2%.",
    stack: ["C# / .NET", "Win32 APIs", "Tauri", "Rust", "SQLite", "Windows Kernel Hooks"],
    highlights: [
      "Sub-50ms Win32 USB insertion event interceptor",
      "Automated file quarantine vault with cryptographic signature checks",
      "One-click workstation panic lockdown triggering screen shield",
      "Ultra-low resource footprint (<2% CPU, <45MB RAM)",
    ],
    role: "Core Systems Engineer",
    status: "Active Release",
    metrics: "< 50ms Intercept · < 2% CPU Load · 100% Isolation",
    coverImage: "/images/projects/security.svg",
    cover: "/images/projects/security.svg",
    mockupType: "terminal",
    demoUrl: "https://github.com/naimsmahmud50-dotcom/MindPulse",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/MindPulse",
    link: "https://github.com/naimsmahmud50-dotcom/MindPulse",
    featured: true,
    order: 2,
  },
  {
    id: "3",
    slug: "autonomous-ai-agent",
    title: "Autonomous AI Agent",
    subtitle: "Enterprise Client Acquisition & Data Enrichment Swarm",
    year: "2024",
    category: "ai",
    filterCategory: "automation",
    summary:
      "A multi-agent autonomous system that continuously discovers prospective enterprise clients, validates corporate domain records, enriches contact details via live web scraping, and drafts contextualized outreach pipelines with human-in-the-loop safeguards.",
    problem:
      "Manual enterprise lead generation and prospect verification consumes dozens of weekly engineering and sales hours, yielding high bounce rates and domain reputation damage.",
    solution:
      "Constructed a LangChain & LangGraph multi-agent swarm coordinating specialized workers: Scout Agent (Playwright scraping), Validation Agent (DNS & MX checks), and Writer Agent (contextual proposal synthesis).",
    result:
      "Over 8,000 corporate leads verified autonomously with 4.8x higher response rates and zero domain blacklist incidents.",
    stack: ["Python", "LangChain", "LangGraph", "Playwright", "Redis", "PostgreSQL"],
    highlights: [
      "Stateful reflection graph that self-corrects invalid lead data",
      "Automated headless browser navigation bypassing aggressive bot walls",
      "Real-time MX-record and SMTP handshake verification",
      "Human-in-the-loop review dashboard before email dispatch",
    ],
    role: "AI Automation Architect",
    status: "Operational",
    metrics: "8,000+ Leads Verified · 4.8x Reply Rate · 24/7 Autonomy",
    coverImage: "/images/projects/ai-agent.svg",
    cover: "/images/projects/ai-agent.svg",
    mockupType: "browser",
    demoUrl: "https://github.com/naimsmahmud50-dotcom/Autonomous-AI-Agent",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Autonomous-AI-Agent",
    link: "https://github.com/naimsmahmud50-dotcom/Autonomous-AI-Agent",
    featured: true,
    order: 3,
  },
  {
    id: "4",
    slug: "travel-with-maijrun",
    title: "Travel with Maijrun",
    subtitle: "Luxury Concierge & Multi-Currency Travel Booking Portal",
    year: "2024",
    category: "web",
    filterCategory: "web",
    summary:
      "A premium travel booking and concierge platform tailored for luxury outbound tourism. Features real-time multi-currency pricing, interactive itinerary builders, automated visa guidance workflows, and instant PDF ticket generation.",
    problem:
      "Luxury travel agencies in South Asia rely on fragmented WhatsApp messaging and slow email threads, leading to dropped bookings and customer confusion during peak holiday seasons.",
    solution:
      "Engineered an editorial web portal utilizing Next.js 14 App Router, dynamic currency conversion, server actions, and automated PDF itinerary dispatch with responsive design.",
    result:
      "Increased inbound international booking requests by 65% with sub-100ms page transitions across global networks.",
    stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "PostgreSQL", "Prisma"],
    highlights: [
      "Dynamic multi-currency exchange conversion with live rate feeds",
      "Interactive editorial itinerary customizer with photo galleries",
      "Automated PDF boarding pass and voucher generator",
      "WhatsApp concierge direct deep-linking with pre-filled package meta",
    ],
    role: "Lead Fullstack Developer",
    status: "Live Platform",
    metrics: "Sub-100ms TTFB · 65% Conversion Lift · 4K+ Bookings",
    coverImage: "/images/projects/travel.svg",
    cover: "/images/projects/travel.svg",
    mockupType: "browser",
    demoUrl: "https://travelwithmaijrun.com",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Travel-With-Maijrun",
    link: "https://github.com/naimsmahmud50-dotcom/Travel-With-Maijrun",
    featured: true,
    order: 4,
  },
  {
    id: "5",
    slug: "arabic-language-club",
    title: "Arabic Language & Culture Club",
    subtitle: "Interactive Linguistic Academy & Student Community",
    year: "2023",
    category: "web",
    filterCategory: "web",
    summary:
      "A dedicated learning management platform and cultural hub built for modern Arabic language education. Features structured audio-visual modules, grammar practice workbooks, real-time quizzes, and student community discussion forums.",
    problem:
      "Students seeking Quranic and modern standard Arabic proficiency lacked a centralized, beautifully designed digital academy with structured multimedia lesson tracking.",
    solution:
      "Built a modular learning portal with Next.js, interactive vocabulary flashcards, audio pronunciation playback, and automated progress report cards.",
    result:
      "Over 1,200 active students enrolled with 88% course completion rates and active peer study groups.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    highlights: [
      "Interactive Arabic grammar workbooks with right-to-left (RTL) typography",
      "Native audio pronunciation playback with speech comparison widgets",
      "Automated lesson progression unlocking and certificate generation",
      "Moderated student discussion forum with rich text capabilities",
    ],
    role: "Fullstack Developer & UI Designer",
    status: "Live Platform",
    metrics: "1,200+ Active Students · 88% Completion · RTL Native",
    coverImage: "/images/projects/arabic.svg",
    cover: "/images/projects/arabic.svg",
    mockupType: "browser",
    demoUrl: "https://github.com/naimsmahmud50-dotcom/Arabic-Langualge-and-Cultural-Club",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Arabic-Langualge-and-Cultural-Club",
    link: "https://github.com/naimsmahmud50-dotcom/Arabic-Langualge-and-Cultural-Club",
    featured: true,
    order: 5,
  },
  {
    id: "6",
    slug: "student-life-circle",
    title: "Student Life Circle",
    subtitle: "Academic Collaboration & Skill Development Network",
    year: "2023",
    category: "web",
    filterCategory: "web",
    summary:
      "An educational networking ecosystem connecting university and college students across Bangladesh. Provides peer-to-peer mentoring, curated technical workshops, open-source project matching, and career preparation materials.",
    problem:
      "Young developers and students frequently lack structured mentorship, study circles, and guidance on how to transition from academic theory into production software engineering.",
    solution:
      "Developed a responsive community platform with user profiles, event booking calendars, resource repositories, and workshop registration pipelines.",
    result:
      "Fostered a network of 2,500+ student members across multiple campuses with 40+ completed workshops.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Express.js", "MongoDB", "Vercel"],
    highlights: [
      "Student portfolio directory with verified project showcases",
      "Automated event registration system with QR-code ticket delivery",
      "Categorized engineering study resources and career roadmaps",
      "Interactive leaderboard and mentor-pairing request system",
    ],
    role: "Platform Architect & Community Lead",
    status: "Live Platform",
    metrics: "2,500+ Members · 40+ Tech Workshops · 5 Campus Chapters",
    coverImage: "/images/projects/student.svg",
    cover: "/images/projects/student.svg",
    mockupType: "browser",
    demoUrl: "https://github.com/naimsmahmud50-dotcom/Maijrun-Teach",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Maijrun-Teach",
    link: "https://github.com/naimsmahmud50-dotcom/Maijrun-Teach",
    featured: true,
    order: 6,
  },
  {
    id: "7",
    slug: "facebook-automation",
    title: "Facebook & Social Commerce Automation",
    subtitle: "High-Throughput Social Selling & Lead Generation Suite",
    year: "2024",
    category: "ai",
    filterCategory: "automation",
    summary:
      "An enterprise Meta Graph API automation suite designed for high-volume social commerce. Automatically monitors public page interactions, classifies customer buying intent in real-time, dispatches personalized direct messages, and routes qualified leads directly to CRM.",
    problem:
      "E-commerce brands lose up to 40% of interested buyers when customer queries on Facebook comments and direct messages go unanswered during off-peak hours.",
    solution:
      "Architected an event-driven webhook ingestion pipeline connected to the Meta Graph API with sub-second automated comment resolution and WhatsApp handoff.",
    result:
      "Handled 50,000+ customer inquiries monthly with a 99.4% automated resolution rate and zero ban flags.",
    stack: ["Meta Graph API", "Python", "Node.js", "Redis", "PostgreSQL", "FastAPI"],
    highlights: [
      "Sub-second Facebook post comment reply and instant DM trigger",
      "Natural language intent parser identifying buying interest vs spam",
      "Anti-ban randomized delay jitter mimicking human typing speed",
      "Automated synchronization with Google Sheets, Airtable, and CRM",
    ],
    role: "Automation Architect",
    status: "Production",
    metrics: "50K+ Inquiries/Mo · < 1s Auto-Reply · 0 Ban Flags",
    coverImage: "/images/projects/facebook.svg",
    cover: "/images/projects/facebook.svg",
    mockupType: "browser",
    demoUrl: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-",
    link: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-",
    featured: true,
    order: 7,
  },
  {
    id: "8",
    slug: "autonomous-linkedin-lead-outreach-engine",
    title: "Autonomous LinkedIn Lead & Outreach Engine",
    subtitle: "Autonomous B2B Lead Scraping, AI Enrichment & Anti-Ban Cold Outreach Pipeline",
    year: "2026",
    category: "ai",
    filterCategory: "automation",
    summary:
      "An enterprise-grade autonomous LinkedIn prospecting engine engineered to discover high-value B2B decision-makers, enrich contact metadata using AI, and execute personalized multi-touch cold outreach sequences without triggering platform rate-limits.",
    problem:
      "Manual B2B prospecting on LinkedIn requires hundreds of hours per week, yields poor conversion with generic copy, and third-party cloud tools routinely trigger LinkedIn's aggressive bot-detection algorithms, resulting in restricted accounts or shadow-bans.",
    solution:
      "Architected a resilient distributed scraper using headless browsers with stealth plugins, randomized humanized mouse kinematics, and rotating residential proxies. Built an integrated LLM pipeline that analyzes a lead's recent posts to generate 100% unique hyper-personalized connection icebreakers, syncing verified data straight into HubSpot CRM.",
    result:
      "Eliminated manual prospecting overhead, extracting 12,000+ enriched decision-makers monthly with zero account bans and a 42% connection acceptance rate.",
    stack: [
      "Python",
      "Playwright / Puppeteer",
      "OpenAI API (GPT-4o)",
      "Redis Task Queue",
      "PostgreSQL",
      "Webhooks (CRM Sync)",
      "Docker",
    ],
    highlights: [
      "Stealth Anti-Detection Engine with randomized human kinematics",
      "Dynamic Post & Profile AI Analysis for custom icebreakers",
      "Multi-Step Follow-Up Sequence Engine with rate pacing",
      "Instant Telegram & CRM Webhook Alerts on lead replies",
    ],
    role: "Lead Architect",
    status: "Production",
    metrics: "Zero-Ban Architecture · 12K+ Leads/Mo · 42% Acceptance",
    coverImage: "/images/projects/linkedin-automation.jpg",
    cover: "/images/projects/linkedin-automation.jpg",
    mockupType: "browser",
    demoUrl: "https://github.com/naimsmahmud50-dotcom/Autonomous-LinkedIn-Lead-Engine",
    githubUrl: "https://github.com/naimsmahmud50-dotcom/Autonomous-LinkedIn-Lead-Engine",
    link: "https://github.com/naimsmahmud50-dotcom/Autonomous-LinkedIn-Lead-Engine",
    featured: true,
    order: 8,
  },
];

export const defaultServices: ServiceData[] = [
  {
    id: "s1",
    num: "01",
    title: "AI Automation",
    titleEn: "AI Automation",
    titleBn: "এআই অটোমেশন",
    description:
      "Architecting self-healing enterprise workflow automation, multi-channel client acquisition pipelines, CRM synchronizations, and data extraction engines that eliminate manual operational bottlenecks.",
    descriptionEn:
      "Architecting self-healing enterprise workflow automation, multi-channel client acquisition pipelines, CRM synchronizations, and data extraction engines that eliminate manual operational bottlenecks.",
    descriptionBn:
      "স্বয়ংক্রিয় এন্টারপ্রাইজ ওয়ার্কফ্লো, মাল্টি-চ্যানেল ক্লায়েন্ট একুইজিশন পাইপলাইন, সিআরএম ডাটা সিঙ্ক এবং ডাটা এক্সট্রাকশন ইঞ্জিন যা ব্যবসার ম্যানুয়াল কাজ পুরোপুরি দূর করে।",
    deliverables: ["n8n / Make Pipelines", "Lead Generation Graphs", "Automated Outbound", "Data Scraping Engine"],
    icon: "Cpu",
    order: 1,
  },
  {
    id: "s2",
    num: "02",
    title: "Web App Development",
    titleEn: "Web App Development",
    titleBn: "ওয়েব অ্যাপ ডেভেলপমেন্ট",
    description:
      "Engineering robust, scalable full-stack web applications with Next.js 14 App Router, TypeScript, NestJS microservices, event-driven backends, and high-concurrency PostgreSQL databases.",
    descriptionEn:
      "Engineering robust, scalable full-stack web applications with Next.js 14 App Router, TypeScript, NestJS microservices, event-driven backends, and high-concurrency PostgreSQL databases.",
    descriptionBn:
      "নেক্সট.জেএস ১৪ অ্যাপ রাউটার, টাইপস্ক্রিপ্ট, নেস্ট.জেএস মাইক্রোসার্ভিস এবং পোস্টগ্রেসকিউএল ডাটাবেসের সমন্বয়ে উচ্চগতির সুরক্ষিত ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন নির্মাণ।",
    deliverables: ["Next.js 14 Applications", "NestJS Microservices", "PostgreSQL Architectures", "Secure REST & GraphQL APIs"],
    icon: "Layout",
    order: 2,
  },
  {
    id: "s3",
    num: "03",
    title: "Android App Development",
    titleEn: "Android App Development",
    titleBn: "অ্যান্ড্রয়েড অ্যাপ ডেভেলপমেন্ট",
    description:
      "Developing high-craft, native-grade Flutter Android applications featuring offline-first local SQLite caching, real-time push notification infrastructure, and streamlined Play Store deployment.",
    descriptionEn:
      "Developing high-craft, native-grade Flutter Android applications featuring offline-first local SQLite caching, real-time push notification infrastructure, and streamlined Play Store deployment.",
    descriptionBn:
      "ফ্লাটার দিয়ে নেটিভ পারফরম্যান্স সম্পন্ন অ্যান্ড্রয়েড অ্যাপ তৈরি, যার মধ্যে রয়েছে অফলাইন-ফার্স্ট এসকিউলাইট ক্যাশ, রিয়েল-টাইম পুশ নোটিফিকেশন এবং প্লে স্টোর পাবলিশিং।",
    deliverables: ["Cross-Platform Flutter Apps", "Offline-First Local Sync", "Hardware & Sensor Integration", "Play Store CI/CD Pipelines"],
    icon: "Smartphone",
    order: 3,
  },
  {
    id: "s4",
    num: "04",
    title: "Website Development",
    titleEn: "Website Development",
    titleBn: "ওয়েবসাইট ডেভেলপমেন্ট",
    description:
      "Crafting world-class, luxury agency-grade digital experiences, bespoke portfolios, and editorial landing pages engineered with GSAP, Lenis smooth scrolling, and cinematic interaction design.",
    descriptionEn:
      "Crafting world-class, luxury agency-grade digital experiences, bespoke portfolios, and editorial landing pages engineered with GSAP, Lenis smooth scrolling, and cinematic interaction design.",
    descriptionBn:
      "আন্তর্জাতিক মানের প্রিমিয়াম ওয়েবসাইট ও পোর্টফোলিও তৈরি—GSAP ScrollTrigger, Lenis স্মুথ স্ক্রোল এবং ডেনিস স্নিলেনবার্গ-স্টাইলের ৬০এফপিএস ইন্টারঅ্যাকশন সমৃদ্ধ।",
    deliverables: ["Award-Winning Web Experiences", "Lenis + GSAP Motion Systems", "Headless CMS Solutions", "Responsive Design Systems"],
    icon: "Globe",
    order: 4,
  },
  {
    id: "s5",
    num: "05",
    title: "Facebook Automation",
    titleEn: "Facebook Automation",
    titleBn: "ফেসবুক অটোমেশন",
    description:
      "Building enterprise Meta Graph API automation tools, automated real-time Facebook page moderation systems, customer inquiry routing bots, and targeted ad campaign lead-capture pipelines.",
    descriptionEn:
      "Building enterprise Meta Graph API automation tools, automated real-time Facebook page moderation systems, customer inquiry routing bots, and targeted ad campaign lead-capture pipelines.",
    descriptionBn:
      "মেটা গ্রাফ এপিআই ইন্টিগ্রেশন, ফেসবুক পেজের পোস্ট কমেন্টে অটো-রিপ্লাই, মেসেঞ্জার লিড কনভার্সন এবং স্বয়ংক্রিয় কাস্টমার সাপোর্ট বট তৈরি।",
    deliverables: ["Meta Graph API Integrations", "Auto-Moderation Bots", "Messenger Lead Workflows", "Campaign Data Analytics"],
    icon: "Share2",
    order: 5,
  },
  {
    id: "s6",
    num: "06",
    title: "AI Agents",
    titleEn: "AI Agents",
    titleBn: "এআই এজেন্টস",
    description:
      "Deploying intelligent multi-agent swarms with LangChain, Claude & OpenAI APIs, tool calling, recursive problem solving, stateful memory graphs, and automated headless browser executors.",
    descriptionEn:
      "Deploying intelligent multi-agent swarms with LangChain, Claude & OpenAI APIs, tool calling, recursive problem solving, stateful memory graphs, and automated headless browser executors.",
    descriptionBn:
      "ল্যাংচেন, ক্লদ ও ওপেনএআই ভিত্তিক স্বায়ত্তশাসিত মাল্টি-এজেন্ট সিস্টেম তৈরি, যা স্বয়ংক্রিয় ব্রাউজার নিয়ন্ত্রণ ও মেমোরি গ্রাফের মাধ্যমে জটিল কাজ নিজে নিজেই সমাধান করে।",
    deliverables: ["LangChain Multi-Agent Swarms", "Browser-Automated Workers", "Context-Aware Research Agents", "RAG & Knowledge Retrieval"],
    icon: "Bot",
    order: 6,
  },
];

export const defaultTestimonials: TestimonialData[] = [
  {
    id: "t1",
    author: "Madrasah Ecosystem Partner",
    role: "Education Administration",
    company: "Institutional Network",
    badge: "Institutional Network",
    quoteEn:
      "Mahmud brought an unmatched level of technical precision to our Madrasah platform. What used to take days of manual paper tracking is now handled seamlessly via Flutter and automated WhatsApp notifications.",
    quoteBn:
      "মাহমুদ আমাদের মাদরাসা ম্যানেজমেন্ট প্ল্যাটফর্মে অসাধারণ নিখুঁত কাজ উপহার দিয়েছেন। আগে যেখানে কাগজের রেজিস্টারে দিন পার হতো, এখন তা ফ্লাটার ও স্বয়ংক্রিয় হোয়াটসঅ্যাপ নোটিফিকেশনে নিমেষেই সম্পন্ন হচ্ছে।",
    quote:
      "Mahmud brought an unmatched level of technical precision to our Madrasah platform. What used to take days of manual paper tracking is now handled seamlessly via Flutter and automated WhatsApp notifications.",
    order: 1,
  },
  {
    id: "t2",
    author: "B2B Outbound Director",
    role: "AI Workflow Client",
    company: "Enterprise Outreach Group",
    badge: "Enterprise Outreach Group",
    quoteEn:
      "The autonomous prospecting engine Mahmud designed completely transformed how we identify and qualify enterprise prospects. It operates 24/7 with zero maintenance downtime.",
    quoteBn:
      "মাহমুদের ডিজাইন করা অটোনোমাস প্রস্পেক্টিং ইঞ্জিন আমাদের ক্লায়েন্ট খোঁজার পদ্ধতিকে পুরোপুরি পরিবর্তন করেছে। এটি কোনো ঝামেলা ছাড়াই ২৪/৭ স্বয়ংক্রিয়ভাবে কাজ করে যাচ্ছে।",
    quote:
      "The autonomous prospecting engine Mahmud designed completely transformed how we identify and qualify enterprise prospects. It operates 24/7 with zero maintenance downtime.",
    order: 2,
  },
  {
    id: "t3",
    author: "Maijrun Concierge Lead",
    role: "Travel Operations",
    company: "Travel with Maijrun",
    badge: "Travel with Maijrun",
    quoteEn:
      "Travel with Maijrun's web application immediately elevated our brand authority. The speed, editorial typography, and mobile booking concierge resulted in an instant conversion jump.",
    quoteBn:
      "ট্রাভেল উইথ মাইজরুন ওয়েব প্ল্যাটফর্মটি আমাদের ব্রান্ডের গ্রহণযোগ্যতা বহুগুণ বাড়িয়ে দিয়েছে। সাইটের সুপারফাস্ট গতি ও এডিটোরিয়াল ডিজাইন বুকিং কনভার্সন এক লাফে দ্বিগুণ করেছে।",
    quote:
      "Travel with Maijrun's web application immediately elevated our brand authority. The speed, editorial typography, and mobile booking concierge resulted in an instant conversion jump.",
    order: 3,
  },
];

export const defaultExperiences: ExperienceData[] = [
  {
    id: "e1",
    period: "2026",
    year: "2026",
    roleEn: "AI Automation Architect & Independent Consultant",
    roleBn: "এআই অটোমেশন আর্কিটেক্ট ও স্বাধীন সফটওয়্যার কনসালটেন্ট",
    company: "Independent Studio",
    phase: "Independent Studio",
    title: "AI Automation Architect & Independent Consultant",
    location: "Dhaka, Bangladesh",
    descriptionEn:
      "Designing bespoke multi-agent workflows, autonomous enterprise scraping engines, and international Next.js web applications with physics-driven editorial UI.",
    descriptionBn:
      "আন্তর্জাতিক ক্লায়েন্টদের জন্য মাল্টি-এজেন্ট অটোনোমাস ওয়ার্কফ্লো, ডাটা স্ক্র্যাপিং ইঞ্জিন এবং ৬০এফপিএস মোশন সম্পন্ন নেক্সট.জেএস ওয়েব প্ল্যাটফর্ম আর্কিটেক্ট করা।",
    detail:
      "Designing bespoke multi-agent workflows, autonomous enterprise scraping engines, and international Next.js web applications with physics-driven editorial UI.",
    technologies: ["Next.js 15", "LangChain", "Playwright", "NestJS", "PostgreSQL"],
    order: 1,
  },
  {
    id: "e2",
    period: "2025",
    year: "2025",
    roleEn: "Autonomous Swarms & Meta-Commerce Automation",
    roleBn: "অটোনোমাস সোয়ার্মস ও মেটা-কমার্স অটোমেশন",
    company: "B2B & Social Automation Ventures",
    phase: "B2B & Social Automation Ventures",
    title: "Autonomous Swarms & Meta-Commerce Automation",
    location: "Dhaka, Bangladesh",
    descriptionEn:
      "Built custom social commerce bots managing thousands of automated buyer conversations, alongside high-precision lead scrapers.",
    descriptionBn:
      "হাজারো ক্রেতার কথোপকথন স্বয়ংক্রিয়ভাবে পরিচালনার জন্য কাস্টম সোশ্যাল কমার্স বট ও হাই-প্রিসিশন ডাটা স্ক্র্যাপার তৈরি।",
    detail:
      "Built custom social commerce bots managing thousands of automated buyer conversations, alongside high-precision lead scrapers.",
    technologies: ["Python", "Meta Graph API", "Redis", "FastAPI", "Docker"],
    order: 2,
  },
  {
    id: "e3",
    period: "2024",
    year: "2024",
    roleEn: "Madrasah Ecosystem Deployment & Systems Security",
    roleBn: "মাদরাসা ইকোসিস্টেম ডেপ্লয়মেন্ট ও সিস্টেম সিকিউরিটি",
    company: "EdTech & Endpoint Security",
    phase: "EdTech & Endpoint Security",
    title: "Madrasah Ecosystem Deployment & Systems Security",
    location: "Dhaka, Bangladesh",
    descriptionEn:
      "Rolled out the Madrasah Management Ecosystem across 15+ institutions, serving 3,500+ active students with offline-sync Android apps and endpoint hardware monitoring.",
    descriptionBn:
      "১৫টির বেশি প্রতিষ্ঠানে মাদরাসা ম্যানেজমেন্ট সিস্টেম সফলভাবে পরিচালনা, যেখানে ৩,৫০০+ ছাত্রছাত্রী ফ্লাটার অ্যাপ ও এন্ডপয়েন্ট সিকিউরিটি মনিটরের মাধ্যমে যুক্ত।",
    detail:
      "Rolled out the Madrasah Management Ecosystem across 15+ institutions, serving 3,500+ active students with offline-sync Android apps and endpoint hardware monitoring.",
    technologies: ["Flutter", "Dart", "Rust / Tauri", "C# / .NET", "PostgreSQL"],
    order: 3,
  },
];

export const defaultSkills: SkillItem[] = [
  { id: "sk1", name: "Multi-Agent Swarm Orchestration", category: "AI & Automation", level: "Expert", featured: true, order: 1 },
  { id: "sk2", name: "LangChain & LangGraph Workflows", category: "AI & Automation", level: "Expert", featured: true, order: 2 },
  { id: "sk3", name: "Playwright Headless Automation", category: "AI & Automation", level: "Expert", featured: true, order: 3 },
  { id: "sk4", name: "LLM Tool Calling & Function Binding", category: "AI & Automation", level: "Expert", featured: true, order: 4 },
  { id: "sk5", name: "Retrieval-Augmented Generation (RAG)", category: "AI & Automation", level: "Expert", featured: true, order: 5 },
  { id: "sk6", name: "Automated Lead & Data Extraction", category: "AI & Automation", level: "Expert", featured: true, order: 6 },
  { id: "sk7", name: "Next.js 14/15 App Router", category: "Web Architecture", level: "Expert", featured: true, order: 7 },
  { id: "sk8", name: "TypeScript (Strict Typing)", category: "Web Architecture", level: "Expert", featured: true, order: 8 },
  { id: "sk9", name: "React Server Components (RSC)", category: "Web Architecture", level: "Expert", featured: true, order: 9 },
  { id: "sk10", name: "Tailwind CSS & Token Architecture", category: "Web Architecture", level: "Expert", featured: true, order: 10 },
  { id: "sk11", name: "Framer Motion & GSAP ScrollTrigger", category: "Web Architecture", level: "Expert", featured: false, order: 11 },
  { id: "sk12", name: "Lenis Smooth Inertial Scrolling", category: "Web Architecture", level: "Expert", featured: false, order: 12 },
  { id: "sk13", name: "Responsive & Accessible UI/UX", category: "Web Architecture", level: "Expert", featured: false, order: 13 },
  { id: "sk14", name: "Flutter Cross-Platform Architecture", category: "Mobile Engineering", level: "Expert", featured: true, order: 14 },
  { id: "sk15", name: "Offline-First SQLite / Hive Caching", category: "Mobile Engineering", level: "Expert", featured: true, order: 15 },
  { id: "sk16", name: "Riverpod & BLoC State Management", category: "Mobile Engineering", level: "Expert", featured: false, order: 16 },
  { id: "sk17", name: "Native Hardware & Camera Sensor APIs", category: "Mobile Engineering", level: "Expert", featured: false, order: 17 },
  { id: "sk18", name: "Background Daemons & Push Alerts", category: "Mobile Engineering", level: "Expert", featured: false, order: 18 },
  { id: "sk19", name: "Node.js & NestJS Microservices", category: "Cloud & DevOps", level: "Expert", featured: true, order: 19 },
  { id: "sk20", name: "PostgreSQL & Prisma ORM", category: "Cloud & DevOps", level: "Expert", featured: true, order: 20 },
  { id: "sk21", name: "Supabase Database Architecture", category: "Cloud & DevOps", level: "Expert", featured: false, order: 21 },
  { id: "sk22", name: "Redis Caching & Sliding Rate Limits", category: "Cloud & DevOps", level: "Expert", featured: false, order: 22 },
  { id: "sk23", name: "RESTful API & Webhook Design", category: "Cloud & DevOps", level: "Expert", featured: false, order: 23 },
  { id: "sk24", name: "Secure Server Actions & Auth", category: "Cloud & DevOps", level: "Expert", featured: false, order: 24 },
  { id: "sk25", name: "Linux Server Administration", category: "Core Tools", level: "Expert", featured: false, order: 25 },
  { id: "sk26", name: "Docker Containerization", category: "Core Tools", level: "Expert", featured: false, order: 26 },
  { id: "sk27", name: "Git & GitHub Workflows", category: "Core Tools", level: "Expert", featured: false, order: 27 },
  { id: "sk28", name: "Postman API Testing", category: "Core Tools", level: "Expert", featured: false, order: 28 },
  { id: "sk29", name: "Vercel & Cloudflare Deployment", category: "Core Tools", level: "Expert", featured: false, order: 29 },
  { id: "sk30", name: "VS Code & JetBrains IDE Suite", category: "Core Tools", level: "Expert", featured: false, order: 30 },
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
        if (!rows || rows.length === 0) return defaultProjects;

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
          const cover = r.coverImage || "/images/projects/madrasah.svg";

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
            coverImage: cover,
            cover: cover,
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
    const result = await fn();
    return result && result.length > 0 ? result : defaultProjects;
  } catch (err) {
    console.error("getProjects DB fallback error:", err);
    return defaultProjects;
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
        if (!rows || rows.length === 0) return defaultServices;

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
    const result = await fn();
    return result && result.length > 0 ? result : defaultServices;
  } catch (err) {
    console.error("getServices DB fallback error:", err);
    return defaultServices;
  }
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  try {
    const fn = unstable_cache(
      async () => {
        const rows = await prisma.testimonial.findMany({
          orderBy: { order: "asc" },
        });
        if (!rows || rows.length === 0) return defaultTestimonials;

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
    const result = await fn();
    return result && result.length > 0 ? result : defaultTestimonials;
  } catch (err) {
    console.error("getTestimonials DB fallback error:", err);
    return defaultTestimonials;
  }
}

export async function getExperiences(): Promise<ExperienceData[]> {
  try {
    const fn = unstable_cache(
      async () => {
        const rows = await prisma.experience.findMany({
          orderBy: { order: "asc" },
        });
        if (!rows || rows.length === 0) return defaultExperiences;

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
    const result = await fn();
    return result && result.length > 0 ? result : defaultExperiences;
  } catch (err) {
    console.error("getExperiences DB fallback error:", err);
    return defaultExperiences;
  }
}

export async function getSkills(): Promise<SkillItem[]> {
  try {
    const fn = unstable_cache(
      async () => {
        const rows = await prisma.skill.findMany({
          orderBy: { order: "asc" },
        });
        if (!rows || rows.length === 0) return defaultSkills;
        return rows;
      },
      ["all-skills"],
      { revalidate: 5, tags: ["skills"] }
    );
    const result = await fn();
    return result && result.length > 0 ? result : defaultSkills;
  } catch (err) {
    console.error("getSkills DB fallback error:", err);
    return defaultSkills;
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
