# Implementation Tasks: Main Portfolio Evolution

## Phase 1: Critical Fixes & Production Foundations
- [ ] **Task 1.1: Fix Canonical URLs & OpenGraph Metadata**
  - Update `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, and `content/index.ts` to dynamically use `process.env.NEXT_PUBLIC_SITE_URL || 'https://mahmud-portfolio-flame.vercel.app'`.
  - Fix broken meta tags that previously pointed to `https://mahmudhasan.dev`.
- [ ] **Task 1.2: Database Persistence Migration (Turso / Neon Postgres)**
  - Update `lib/prisma.ts` and Prisma schema to support durable cloud database connection strings for Vercel.
  - Export seed data and migrate live data to cloud database.
- [ ] **Task 1.3: Real-Time Telegram Lead Notification**
  - Add Telegram Bot webhook dispatcher in `app/api/contact/route.ts` to immediately ping Mahmud on Telegram whenever a client sends a message.

## Phase 2: High-Ticket Conversion & Credibility Drivers
- [ ] **Task 2.1: Download CV / Resume Button**
  - Add Mahmud's latest CV to `/public/resume/Mahmud_Hasan_CV.pdf` and wire a download trigger in Header & Hero.
- [ ] **Task 2.2: Book a Strategy Call Modal (Cal.com / Calendly)**
  - Integrate a sleek modal for 1-click meeting scheduling in the Hero and Contact sections.
- [ ] **Task 2.3: Interactive AI Architecture & Agent Pipeline Visualizer**
  - Build an interactive, animated diagram on the homepage demonstrating Mahmud's Autonomous Agent pipeline (Stealth Scraping -> LLM Reasoning -> Telegram Human-in-the-Loop -> Task Execution).

## Phase 3: Case Study & Interactive Polish
- [ ] **Task 3.1: Video / Live Demo Modals for Case Studies**
  - Enable embedded demo video players or interactive iframe previews inside project modals so visitors don't just see GitHub links.
- [ ] **Task 3.2: AI Chatbot Lead Qualification Upgrade**
  - Upgrade `app/api/chat/route.ts` with autonomous intent recognition (e.g. asking budget, timeline, booking call).
- [ ] **Task 3.3: Custom Domain DNS Setup Guide**
  - Document the exact DNS records to point `mahmudhasan.dev` to Vercel when ready.
