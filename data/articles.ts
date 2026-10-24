export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
  content: string[];
}

export const articles: Article[] = [
  {
    slug: "building-autonomous-agent-swarms-with-langchain",
    title: "Architecting Self-Healing Multi-Agent Outbound Systems in Python",
    subtitle: "How to design deterministic agent state machines with reflection loops that don't hallucinate or get banned.",
    date: "October 2024",
    readTime: "7 min read",
    category: "AI Automation",
    summary:
      "A deep technical breakdown of using LangChain and Playwright to orchestrate multi-agent swarms that discover, enrich, and contact enterprise leads autonomously with human-in-the-loop safeguards.",
    content: [
      "Most naive AI automation attempts fail because they treat an LLM as a single-turn oracle. When web pages change structure or rate limits hit, the pipeline crumbles.",
      "In our enterprise prospecting agent architecture, we separate concerns into a cyclic state graph: Scout Agent (scraping with Playwright), Verifier Agent (MX and SMTP syntax validation), and Synthesis Agent (contextual value propositions).",
      "Crucially, we introduced an autonomous reflection loop: if the email deliverability score falls below 95%, the agent swarms back to search alternative corporate domain records before any email is queued.",
      "The result: over 8,000 verified leads processed with an unprecedented 4.8x reply rate and zero domain blacklisting.",
    ],
  },
  {
    slug: "nextjs-14-high-craft-editorial-performance",
    title: "Achieving Sub-50ms TTFB and 60fps Motion in Next.js App Router",
    subtitle: "Combining Lenis smooth inertial scrolling, GSAP ScrollTrigger, and Server Components without layout thrashing.",
    date: "September 2024",
    readTime: "5 min read",
    category: "Web Engineering",
    summary:
      "How to build editorial, award-winning developer portfolios inspired by Dennis Snellenberg while scoring 95+ across all Google Lighthouse metrics.",
    content: [
      "Heavy animations often ruin web performance when executed blindly. The secret to Dennis Snellenberg-level polish is decoupling the scroll physics from standard native browser events.",
      "By utilizing Lenis for virtual smooth scrolling and syncing its requestAnimationFrame ticker directly into GSAP's ScrollTrigger, we eliminate scroll jitter completely.",
      "Furthermore, all heavy vector preview computations are kept off the critical path, and fonts are preloaded with CSS display: swap. Layout shifts are strictly zero.",
      "This provides the best of both worlds: buttery 120Hz micro-interactions and instant sub-second Server-Side Rendered HTML.",
    ],
  },
  {
    slug: "flutter-offline-first-architecture",
    title: "Building High-Throughput Offline-First Mobile Systems with SQLite & Hive",
    subtitle: "Architectural patterns from the Madrasah Ecosystem serving thousands of daily active mobile users in low-connectivity areas.",
    date: "August 2024",
    readTime: "6 min read",
    category: "Android & Mobile",
    summary:
      "A case study on building robust data synchronization, conflict resolution, and WhatsApp notification pipelines for educational mobile applications.",
    content: [
      "In rural Bangladesh, internet connectivity is intermittent. If an educational management app blocks user actions behind HTTP spinners, teachers and administrators will abandon it.",
      "For the Madrasah Ecosystem, we adopted a local-first SQLite and Hive database caching layer. Every Quran Hifz milestone and attendance check is written instantly to device storage in under 5 milliseconds.",
      "A resilient background isolate polls for internet connectivity and synchronizes dirty state batches to the NestJS cloud backend via encrypted HTTPS webhooks.",
      "Automated WhatsApp notification triggers are processed asynchronously through a Redis queue, guaranteeing 99.8% message delivery even during peak school hours.",
    ],
  },
];
