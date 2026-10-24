import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. SiteSettings
  console.log("Seeding SiteSettings...");
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Mahmud Hasan",
      title: "Mahmud Hasan — AI Automation & Full-Stack Architect",
      tagline:
        "Architecting intelligent automation systems and high-craft digital products that scale autonomously.",
      location: "Dhaka, Bangladesh",
      timeZone: "Asia/Dhaka",
      email: "mahmudhasan.infodev@gmail.com",
      phone: "+880 1767-850859",
      whatsapp: "https://wa.me/8801767850859",
      telegram: "https://t.me/naimsmahmud50",
      github: "https://github.com/naimsmahmud50-dotcom",
      linkedin:
        "https://www.linkedin.com/in/mahmud-hasan-687908269?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      seoDescription:
        "Portfolio of Mahmud Hasan. Specializing in AI Automation, Autonomous Agent Systems, Full-Stack Next.js Web Applications, and Flutter Android Development.",
      seoKeywords:
        "Mahmud Hasan, AI Automation, Full-Stack Web Developer, Android Developer, Next.js, Flutter, NestJS, Bangladesh",
      ogImageUrl: "/images/mahmud.jpg",
    },
  });

  // 2. Hero Section
  console.log("Seeding Hero...");
  await prisma.hero.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      badgeEn: "AI Automation Expert & Developer",
      badgeBn: "এআই অটোমেশন বিশেষজ্ঞ ও ডেভেলপার",
      name: "Mahmud Hasan",
      dash: "—",
      introEn:
        "Dedicated to crafting exceptional digital products with uncompromising performance, fluid interaction design, and self-operating AI pipelines.",
      introBn:
        "আপসহীন পারফরম্যান্স, সাবলীল ইন্টারঅ্যাকশন ডিজাইন এবং স্বয়ংক্রিয় এআই পাইপলাইনের সমন্বয়ে উন্নতমানের ডিজিটাল পণ্য তৈরিতে নিবেদিত।",
      positioningEn:
        "Based in Dhaka, Bangladesh — architecting intelligent autonomous workflows, full-stack web platforms & mobile ecosystems.",
      positioningBn:
        "ঢাকা, বাংলাদেশভিত্তিক — বুদ্ধিমত্তা সম্পন্ন স্বায়ত্তশাসিত ওয়ার্কফ্লো, ফুল-স্ট্যাক ওয়েব প্ল্যাটফর্ম ও মোবাইল ইকোসিস্টেম নির্মাতা।",
      availableBadgeEn: "Available for Q4/2026 Collaboration",
      availableBadgeBn: "কিউ৪/২০২৬ যৌথ কাজের জন্য উপলব্ধ",
      roles: JSON.stringify([
        "AI Automation Architecture",
        "Full-Stack Web Engineering",
        "Android App Development",
        "Autonomous Agent Systems",
      ]),
    },
  });

  // 3. About Section
  console.log("Seeding About...");
  await prisma.about.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      heroHeadlineEn:
        "Architecting autonomous pipelines & high-craft digital tools from Bangladesh—",
      heroHeadlineBn:
        "স্বায়ত্তশাসিত এআই পাইপলাইন ও উচ্চমানের ডিজিটাল সিস্টেমের রূপকার—",
      storyP1En:
        "I am an AI Automation Architect and Full-Stack Software Engineer based in Dhaka, Bangladesh. I bridge the divide between bleeding-edge machine intelligence and surgical web performance.",
      storyP1Bn:
        "আমি মাহমুদ হাসান, ঢাকা, বাংলাদেশভিত্তিক একজন এআই অটোমেশন আর্কিটেক্ট ও ফুল-স্ট্যাক সফটওয়্যার ইঞ্জিনিয়ার। অত্যাধুনিক কৃত্রিম বুদ্ধিমত্তা ও নিখুঁত ওয়েব পারফরম্যান্সের মেলবন্ধন তৈরি করাই আমার মূল লক্ষ্য।",
      storyP2En:
        "My engineering philosophy is rooted in self-operating workflows and uncompromising tactile polish. From enterprise madrasah platforms serving thousands to sub-50ms security interceptors, I construct systems that thrive under high real-world demand.",
      storyP2Bn:
        "স্বয়ংক্রিয় কাজের ধারা এবং অত্যন্ত মসৃণ ইউজার এক্সপেরিয়েন্স আমার কাজের মূল ভিত্তি। হাজারো ব্যবহারকারীর মাদরাসা ম্যানেজমেন্ট সিস্টেম থেকে শুরু করে ৫০ মিলিসেকেন্ডের এন্ডপয়েন্ট সিকিউরিটি ডেমোন—বাস্তব পৃথিবীর কঠিনতম চাহিদা পূরণেই আমার আনন্দ।",
      storyP3En:
        "Beyond production code, I actively engineer tools tailored for the local and global market, ensuring businesses scale autonomously without unnecessary operational bottlenecks.",
      storyP3Bn:
        "শুধুমাত্র কোডিং নয়, বরং দেশীয় ও আন্তর্জাতিক বাজারের জন্য স্বয়ংক্রিয় টেক সল্যুশন আর্কিটেক্ট করাই আমার নিয়মিত কাজ, যাতে যেকোনো ব্যবসা স্বয়ংক্রিয়ভাবে নিজের গতি বজায় রাখতে পারে।",
      avatarUrl: "/images/mahmud.jpg",
      cvUrl: "/cv.pdf",
      locationEn: "Dhaka, Bangladesh",
      locationBn: "ঢাকা, বাংলাদেশ",
    },
  });

  // 4. Skills Catalog
  console.log("Seeding Skills...");
  await prisma.skill.deleteMany({});
  const skillClusters = [
    {
      category: "AI & Automation",
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
      category: "Web Architecture",
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
      skills: [
        "Flutter Cross-Platform Architecture",
        "Offline-First SQLite / Hive Caching",
        "Riverpod & BLoC State Management",
        "Native Hardware & Camera Sensor APIs",
        "Background Daemons & Push Alerts",
      ],
    },
    {
      category: "Cloud & DevOps",
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
      category: "Core Tools",
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

  let skillOrder = 1;
  for (const cluster of skillClusters) {
    for (const name of cluster.skills) {
      await prisma.skill.create({
        data: {
          name,
          category: cluster.category,
          level: "Expert",
          featured: skillOrder <= 10,
          order: skillOrder++,
        },
      });
    }
  }

  // 5. Projects Catalog (All 7 Original Projects)
  console.log("Seeding Projects...");
  await prisma.project.deleteMany({});
  const projectsData = [
    {
      slug: "madrasah-ecosystem",
      title: "Madrasah Ecosystem Software",
      subtitle: "Enterprise Islamic Institution & Hifz Tracking Platform",
      year: "2024",
      category: "Web & Mobile App",
      filterCategory: "android",
      summary:
        "A comprehensive multi-tenant management ecosystem built for Islamic educational institutions. Seamlessly unifies Android/mobile apps for parents and teachers with an enterprise web console, WhatsApp-automated fee billing, and real-time Quran Hifz progress tracking.",
      problem:
        "Traditional madrasahs relied on handwritten registers, scattered paper ledgers, and manual SMS systems, creating massive bookkeeping errors and zero transparency for student Quran memorization progress.",
      solution:
        "Engineered an event-driven NestJS backend powering a high-performance Flutter mobile application for parents/teachers alongside a desktop-grade web admin portal with automated WhatsApp milestone triggers.",
      result:
        "Deployed across 15+ institutions serving 3,500+ active students with 99.8% uptime and instant automated attendance reporting.",
      stack: JSON.stringify([
        "Flutter",
        "NestJS",
        "PostgreSQL",
        "WhatsApp API",
        "Docker",
        "Tailwind CSS",
      ]),
      highlights: JSON.stringify([
        "Custom Quran Hifz progression tracker with Surah/Ayah precision",
        "Automated WhatsApp fee reminders and instant digital payment receipts",
        "Offline-first mobile synchronization for remote campus zones",
        "Role-Based Access Control (Super Admin, Principal, Teacher, Guardian)",
      ]),
      role: "Lead Fullstack & Mobile Architect",
      status: "Production",
      metrics: "15+ Institutions · 3,500+ Students · 99.8% Uptime",
      coverImage: "/images/projects/madrasah.svg",
      mockupType: "mobile",
      demoUrl: "https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware",
      githubUrl: "https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware",
      featured: true,
      order: 1,
    },
    {
      slug: "secure-my-pc",
      title: "Secure My PC",
      subtitle: "Endpoint Security & Threat Interception Daemon",
      year: "2024",
      category: "Desktop & Security Software",
      filterCategory: "automation",
      summary:
        "A lightweight, native Windows endpoint security utility and background threat watchdog. Intercepts unauthorized flash drives with sub-50ms quarantine isolation, monitors anomalous background processes, and executes emergency lockouts with less than 2% CPU overhead.",
      problem:
        "Workstations in shared offices and campus labs face constant security risks from rogue USB devices and auto-run executable payloads that standard antivirus scanners fail to intercept immediately.",
      solution:
        "Built a native Win32 device surveillance hook in C# combined with a Rust Tauri system daemon. Implemented sub-50ms hardware interception and automated flash drive quarantine.",
      result:
        "Sub-50ms hardware interception, automated quarantine vault, and background CPU utilization kept below 2%.",
      stack: JSON.stringify([
        "C# / .NET",
        "Win32 APIs",
        "Tauri",
        "Rust",
        "SQLite",
        "Windows Kernel Hooks",
      ]),
      highlights: JSON.stringify([
        "Sub-50ms Win32 USB insertion event interceptor",
        "Automated file quarantine vault with cryptographic signature checks",
        "One-click workstation panic lockdown triggering screen shield",
        "Ultra-low resource footprint (<2% CPU, <45MB RAM)",
      ]),
      role: "Core Systems Engineer",
      status: "Active Release",
      metrics: "< 50ms Intercept · < 2% CPU Load · 100% Isolation",
      coverImage: "/images/projects/security.svg",
      mockupType: "terminal",
      demoUrl: "https://github.com/naimsmahmud50-dotcom/MindPulse",
      githubUrl: "https://github.com/naimsmahmud50-dotcom/MindPulse",
      featured: true,
      order: 2,
    },
    {
      slug: "autonomous-ai-agent",
      title: "Autonomous AI Agent",
      subtitle: "Enterprise Client Acquisition & Data Enrichment Swarm",
      year: "2024",
      category: "AI & Autonomous Systems",
      filterCategory: "automation",
      summary:
        "A multi-agent autonomous system that continuously discovers prospective enterprise clients, validates corporate domain records, enriches contact details via live web scraping, and drafts contextualized outreach pipelines with human-in-the-loop safeguards.",
      problem:
        "Manual enterprise lead generation and prospect verification consumes dozens of weekly engineering and sales hours, yielding high bounce rates and domain reputation damage.",
      solution:
        "Constructed a LangChain & LangGraph multi-agent swarm coordinating specialized workers: Scout Agent (Playwright scraping), Validation Agent (DNS & MX checks), and Writer Agent (contextual proposal synthesis).",
      result:
        "Over 8,000 corporate leads verified autonomously with 4.8x higher response rates and zero domain blacklist incidents.",
      stack: JSON.stringify([
        "Python",
        "LangChain",
        "LangGraph",
        "Playwright",
        "Redis",
        "PostgreSQL",
      ]),
      highlights: JSON.stringify([
        "Stateful reflection graph that self-corrects invalid lead data",
        "Automated headless browser navigation bypassing aggressive bot walls",
        "Real-time MX-record and SMTP handshake verification",
        "Human-in-the-loop review dashboard before email dispatch",
      ]),
      role: "AI Automation Architect",
      status: "Operational",
      metrics: "8,000+ Leads Verified · 4.8x Reply Rate · 24/7 Autonomy",
      coverImage: "/images/projects/ai-agent.svg",
      mockupType: "browser",
      demoUrl: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-",
      githubUrl: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-",
      featured: true,
      order: 3,
    },
    {
      slug: "travel-with-maijrun",
      title: "Travel with Maijrun",
      subtitle: "Luxury Concierge & Multi-Currency Travel Booking Portal",
      year: "2024",
      category: "Fullstack Web Platform",
      filterCategory: "web",
      summary:
        "A premium travel booking and concierge platform tailored for luxury outbound tourism. Features real-time multi-currency pricing, interactive itinerary builders, automated visa guidance workflows, and instant PDF ticket generation.",
      problem:
        "Luxury travel agencies in South Asia rely on fragmented WhatsApp messaging and slow email threads, leading to dropped bookings and customer confusion during peak holiday seasons.",
      solution:
        "Engineered an editorial web portal utilizing Next.js 14 App Router, dynamic currency conversion, server actions, and automated PDF itinerary dispatch with responsive design.",
      result:
        "Increased inbound international booking requests by 65% with sub-100ms page transitions across global networks.",
      stack: JSON.stringify([
        "Next.js 14",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "PostgreSQL",
        "Prisma",
      ]),
      highlights: JSON.stringify([
        "Dynamic multi-currency exchange conversion with live rate feeds",
        "Interactive editorial itinerary customizer with photo galleries",
        "Automated PDF boarding pass and voucher generator",
        "WhatsApp concierge direct deep-linking with pre-filled package meta",
      ]),
      role: "Lead Fullstack Developer",
      status: "Live Platform",
      metrics: "Sub-100ms TTFB · 65% Conversion Lift · 4K+ Bookings",
      coverImage: "/images/projects/travel.svg",
      mockupType: "browser",
      demoUrl: "https://github.com/naimsmahmud50-dotcom/Travel-WIth-Maijrun",
      githubUrl: "https://github.com/naimsmahmud50-dotcom/Travel-WIth-Maijrun",
      featured: true,
      order: 4,
    },
    {
      slug: "arabic-language-club",
      title: "Arabic Language & Culture Club",
      subtitle: "Interactive Linguistic Academy & Student Community",
      year: "2023",
      category: "Fullstack Web Platform",
      filterCategory: "web",
      summary:
        "A dedicated learning management platform and cultural hub built for modern Arabic language education. Features structured audio-visual modules, grammar practice workbooks, real-time quizzes, and student community discussion forums.",
      problem:
        "Students seeking Quranic and modern standard Arabic proficiency lacked a centralized, beautifully designed digital academy with structured multimedia lesson tracking.",
      solution:
        "Built a modular learning portal with Next.js, interactive vocabulary flashcards, audio pronunciation playback, and automated progress report cards.",
      result:
        "Over 1,200 active students enrolled with 88% course completion rates and active peer study groups.",
      stack: JSON.stringify([
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "PostgreSQL",
      ]),
      highlights: JSON.stringify([
        "Interactive Arabic grammar workbooks with right-to-left (RTL) typography",
        "Native audio pronunciation playback with speech comparison widgets",
        "Automated lesson progression unlocking and certificate generation",
        "Moderated student discussion forum with rich text capabilities",
      ]),
      role: "Fullstack Developer & UI Designer",
      status: "Live Platform",
      metrics: "1,200+ Active Students · 88% Completion · RTL Native",
      coverImage: "/images/projects/arabic.svg",
      mockupType: "browser",
      demoUrl: "https://github.com/naimsmahmud50-dotcom/Arabic-Langualge-and-Cultural-Club",
      githubUrl: "https://github.com/naimsmahmud50-dotcom/Arabic-Langualge-and-Cultural-Club",
      featured: true,
      order: 5,
    },
    {
      slug: "student-life-circle",
      title: "Student Life Circle",
      subtitle: "Academic Collaboration & Skill Development Network",
      year: "2023",
      category: "Web & Community Platform",
      filterCategory: "web",
      summary:
        "An educational networking ecosystem connecting university and college students across Bangladesh. Provides peer-to-peer mentoring, curated technical workshops, open-source project matching, and career preparation materials.",
      problem:
        "Young developers and students frequently lack structured mentorship, study circles, and guidance on how to transition from academic theory into production software engineering.",
      solution:
        "Developed a responsive community platform with user profiles, event booking calendars, resource repositories, and workshop registration pipelines.",
      result:
        "Fostered a network of 2,500+ student members across multiple campuses with 40+ completed workshops.",
      stack: JSON.stringify([
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Express.js",
        "MongoDB",
        "Vercel",
      ]),
      highlights: JSON.stringify([
        "Student portfolio directory with verified project showcases",
        "Automated event registration system with QR-code ticket delivery",
        "Categorized engineering study resources and career roadmaps",
        "Interactive leaderboard and mentor-pairing request system",
      ]),
      role: "Platform Architect & Community Lead",
      status: "Live Platform",
      metrics: "2,500+ Members · 40+ Tech Workshops · 5 Campus Chapters",
      coverImage: "/images/projects/student.svg",
      mockupType: "browser",
      demoUrl: "https://github.com/naimsmahmud50-dotcom/Maijrun-Teach",
      githubUrl: "https://github.com/naimsmahmud50-dotcom/Maijrun-Teach",
      featured: true,
      order: 6,
    },
    {
      slug: "facebook-automation",
      title: "Facebook & Social Commerce Automation",
      subtitle: "High-Throughput Social Selling & Lead Generation Suite",
      year: "2024",
      category: "Social API & Automation",
      filterCategory: "automation",
      summary:
        "An enterprise Meta Graph API automation suite designed for high-volume social commerce. Automatically monitors public page interactions, classifies customer buying intent in real-time, dispatches personalized direct messages, and routes qualified leads directly to CRM.",
      problem:
        "E-commerce brands lose up to 40% of interested buyers when customer queries on Facebook comments and direct messages go unanswered during off-peak hours.",
      solution:
        "Architected an event-driven webhook ingestion pipeline connected to the Meta Graph API with sub-second automated comment resolution and WhatsApp handoff.",
      result:
        "Handled 50,000+ customer inquiries monthly with a 99.4% automated resolution rate and zero ban flags.",
      stack: JSON.stringify([
        "Meta Graph API",
        "Python",
        "Node.js",
        "Redis",
        "PostgreSQL",
        "FastAPI",
      ]),
      highlights: JSON.stringify([
        "Sub-second Facebook post comment reply and instant DM trigger",
        "Natural language intent parser identifying buying interest vs spam",
        "Anti-ban randomized delay jitter mimicking human typing speed",
        "Automated synchronization with Google Sheets, Airtable, and CRM",
      ]),
      role: "Automation Architect",
      status: "Production",
      metrics: "50K+ Inquiries/Mo · < 1s Auto-Reply · 0 Ban Flags",
      coverImage: "/images/projects/facebook.svg",
      mockupType: "browser",
      demoUrl: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-",
      githubUrl: "https://github.com/naimsmahmud50-dotcom/Facebook-Automation-",
      featured: true,
      order: 7,
    },
  ];

  for (const proj of projectsData) {
    await prisma.project.create({ data: proj });
  }

  // 6. Services & Capabilities (All 6 Services)
  console.log("Seeding Services...");
  await prisma.service.deleteMany({});
  const servicesData = [
    {
      titleEn: "AI Automation",
      titleBn: "এআই অটোমেশন",
      descriptionEn:
        "Architecting self-healing enterprise workflow automation, multi-channel client acquisition pipelines, CRM synchronizations, and data extraction engines that eliminate manual operational bottlenecks.",
      descriptionBn:
        "স্বয়ংক্রিয় এন্টারপ্রাইজ ওয়ার্কফ্লো, মাল্টি-চ্যানেল ক্লায়েন্ট একুইজিশন পাইপলাইন, সিআরএম ডাটা সিঙ্ক এবং ডাটা এক্সট্রাকশন ইঞ্জিন যা ব্যবসার ম্যানুয়াল কাজ পুরোপুরি দূর করে।",
      deliverables: JSON.stringify([
        "n8n / Make Pipelines",
        "Lead Generation Graphs",
        "Automated Outbound",
        "Data Scraping Engine",
      ]),
      icon: "Cpu",
      order: 1,
    },
    {
      titleEn: "Web App Development",
      titleBn: "ওয়েব অ্যাপ ডেভেলপমেন্ট",
      descriptionEn:
        "Engineering robust, scalable full-stack web applications with Next.js 14 App Router, TypeScript, NestJS microservices, event-driven backends, and high-concurrency PostgreSQL databases.",
      descriptionBn:
        "নেক্সট.জেএস ১৪ অ্যাপ রাউটার, টাইপস্ক্রিপ্ট, নেস্ট.জেএস মাইক্রোসার্ভিস এবং পোস্টগ্রেসকিউএল ডাটাবেসের সমন্বয়ে উচ্চগতির সুরক্ষিত ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন নির্মাণ।",
      deliverables: JSON.stringify([
        "Next.js 14 Applications",
        "NestJS Microservices",
        "PostgreSQL Architectures",
        "Secure REST & GraphQL APIs",
      ]),
      icon: "Layout",
      order: 2,
    },
    {
      titleEn: "Android App Development",
      titleBn: "অ্যান্ড্রয়েড অ্যাপ ডেভেলপমেন্ট",
      descriptionEn:
        "Developing high-craft, native-grade Flutter Android applications featuring offline-first local SQLite caching, real-time push notification infrastructure, and streamlined Play Store deployment.",
      descriptionBn:
        "ফ্লাটার দিয়ে নেটিভ পারফরম্যান্স সম্পন্ন অ্যান্ড্রয়েড অ্যাপ তৈরি, যার মধ্যে রয়েছে অফলাইন-ফার্স্ট এসকিউলাইট ক্যাশ, রিয়েল-টাইম পুশ নোটিফিকেশন এবং প্লে স্টোর পাবলিশিং।",
      deliverables: JSON.stringify([
        "Cross-Platform Flutter Apps",
        "Offline-First Local Sync",
        "Hardware & Sensor Integration",
        "Play Store CI/CD Pipelines",
      ]),
      icon: "Smartphone",
      order: 3,
    },
    {
      titleEn: "Website Development",
      titleBn: "ওয়েবসাইট ডেভেলপমেন্ট",
      descriptionEn:
        "Crafting world-class, luxury agency-grade digital experiences, bespoke portfolios, and editorial landing pages engineered with GSAP, Lenis smooth scrolling, and cinematic interaction design.",
      descriptionBn:
        "আন্তর্জাতিক মানের প্রিমিয়াম ওয়েবসাইট ও পোর্টফোলিও তৈরি—GSAP ScrollTrigger, Lenis স্মুথ স্ক্রোল এবং ডেনিস স্নিলেনবার্গ-স্টাইলের ৬০এফপিএস ইন্টারঅ্যাকশন সমৃদ্ধ।",
      deliverables: JSON.stringify([
        "Award-Winning Web Experiences",
        "Lenis + GSAP Motion Systems",
        "Headless CMS Solutions",
        "Responsive Design Systems",
      ]),
      icon: "Globe",
      order: 4,
    },
    {
      titleEn: "Facebook Automation",
      titleBn: "ফেসবুক অটোমেশন",
      descriptionEn:
        "Building enterprise Meta Graph API automation tools, automated real-time Facebook page moderation systems, customer inquiry routing bots, and targeted ad campaign lead-capture pipelines.",
      descriptionBn:
        "মেটা গ্রাফ এপিআই ইন্টিগ্রেশন, ফেসবুক পেজের পোস্ট কমেন্টে অটো-রিপ্লাই, মেসেঞ্জার লিড কনভার্সন এবং স্বয়ংক্রিয় কাস্টমার সাপোর্ট বট তৈরি।",
      deliverables: JSON.stringify([
        "Meta Graph API Integrations",
        "Auto-Moderation Bots",
        "Messenger Lead Workflows",
        "Campaign Data Analytics",
      ]),
      icon: "Share2",
      order: 5,
    },
    {
      titleEn: "AI Agents",
      titleBn: "এআই এজেন্টস",
      descriptionEn:
        "Deploying intelligent multi-agent swarms with LangChain, Claude & OpenAI APIs, tool calling, recursive problem solving, stateful memory graphs, and automated headless browser executors.",
      descriptionBn:
        "ল্যাংচেন, ক্লদ ও ওপেনএআই ভিত্তিক স্বায়ত্তশাসিত মাল্টি-এজেন্ট সিস্টেম তৈরি, যা স্বয়ংক্রিয় ব্রাউজার নিয়ন্ত্রণ ও মেমোরি গ্রাফের মাধ্যমে জটিল কাজ নিজে নিজেই সমাধান করে।",
      deliverables: JSON.stringify([
        "LangChain Multi-Agent Swarms",
        "Browser-Automated Workers",
        "Context-Aware Research Agents",
        "RAG & Knowledge Retrieval",
      ]),
      icon: "Bot",
      order: 6,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }

  // 7. Testimonials
  console.log("Seeding Testimonials...");
  await prisma.testimonial.deleteMany({});
  const testimonialsData = [
    {
      author: "Madrasah Ecosystem Partner",
      role: "Education Administration",
      company: "Institutional Network",
      quoteEn:
        "Mahmud brought an unmatched level of technical precision to our Madrasah platform. What used to take days of manual paper tracking is now handled seamlessly via Flutter and automated WhatsApp notifications.",
      quoteBn:
        "মাহমুদ আমাদের মাদরাসা ম্যানেজমেন্ট প্ল্যাটফর্মে অসাধারণ নিখুঁত কাজ উপহার দিয়েছেন। আগে যেখানে কাগজের রেজিস্টারে দিন পার হতো, এখন তা ফ্লাটার ও স্বয়ংক্রিয় হোয়াটসঅ্যাপ নোটিফিকেশনে নিমেষেই সম্পন্ন হচ্ছে।",
      order: 1,
    },
    {
      author: "B2B Outbound Director",
      role: "AI Workflow Client",
      company: "Enterprise Outreach Group",
      quoteEn:
        "The autonomous prospecting engine Mahmud designed completely transformed how we identify and qualify enterprise prospects. It operates 24/7 with zero maintenance downtime.",
      quoteBn:
        "মাহমুদের ডিজাইন করা অটোনোমাস প্রস্পেক্টিং ইঞ্জিন আমাদের ক্লায়েন্ট খোঁজার পদ্ধতিকে পুরোপুরি পরিবর্তন করেছে। এটি কোনো ঝামেলা ছাড়াই ২৪/৭ স্বয়ংক্রিয়ভাবে কাজ করে যাচ্ছে।",
      order: 2,
    },
    {
      author: "Maijrun Concierge Lead",
      role: "Travel Operations",
      company: "Travel with Maijrun",
      quoteEn:
        "Travel with Maijrun's web application immediately elevated our brand authority. The speed, editorial typography, and mobile booking concierge resulted in an instant conversion jump.",
      quoteBn:
        "ট্রাভেল উইথ মাইজরুন ওয়েব প্ল্যাটফর্মটি আমাদের ব্রান্ডের গ্রহণযোগ্যতা বহুগুণ বাড়িয়ে দিয়েছে। সাইটের সুপারফাস্ট গতি ও এডিটোরিয়াল ডিজাইন বুকিং কনভার্সন এক লাফে দ্বিগুণ করেছে।",
      order: 3,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  // 8. Experience & Timeline
  console.log("Seeding Experience...");
  await prisma.experience.deleteMany({});
  const experienceData = [
    {
      period: "2026",
      roleEn: "AI Automation Architect & Independent Consultant",
      roleBn: "এআই অটোমেশন আর্কিটেক্ট ও স্বাধীন সফটওয়্যার কনসালটেন্ট",
      company: "Independent Studio",
      location: "Dhaka, Bangladesh",
      descriptionEn:
        "Designing bespoke multi-agent workflows, autonomous enterprise scraping engines, and international Next.js web applications with physics-driven editorial UI.",
      descriptionBn:
        "আন্তর্জাতিক ক্লায়েন্টদের জন্য মাল্টি-এজেন্ট অটোনোমাস ওয়ার্কফ্লো, ডাটা স্ক্র্যাপিং ইঞ্জিন এবং ৬০এফপিএস মোশন সম্পন্ন নেক্সট.জেএস ওয়েব প্ল্যাটফর্ম আর্কিটেক্ট করা।",
      technologies: JSON.stringify([
        "Next.js 15",
        "LangChain",
        "Playwright",
        "NestJS",
        "PostgreSQL",
      ]),
      order: 1,
    },
    {
      period: "2025",
      roleEn: "Autonomous Swarms & Meta-Commerce Automation",
      roleBn: "অটোনোমাস সোয়ার্মস ও মেটা-কমার্স অটোমেশন",
      company: "B2B & Social Automation Ventures",
      location: "Dhaka, Bangladesh",
      descriptionEn:
        "Built custom social commerce bots managing thousands of automated buyer conversations, alongside high-precision lead scrapers.",
      descriptionBn:
        "হাজারো ক্রেতার কথোপকথন স্বয়ংক্রিয়ভাবে পরিচালনার জন্য কাস্টম সোশ্যাল কমার্স বট ও হাই-প্রিসিশন ডাটা স্ক্র্যাপার তৈরি।",
      technologies: JSON.stringify([
        "Python",
        "Meta Graph API",
        "Redis",
        "FastAPI",
        "Docker",
      ]),
      order: 2,
    },
    {
      period: "2024",
      roleEn: "Madrasah Ecosystem Deployment & Systems Security",
      roleBn: "মাদরাসা ইকোসিস্টেম ডেপ্লয়মেন্ট ও সিস্টেম সিকিউরিটি",
      company: "EdTech & Endpoint Security",
      location: "Dhaka, Bangladesh",
      descriptionEn:
        "Rolled out the Madrasah Management Ecosystem across 15+ institutions, serving 3,500+ active students with offline-sync Android apps and endpoint hardware monitoring.",
      descriptionBn:
        "১৫+ প্রতিষ্ঠানে ৩৫০০+ শিক্ষার্থীর জন্য অফলাইন-সিঙ্ক ফ্লাটার অ্যান্ড্রয়েড অ্যাপ এবং উইন্ডোজ এন্ডপয়েন্ট সিকিউরিটি ডেমোন ডেপ্লয় ও পরিচালনা।",
      technologies: JSON.stringify([
        "Flutter",
        "Dart",
        "C# / .NET",
        "Win32 API",
        "NestJS",
        "PostgreSQL",
      ]),
      order: 3,
    },
    {
      period: "2023",
      roleEn: "Next.js & Flutter Architecture Specialization",
      roleBn: "নেক্সট.জেএস ও ফ্লাটার আর্কিটেকচার স্পেশালাইজেশন",
      company: "Full-Stack Software Engineering",
      location: "Dhaka, Bangladesh",
      descriptionEn:
        "Deepened expertise in modern React/Next.js, TypeScript server actions, and Flutter mobile applications for real-world Bangladeshi organizations.",
      descriptionBn:
        "আধুনিক রিঅ্যাক্ট/নেক্সট.জেএস, টাইপস্ক্রিপ্ট সার্ভার অ্যাকশন এবং বাস্তব প্রতিষ্ঠানের জন্য ফ্লাটার মোবাইল অ্যাপ নির্মাণে বিশেষজ্ঞতা অর্জন।",
      technologies: JSON.stringify([
        "React",
        "Next.js",
        "TypeScript",
        "Flutter",
        "Tailwind CSS",
      ]),
      order: 4,
    },
    {
      period: "2022",
      roleEn: "Core Computer Science & Native Software Utilities",
      roleBn: "কম্পিউটার সায়েন্স ও নেটিভ সফটওয়্যার ইউটিলিটি",
      company: "Foundational Engineering",
      location: "Dhaka, Bangladesh",
      descriptionEn:
        "Began intensive software development, building algorithms, desktop security prototypes in C#/.NET, and native utilities.",
      descriptionBn:
        "সি#/.নেট ও অ্যালগরিদমের মাধ্যমে ইনটেনসিভ সফটওয়্যার ডেভেলপমেন্ট শুরু, যার মধ্যে রয়েছে ডেস্কটপ সিকিউরিটি ও সিস্টেম ইউটিলিটি।",
      technologies: JSON.stringify([
        "C#",
        "Algorithms",
        "SQLite",
        "Windows Forms",
        "Git",
      ]),
      order: 5,
    },
  ];

  for (const exp of experienceData) {
    await prisma.experience.create({ data: exp });
  }

  // 9. Initial Seed for ContactMessage
  console.log("Seeding initial sample ContactMessage...");
  await prisma.contactMessage.deleteMany({});
  await prisma.contactMessage.create({
    data: {
      name: "Acme AI Ventures",
      email: "partner@acmeventures.com",
      service: "AI Automation",
      message:
        "Hi Mahmud, we saw your work on the autonomous lead scraping agent and would love to architect a custom pipeline for our B2B sales team.",
      ipAddress: "127.0.0.1",
      status: "unread",
    },
  });

  console.log("✅ Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
