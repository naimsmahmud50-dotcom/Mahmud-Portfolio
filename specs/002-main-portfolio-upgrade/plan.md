# Technical Implementation Plan: Main Portfolio Evolution & Production Mastery

## 1. Technical Context & Architecture Overview
- **Framework:** Next.js 14.2 (App Router, Server Components + Selective Client Components).
- **Styling & Physics:** Tailwind CSS, Framer Motion 14, GSAP 3.15 ScrollTrigger, Lenis.
- **Database & Persistence:**
  - Transition from local SQLite (`dev.db`) to **Turso (LibSQL)** or **Neon Serverless Postgres** using Prisma.
  - Image uploads via `@vercel/blob` or Cloudinary instead of ephemeral local disk `/public/uploads/`.
- **Domain Configuration:**
  - Dynamic canonical URL resolver: `getSiteUrl()` checking `NEXT_PUBLIC_SITE_URL` -> `VERCEL_URL` -> fallback `https://mahmud-portfolio-flame.vercel.app`.
  - Step-by-step DNS record guide for connecting custom domain `mahmudhasan.dev` to Vercel (CNAME `cname.vercel-dns.com` / A Record `76.76.21.21`).

## 2. Phase 0: Research & Key Technical Decisions
- **Decision 1: Database Migration Strategy:**
  - *Choice:* Turso (LibSQL via `@prisma/adapter-libsql` or `@libsql/client`) or Neon Postgres.
  - *Rationale:* Zero cold-start latency, free tier with generous limits, zero infrastructure maintenance, and 100% compatible with Vercel Edge/Serverless.
- **Decision 2: Meeting Booking Integration:**
  - *Choice:* `Cal.com` embed (React package `@calcom/embed-react` or lightweight vanilla script modal).
  - *Rationale:* Open-source, clean dark-mode styling that integrates directly with Google Calendar without brand clash.
- **Decision 3: Real-Time Alerts for Inquiries:**
  - *Choice:* Telegram Bot Webhook API in `app/api/contact/route.ts`.
  - *Rationale:* Instant push notification directly to Mahmud's phone via Telegram (`@naimsmahmud50`), ensuring under 5-minute client response time.

## 3. Phase 1: High-Impact Upgrade Modules

### Module A: Production Infrastructure & Persistence
1. `lib/utils/url.ts`: Centralized site URL helper avoiding broken hardcoded domain.
2. `lib/prisma.ts`: Cloud connection string support for Turso/Neon with local SQLite fallback for offline development.
3. `app/api/upload/route.ts`: Cloud storage adapter for image uploads in production.

### Module B: Lead Conversion & Credibility
1. **Interactive AI Agent Workflow Playground:**
   - Visual interactive component on the homepage showcasing an Autonomous Agent Architecture (Playwright Stealth -> Gemini Vision -> Telegram Controller -> SQLite Memory).
2. **Book a Strategy Call (Cal.com Modal):**
   - Floating action or Hero secondary button triggering a clean dark modal to book 15-min discovery calls.
3. **Downloadable CV / Resume:**
   - Link to optimized ATS PDF resume stored in `/public/resume/Mahmud_Hasan_CV.pdf` with download tracking.
4. **Instant Telegram Lead Dispatcher:**
   - Send notification with client name, email, budget, message, and timestamp to Mahmud's Telegram chat ID.

### Module C: Case Study Depth & Multimedia
1. Add video demonstration modal support in `FeaturedProjects.tsx` and `/work/[slug]`.
2. Display quantifiable client impact metrics (e.g., "$15k+ revenue generated", "99.8% automation accuracy").

## 4. Verification & Testing Checklist
- [ ] Vercel build passes with zero TypeScript or Lint warnings.
- [ ] Contact form submission saves to cloud DB and sends Telegram + Email alerts.
- [ ] Social share card (OpenGraph) renders preview on WhatsApp, LinkedIn, and Twitter using live Vercel URL.
- [ ] Admin panel CRUD (adding/editing projects) persists across new browser sessions and Vercel redeployments.
- [ ] Mobile responsive audit on Chrome DevTools (375px, 390px, 412px, 768px, 1440px).
