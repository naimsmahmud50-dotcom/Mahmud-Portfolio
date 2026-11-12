# Feature Specification: Main Portfolio Evolution & Production Mastery

## 1. Problem Statement
The current portfolio is high-craft in design and motion, but has critical blockers preventing it from being Mahmud Hasan's primary, high-converting portfolio:
1. **Broken Custom Domain & Canonical SEO:** Hardcoded `https://mahmudhasan.dev` causes DNS `NXDOMAIN` errors and broken social previews, while the actual live deployment is `https://mahmud-portfolio-flame.vercel.app`.
2. **Ephemeral SQLite Database on Vercel:** Next.js deployed on Vercel runs in serverless functions where SQLite (`file:./dev.db`) and local file uploads (`/public/uploads`) cannot persist across serverless instances or cold starts. Client inquiries and admin edits fail or get erased.
3. **Missing Conversion Drivers for High-Ticket Clients:** Technical clients and international AI agencies need direct meeting scheduling (Cal.com/Calendly), interactive proof-of-work (interactive AI agent pipeline visualizer), one-click downloadable CV, and video case studies rather than simple GitHub repo links.

## 2. Goals & Success Criteria
1. **Cloud Persistence (Turso / Neon Postgres + Vercel Blob / Cloudinary):**
   - Provide persistent database storage so admin edits, site settings, and contact inquiries are safely stored in production without data loss.
   - Cloud storage for portfolio image uploads.
2. **Dynamic Domain & SEO Modernization:**
   - Base URL dynamically falls back to `process.env.NEXT_PUBLIC_SITE_URL` (defaulting to the working Vercel URL `https://mahmud-portfolio-flame.vercel.app` until a custom domain is verified).
   - Dynamic OpenGraph image generator (`@vercel/og`), valid Sitemap, and Robots.txt.
3. **Interactive Proof-of-Work & Case Study Elevators:**
   - Video walkthrough modals / live interactive previews for all 8 featured projects.
   - Interactive AI Architecture & Agent Pipeline Playground on the homepage highlighting Mahmud's core specialty (AI Automation Architect).
4. **Lead Conversion Engine:**
   - Direct "Book a Strategy Call" (Cal.com / Calendly popup modal).
   - Downloadable ATS-friendly PDF CV button with download counter.
   - Instant Telegram webhook alert on every incoming contact form message or chat inquiry.
   - AI Chatbot upgrade with autonomous lead capture and intelligent project scoping.

## 3. Non-Goals / Out of Scope
- Building a complex multi-tenant SaaS billing platform.
- Replacing the Dennis Snellenberg motion aesthetic (the luxury look is already excellent).

## 4. User Scenarios & Acceptance Criteria
- **Scenario 1 (Domain & Social Preview):** When a prospective client or recruiter shares the portfolio link on LinkedIn, Twitter, or WhatsApp, accurate OpenGraph metadata and images render without 404 or NXDOMAIN errors.
- **Scenario 2 (Contact & Admin Persistence):** When a visitor submits the contact form or Mahmud updates project ordering in `/admin`, data persists permanently in cloud storage and triggers an instant Telegram notification.
- **Scenario 3 (High-Intent Conversion):** A visitor wanting to hire Mahmud can click "Book a Discovery Call" to schedule a meeting directly, or click "Download CV" to get his latest resume.
