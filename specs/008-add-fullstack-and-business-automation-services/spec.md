# Feature Specification: Add Full Stack Development & Business Automation Services

**Feature ID:** `008-add-fullstack-and-business-automation-services`  
**Target Files:** `lib/data.ts`, `prisma/seed.ts`, `prisma/dev.db`, `components/home/ServicesAccordion.tsx`, `app/services/page.tsx`  
**Status:** In Progress / Implementation  
**Methodology:** Spec-Driven Development (SDD) via Spec Kit  

---

## 1. Requirement & User Intent
The user requested:
> "আচ্ছা শোনো, আমার সার্ভিসেস-এর জায়গায় কিছু আপডেট করতে হবে। ওখানে ফুল স্ট্যাক ডেভেলপমেন্ট এবং বিজনেস অটোমেশন অ্যাড করে দাও। এই দুইটা আপাতত অ্যাড করো আমার সার্ভিসেস-এর জায়গায়।  /speckit"

### Key Acceptance Criteria:
1. **Service 1: Full Stack Development (ফুল স্ট্যাক ডেভেলপমেন্ট)**
   - `id`: `"s7"`
   - `num`: `"07"`
   - `title`: `"Full Stack Development"`
   - `titleEn`: `"Full Stack Development"`
   - `titleBn`: `"ফুল স্ট্যাক ডেভেলপমেন্ট"`
   - `descriptionEn`: Architectural and production grade full stack web application development covering modern frontend architecture, microservice backends, real-time databases, and REST/GraphQL APIs.
   - `descriptionBn`: আধুনিক ফ্রন্টএন্ড আর্কিটেকচার, স্কেলেবল ব্যাকএন্ড মাইক্রোসার্ভিস, ক্লাউড ডাটাবেস ও সুরক্ষিত এপিআই সমন্বয়ে প্রডাকশন-গ্রেড ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন তৈরি।
   - `deliverables`: `["Next.js & React Frontends", "Node.js & NestJS Microservices", "PostgreSQL & Prisma Databases", "Secure REST & GraphQL APIs"]`
   - `icon`: `"Layers"`
   - `order`: `7`

2. **Service 2: Business Automation (বিজনেস অটোমেশন)**
   - `id`: `"s8"`
   - `num`: `"08"`
   - `title`: `"Business Automation"`
   - `titleEn`: `"Business Automation"`
   - `titleBn`: `"বিজনেস অটোমেশন"`
   - `descriptionEn`: Engineering bespoke business workflow automations, CRM synchronization, lead generation pipelines, and multi-app webhook orchestrations eliminating operational bottlenecks.
   - `descriptionBn`: ব্যবসার দৈনন্দিন ম্যানুয়াল কাজের চাপ কমাতে কাস্টম ওয়ার্কফ্লো অটোমেশন, সিআরএম ডাটা সিঙ্ক, লিড প্রসেসিং এবং বিভিন্ন সফটওয়্যারের মাঝে স্বয়ংক্রিয় ইন্টিগ্রেশন।
   - `deliverables`: `["Custom Workflow Automation", "n8n & Zapier Pipelines", "CRM & ERP Integrations", "Automated Business Reporting"]`
   - `icon`: `"Workflow"`
   - `order`: `8`

3. **Database & Codebase Synchronization:**
   - Update `defaultServices` in `lib/data.ts`.
   - Update `servicesData` in `prisma/seed.ts`.
   - Insert/Upsert new services into SQLite database `prisma/dev.db` via Prisma Client.
   - Update `fallbackServiceItems` in `components/home/ServicesAccordion.tsx`.
   - Ensure `iconMap` in `app/services/page.tsx` supports `Layers` and `Workflow` (plus `Bot` and `Code`).

4. **Safety & Zero-Regression Constraints:**
   - Do not alter or break existing services (s1 to s6).
   - Do not modify or break any other portfolio features, client links, or styles.
   - Verify build integrity with `npm run build` and `npm run lint`.
   - Commit cleanly and push to GitHub `main` to trigger automated Vercel deployment.
