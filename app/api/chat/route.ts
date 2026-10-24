import { NextResponse } from "next/server";

// In-memory sliding window rate limiter (IP -> timestamps array)
const chatRateLimitMap = new Map<string, number[]>();
const CHAT_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CHAT_REQUESTS_PER_WINDOW = 12;

const MAHMUD_SYSTEM_PROMPT = `
You are the official, truthful AI Assistant for Mahmud Hasan's personal portfolio.
You must answer questions strictly based on the following verified facts about Mahmud Hasan. DO NOT invent, hallucinate, or assume any facts, client names, dates, or capabilities not explicitly mentioned below.

ABOUT MAHMUD HASAN:
- Role: AI Automation Architect & Full-Stack Software Engineer
- Location: Dhaka, Bangladesh (UTC+6 / GMT+6)
- Core disciplines: Autonomous Multi-Agent Swarms, Full-Stack Web Development, Cross-Platform Android/Mobile Architecture, Desktop Endpoint Security.
- Engineering philosophy: Speed, zero bloat, strict type safety, 60fps interaction craft inspired by Dennis Snellenberg, long-term durability.

TECHNICAL ARSENAL:
- Web: Next.js 14/15 App Router, React Server Components (RSC), TypeScript, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, Lenis Smooth Scroll.
- Mobile: Flutter, Dart, offline-first SQLite / Hive local caching, Riverpod / BLoC state management, native camera & hardware sensors.
- Backend & Data: NestJS, Node.js, PostgreSQL, Prisma ORM, Supabase, Redis, RESTful API design, secure Server Actions.
- AI & Automation: Python, LangChain, LangGraph multi-agent workflows, Playwright headless browser automation, LLM function calling, RAG pipelines, Meta Graph API webhooks.
- Systems: C#, .NET, Tauri, Rust, Win32 API system daemons, Linux server administration, Docker.

VERIFIED PRODUCTION PROJECTS:
1. Madrasah Management Ecosystem (Institutional SaaS & Android Mobile)
   - Scope: Deployed across 15+ Islamic institutions in Bangladesh, serving 3,500+ active students.
   - Stack: NestJS, PostgreSQL, Flutter mobile app, WhatsApp API for automated fee receipts & attendance alerts, offline SQLite cache.
2. Secure My PC (Desktop Endpoint Security Watchdog)
   - Scope: Low-overhead background process running on Windows.
   - Stack: C#, Win32 APIs, Tauri, Rust. Sub-50ms heuristic intercept, automated USB auto-quarantine vault, <2% CPU usage.
3. Autonomous Client Acquisition Multi-Agent Engine
   - Scope: Self-orchestrating multi-agent state graph that identifies, enriches, and initiates bespoke outreach to enterprise prospects.
   - Stack: Python, LangChain, Playwright, Redis, PostgreSQL, DNS MX-record verification.
4. Maijrun-Teach Headless E-Commerce & Custom PC Builder
   - Scope: Hardware e-commerce with real-time component socket compatibility validation (CPU socket, TDP, DDR bandwidth).
   - Stack: Next.js 15, Medusa v1.20 headless commerce, Redis, PostgreSQL, bKash, Nagad, SSLCommerz, Steadfast/Pathao courier APIs.
5. Facebook & Social Commerce Automation Pipeline
   - Scope: Converts Facebook post comments and messages into leads with sub-second webhook response.
   - Stack: Meta Graph Webhook listeners, NLP intent classifier, randomized anti-ban delay timing, automatic Google Sheets/database sync.
6. Student Progress & Attendance Mobile App
   - Scope: Cross-platform mobile portal for real-time academic grading and attendance.
   - Stack: Flutter, Dart, SQLite offline-first sync.
7. Multi-Currency Travel Booking Engine
   - Scope: Real-time ticket reservation portal with dynamic PDF boarding passes.
   - Stack: Next.js App Router, Tailwind CSS, dynamic currency converter.

DIRECT CONTACT & CHANNELS:
- Email: mahmudhasan.infodev@gmail.com
- WhatsApp: +880 1767-850859 (https://wa.me/8801767850859)
- Telegram: +880 1767-850859 (https://t.me/naimsmahmud50)
- GitHub: https://github.com/naimsmahmud50-dotcom
- LinkedIn: https://www.linkedin.com/in/mahmud-hasan-687908269?utm_source=share_via&utm_content=profile&utm_medium=member_android

RESPONSE GUIDELINES:
- Keep answers concise, highly professional, confident, and direct.
- Match the user's language (reply in Bengali if the user writes in Bengali; reply in English if in English).
- If asked about hiring or contacting Mahmud, always provide his direct WhatsApp, Telegram, and email.
- NEVER invent hypothetical facts or fake metrics.
`;

const CONTACT_INFO_EN = `
You can contact Mahmud Hasan directly through his verified channels:

• 💬 **WhatsApp:** [+880 1767-850859](https://wa.me/8801767850859)
• ✈️ **Telegram:** [+880 1767-850859](https://t.me/naimsmahmud50)
• ✉️ **Direct Email:** [mahmudhasan.infodev@gmail.com](mailto:mahmudhasan.infodev@gmail.com)
• 💼 **LinkedIn:** [Mahmud Hasan on LinkedIn](https://www.linkedin.com/in/mahmud-hasan-687908269?utm_source=share_via&utm_content=profile&utm_medium=member_android)
• ⚡ **GitHub:** [naimsmahmud50-dotcom](https://github.com/naimsmahmud50-dotcom)

Mahmud typically responds within 1 to 2 hours.`;

const CONTACT_INFO_BN = `
মাহমুদ হাসানের সাথে সরাসরি প্রজেক্ট বা কাজের ব্যাপারে আলোচনা করতে নিচের মাধ্যমে যোগাযোগ করতে পারেন:

• 💬 **হোয়াটসঅ্যাপ:** [+880 1767-850859](https://wa.me/8801767850859)
• ✈️ **টেলিগ্রাম:** [+880 1767-850859](https://t.me/naimsmahmud50)
• ✉️ **ইমেইল:** [mahmudhasan.infodev@gmail.com](mailto:mahmudhasan.infodev@gmail.com)
• 💼 **লিঙ্কডইন:** [Mahmud Hasan LinkedIn](https://www.linkedin.com/in/mahmud-hasan-687908269?utm_source=share_via&utm_content=profile&utm_medium=member_android)
• ⚡ **গিটহাব:** [github.com/naimsmahmud50-dotcom](https://github.com/naimsmahmud50-dotcom)

তিনি সাধারণত ১ থেকে ২ ঘণ্টার মধ্যেই নতুন ইনকোয়ারির উত্তর দেন।`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Strict Input Sanitization & Length Limits
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const trimmed = message.trim();
    if (trimmed.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (trimmed.length > 500) {
      return NextResponse.json(
        { error: "Message is too long (maximum 500 characters)." },
        { status: 400 }
      );
    }

    // 2. Sliding-Window Rate Limiting (12 requests / 5 minutes per IP)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    const now = Date.now();
    const timestamps = (chatRateLimitMap.get(ip) || []).filter(
      (t) => now - t < CHAT_RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= MAX_CHAT_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          error:
            "Rate limit reached. Please wait a few moments before asking another question.",
        },
        { status: 429 }
      );
    }

    timestamps.push(now);
    chatRateLimitMap.set(ip, timestamps);

    const isBengali = /[\u0980-\u09FF]/.test(trimmed);

    // 3. Optional: Live LLM Call via Google Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: MAHMUD_SYSTEM_PROMPT },
                    { text: `User Question: ${trimmed}` },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.2, // Low temperature for high factual accuracy
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedReply =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedReply) {
            return NextResponse.json({ reply: generatedReply });
          }
        }
      } catch (geminiErr) {
        console.error("[Chat API] Gemini invocation failed, falling back to deterministic engine:", geminiErr);
      }
    }

    // 4. Deterministic Fact-Engine Fallback (Always accurate, zero hallucinations)
    const lower = trimmed.toLowerCase();

    // Inquiries / Hiring / Contact
    const hireKeywords = [
      "hire", "contact", "work together", "collaborate", "price", "pricing",
      "cost", "budget", "quote", "meeting", "call", "schedule", "talk", "email",
      "whatsapp", "telegram", "linkedin", "phone", "available", "contract",
      "হায়ার", "যোগাযোগ", "কাজের কথা", "কথা বলতে চাই", "দাম", "খরচ", "বাজেট",
    ];

    if (hireKeywords.some((k) => lower.includes(k))) {
      const reply = isBengali
        ? `মাহমুদ হাসান নতুন ক্লায়েন্ট প্রজেক্ট, হাই-ইমপ্যাক্ট ফুলস্ট্যাক সফটওয়্যার এবং এআই অটোমেশন আর্কিটেকচারের জন্য এভেইলেবল আছেন।\n\n${CONTACT_INFO_BN}`
        : `Mahmud Hasan is currently open for bespoke software contracts, AI automation engineering, and fullstack Next.js/Flutter projects.\n\n${CONTACT_INFO_EN}`;
      return NextResponse.json({ reply });
    }

    // Madrasah Ecosystem
    if (
      lower.includes("madrasah") ||
      lower.includes("hifz") ||
      lower.includes("quran") ||
      lower.includes("মাদরাসা")
    ) {
      const reply = isBengali
        ? `**মাদরাসা ইকোসিস্টেম সফটওয়্যার (Madrasah Ecosystem):**\n\n• **আর্কিটেকচার:** NestJS ব্যাকএন্ড ও PostgreSQL ডাটাবেসের সাথে Flutter ভিত্তিক মোবাইল অ্যাপ এবং রিয়েল-টাইম অ্যাডমিন ড্যাশবোর্ড।\n• **বাস্তব প্রয়োগ:** বাংলাদেশের ১৫টিরও বেশি প্রতিষ্ঠানে ৩৫০০+ শিক্ষার্থীর একাডেমিক ও আর্থিক কার্যক্রম পরিচালনা করছে।\n• **মূল ফিচার:** হিফজ ট্র্যাকার, স্বয়ংক্রিয় হোয়াটসঅ্যাপ ফি নোটিফিকেশন এবং অফলাইন-ফার্স্ট ক্যাশিং।\n\n🔗 **কেস স্টাডি:** [Explore Case Study](/work/madrasah-ecosystem)`
        : `**Madrasah Ecosystem Software:**\n\n• **Architecture:** Event-driven NestJS & PostgreSQL backend connected to high-performance Flutter mobile apps and real-time administrative dashboards.\n• **Production Scale:** Deployed across 15+ Islamic institutions in Bangladesh, serving 3,500+ active students.\n• **Core Highlights:** Surah/Ayah memorization tracker, automated WhatsApp payment receipts, and offline SQLite synchronization.\n\n🔗 **Explore Case Study:** [View Case Study](/work/madrasah-ecosystem)`;
      return NextResponse.json({ reply });
    }

    // Secure My PC
    if (
      lower.includes("secure my pc") ||
      lower.includes("security") ||
      lower.includes("desktop") ||
      lower.includes("নিরাপত্তা") ||
      lower.includes("পিসি")
    ) {
      const reply = isBengali
        ? `**Secure My PC (এন্ডপয়েন্ট সিকিউরিটি ও ডেমোন):**\n\n• **প্রযুক্তি:** C#, Win32 APIs, Tauri ও Rust।\n• **কার্যক্ষমতা:** উইন্ডোজ সিস্টেমে ব্যাকগ্রাউন্ডে নীরবে চলে, ৫০ মিলিসেকেন্ডের মধ্যে ক্ষতিকর ইউএসবি শনাক্ত করে কোয়ারান্টাইন করে এবং মাত্র ২% সিপিইউ ব্যবহার করে।\n\n🔗 **কেস স্টাডি:** [Explore Case Study](/work/secure-my-pc)`
        : `**Secure My PC (Desktop Endpoint Security Daemon):**\n\n• **Tech Stack:** C#, Win32 APIs, Tauri, Rust.\n• **Performance:** Sub-50ms heuristic intercept, automated USB auto-quarantine vault, and one-click panic mode running at under 2% CPU overhead.\n\n🔗 **Explore Case Study:** [View Case Study](/work/secure-my-pc)`;
      return NextResponse.json({ reply });
    }

    // AI & Automation / Agent
    if (
      lower.includes("agent") ||
      lower.includes("ai") ||
      lower.includes("swarm") ||
      lower.includes("automation") ||
      lower.includes("এআই") ||
      lower.includes("অটোমেশন")
    ) {
      const reply = isBengali
        ? `**এআই ও অটোনোমাস অটোমেশন আর্কিটেকচার:**\n\n• **দক্ষতা:** Python, LangChain, LangGraph মাল্টি-এজেন্ট স্টেট গ্রাফ, Playwright ব্রাউজার অটোমেশন, RAG এবং মেটা গ্রাফ এপিআই ইন্টিগ্রেশন।\n• **প্রয়োগ:** স্বয়ংক্রিয় ক্লায়েন্ট একুইজিশন, ফেসবুক পেজ ও কমেন্ট অটোমেশন এবং এন্টারপ্রাইজ ডাটা স্ক্র্যাপিং।\n\n🔗 **কেস স্টাডি:** [Autonomous AI Agent](/work/autonomous-ai-agent)`
        : `**AI & Autonomous Automation Architecture:**\n\n• **Capabilities:** Python, LangChain, LangGraph multi-agent state graphs, Playwright headless browser automation, tool-calling LLM workflows, and Meta Graph API webhooks.\n• **Production Use:** Autonomous lead enrichment, high-throughput social selling on Meta, and self-healing data scrapers.\n\n🔗 **Explore Case Study:** [Autonomous AI Agent](/work/autonomous-ai-agent)`;
      return NextResponse.json({ reply });
    }

    // Default Fallback
    const fallbackReply = isBengali
      ? `আমি মাহমুদ হাসানের অফিশিয়াল এআই সহকারী। মাহমুদ হাসান বাংলাদেশের একজন অভিজ্ঞ ফুলস্ট্যাক ইঞ্জিনিয়ার ও এআই অটোমেশন আর্কিটেক্ট।\n\nআপনি মাহমুদের তৈরি প্রজেক্ট (মাদরাসা ইকোসিস্টেম, Secure My PC, এআই এজেন্ট, ফেসবুক অটোমেশন), তার টেক স্ট্যাক বা সরাসরি যোগাযোগ সম্পর্কে জানতে পারেন।\n\n${CONTACT_INFO_BN}`
      : `I am Mahmud Hasan's AI Assistant. Mahmud is an AI Automation Architect, Full-Stack Next.js Developer, and Flutter Specialist based in Bangladesh.\n\nYou can ask about his production projects (Madrasah Ecosystem, Secure My PC, Autonomous AI Agent, Facebook Automation), technical stack, or collaboration details.\n\n${CONTACT_INFO_EN}`;

    return NextResponse.json({ reply: fallbackReply });
  } catch (error) {
    console.error("[Chat API] Unexpected error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
