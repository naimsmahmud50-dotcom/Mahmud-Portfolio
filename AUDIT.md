# Comprehensive System & Codebase Audit — Mahmud Hasan Portfolio
**Date of Audit:** October 23, 2026  
**Auditor:** Antigravity Engineering (Reverse Engineering, Spec-Kit, Strix Security Assessment)  
**Target Repository:** `/home/mahmud-hasan/Naims Project/fullstack Portfolio`

---

## 1. Executive Summary

The portfolio presents an **agency-grade visual aesthetic**, fluid 60fps animations (Lenis smooth scroll, GSAP ScrollTrigger, Framer Motion), and strict Dennis Snellenberg design tokens. 

However, beneath the visual presentation, **nearly all interactive, administrative, and backend features are "smoke and mirrors" (mockups, hardcoded data, or unconfigured stubs)**:
1. **Contact Form:** Looks fully functional and celebrates with confetti, but **does not actually deliver any emails** because no email provider API key (`RESEND_API_KEY`) is configured, and **does not save submitted inquiries anywhere** (leads disappear into the server `console.log`).
2. **Links & External Integrations:** Several critical URLs are **404 broken** (e.g. 3 out of 7 GitHub repository URLs return HTTP 404; all 7 project demo links point to `example.com` or dead domains; the Telegram link uses an invalid URL structure; the CV is a blank 317-byte placeholder).
3. **Admin Panel:** **0 out of 11 public site sections can be edited from the admin panel.** All cards, tables, charts, and metrics ("99.8% Uptime", "301 Redirects", "44% AI Interest") are static, hardcoded JSX.
4. **Backend & Storage:** **There is ZERO database or persistent storage** (no PostgreSQL, SQLite, Prisma, Supabase, or JSON file store). The app runs entirely stateless.
5. **Admin Authentication:** **Completely unprotected.** The admin passkey is hardcoded in plaintext in the client-side JavaScript bundle (`"mahmud2026"` / `"admin123"`), and access is gated only by a client-side `sessionStorage` flag that anyone can bypass in browser DevTools in one click.

---

## 2. Forensic Findings by Audit Question

### Q1. Contact Form: What happens on submit?
- **Frontend Submission Flow (`app/contact/page.tsx`):**
  - Validates inputs using `contactSchema.safeParse` (Zod).
  - Sends a `POST` request to `/api/contact` with JSON `{ name, email, service, message, tel }`.
  - On a 200 response, it shows "Inquiry Transmitted Successfully" and triggers celebratory confetti.
- **Backend API Route (`app/api/contact/route.ts`):**
  - **Honeypot:** Checks `body.tel`. If populated by a spam bot, returns fake 200 OK.
  - **Validation:** Server-side Zod check.
  - **Rate Limiting:** In-memory sliding window (5 req / 10 min per IP). Resets every time the server restarts.
  - **Email Service:** Uses the `resend` SDK, **BUT only if `process.env.RESEND_API_KEY` is present**.
  - **The Reality:** 
    - No `.env` or `.env.local` exists in the repository (only `.env.example`).
    - `RESEND_API_KEY` is `undefined`.
    - When a user submits an inquiry, the server executes `console.log("[Contact API] No RESEND_API_KEY configured. Running in simulated development mode...")` and returns `{ success: true }`.
    - **No email is ever sent.**
    - **No database or file records the inquiry.**
    - **The user thinks their message was delivered, but it is permanently lost.**

---

### Q2. Communications, Phone, Email & Social Links
Detailed audit of all exact `href` values across the application:

| Channel / Link | Exact `href` Value | Status | Finding / Analysis |
| :--- | :--- | :---: | :--- |
| **Email** | `mailto:mahmudhasan.infodev@gmail.com` | **Working** | Real personal address. Hardcoded redundantly in 6+ files. |
| **Phone** | `tel:+8801767850859` | **Working** | Real Bangladeshi phone number. |
| **WhatsApp** | `https://wa.me/8801767850859` | **Working** | Opens valid WhatsApp chat with +880 1767-850859. |
| **Telegram** | `https://t.me/+8801767850859` | **BROKEN** | **Invalid syntax.** In Telegram, `t.me/<username>` is for user chats, while `t.me/+<hash>` is strictly for private invite hashes. Clicking `t.me/+8801767850859` throws a Telegram error: *"The invite link is invalid or expired"*. Must be updated to a real Telegram username (e.g. `https://t.me/your_username`). |
| **GitHub Profile** | `https://github.com/naimsmahmud50-dotcom` | **Working** | Returns HTTP 200 OK. Profile exists. |
| **LinkedIn Profile** | `https://www.linkedin.com/in/mahmud-hasan-687908269...` | **Working** | Live public LinkedIn profile. |
| **CV Download** | `href="/cv.pdf"` | **Fake / Placeholder** | File exists at `public/cv.pdf`, but it is an empty 317-byte blank PDF containing no text, skills, or experience. |
| **Project 1 Demo** | `https://example.com/madrasah-demo` | **Fake** | Generic `example.com` placeholder. |
| **Project 1 GitHub** | `https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware` | **Working** | HTTP 200 OK (Public repo). |
| **Project 2 Demo** | `https://example.com/secure-my-pc` | **Fake** | Generic `example.com` placeholder. |
| **Project 2 GitHub** | `https://github.com/naimsmahmud50-dotcom/Pc-Secure-By-apps` | **BROKEN (404)** | HTTP 404 Not Found (Repository is private, renamed, or deleted). |
| **Project 3 Demo** | `https://example.com/ai-agent-demo` | **Fake** | Generic `example.com` placeholder. |
| **Project 3 GitHub** | `https://github.com/naimsmahmud50-dotcom/Linkdin-Automation-` | **BROKEN (404)** | HTTP 404 Not Found (Repository is private, renamed, or deleted). |
| **Project 4 Demo** | `https://travelwithmaijrun.com` | **BROKEN (Dead Domain)** | DNS resolution fails (Host not found). |
| **Project 4 GitHub** | `https://github.com/naimsmahmud50-dotcom/Travel-WIth-Maijrun` | **Working** | HTTP 200 OK (Public repo). |
| **Project 5 Demo** | `https://arabicclub.example.com` | **Fake** | Generic `example.com` placeholder. |
| **Project 5 GitHub** | `https://github.com/naimsmahmud50-dotcom/Arabic-Langualge-and-Cultural-Club` | **Working** | HTTP 200 OK (Public repo). |
| **Project 6 Demo** | `https://studentlifecircle.example.com` | **Fake** | Generic `example.com` placeholder. |
| **Project 6 GitHub** | `https://github.com/naimsmahmud50-dotcom/Student-Life-Circle` | **BROKEN (404)** | HTTP 404 Not Found (Repository is private, renamed, or deleted). |
| **Project 7 Demo** | `https://example.com/fb-automation` | **Fake** | Generic `example.com` placeholder. |
| **Project 7 GitHub** | `https://github.com/naimsmahmud50-dotcom/Facebook-Automation-` | **Working** | HTTP 200 OK (Public repo). |

*Note on GitHub Repositories:* The user's GitHub profile currently has other real public repositories that are NOT linked in the portfolio:
- `Maijrun-Teach` (`https://github.com/naimsmahmud50-dotcom/Maijrun-Teach`)
- `MindPulse` (`https://github.com/naimsmahmud50-dotcom/MindPulse`)
- `Make-Presentation` (`https://github.com/naimsmahmud50-dotcom/Make-Presentation`)

---

### Q3. Public Site Sections vs. Admin Panel Editability

The user requested a breakdown of every section of the public site and whether it can be edited from `/admin`:

| Section of Public Site | Admin Editability Status | Where Data is Actually Stored |
| :--- | :---: | :--- |
| **1. Hero Section** (Heading, Tagline, Location, Intro) | **Hardcoded in code** | Hardcoded in `components/home/Hero.tsx` & `content/messages.ts`. Zero admin controls. |
| **2. About Page** (Story, Philosophy, Bio) | **Hardcoded in code** | Hardcoded in `app/about/page.tsx` & `components/home/AboutPreview.tsx`. Zero admin controls. |
| **3. Skills & Arsenal** (AI, Web, Mobile, Systems) | **Hardcoded in code** | Hardcoded static clusters in `app/about/page.tsx`. Zero admin controls. |
| **4. Projects Catalog** (7 Case Studies) | **Hardcoded in code** | Stored in static TS files (`data/projects.ts` and duplicate `content/projects.ts`). Admin panel displays a **read-only `<table>`** with a "View" link only. No create, edit, reorder, or delete actions exist. |
| **5. Services** (6 Core Capabilities) | **Hardcoded in code** | Hardcoded in `app/services/page.tsx` & `components/home/ServicesAccordion.tsx`. Zero admin controls. |
| **6. Testimonials** | **Hardcoded in code** | Hardcoded quotes and names in `components/home/Testimonials.tsx`. Zero admin controls. |
| **7. Experience / Timeline** | **Hardcoded in code** | Hardcoded static milestones in `app/about/page.tsx`. Zero admin controls. |
| **8. Contact Information** (Email, Phone, Location) | **Hardcoded in code** | Hardcoded redundantly in `Footer.tsx`, `contact/page.tsx`, `Hero.tsx`, `ChatWidget.tsx`, `api/contact/route.ts`. Zero admin controls. |
| **9. Social Links** (GitHub, LinkedIn, WhatsApp, Telegram) | **Hardcoded in code** | Hardcoded in arrays in `Footer.tsx`, `contact/page.tsx`, and `content/site.ts`. Zero admin controls. |
| **10. SEO & Meta** (OG Tags, Descriptions, JSON-LD) | **Hardcoded in code** | Hardcoded in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts`. Zero admin controls. |
| **11. Site Settings** (Theme, I18n strings, Ticker) | **Hardcoded in code** | Hardcoded in `content/messages.ts`, `tokens.css`, `globals.css`. Zero admin controls. |

#### What does `/admin` actually contain?
1. **Projects Tab:** A static HTML table mapping over `@/data/projects`. No edit, delete, or add buttons.
2. **Leads Tab:** A static text box saying *"Inquiry Pipeline Online... All form submissions are sanitized..."*. Does **NOT** display submitted messages or contact entries.
3. **Retour Tab:** Three static cards displaying hardcoded numbers: *"TOTAL CAUGHT 404s: 0"*, *"ACTIVE 301 REDIRECTS: 3"*, *"HONEYPOT BOT TRAPS: 100%"*. There is no actual redirect engine or 404 interceptor behind this.
4. **Analytics Tab:** Three static progress bars displaying hardcoded percentages: *"AI Automation 44%"*, *"Fullstack Web 32%"*, *"Android & Mobile 24%"*.

---

### Q4. Backend, Databases & API Routes
- **Database / Persistent Storage:**
  - **Status:** **NON-EXISTENT.**
  - There is no database installed (no Prisma, Drizzle, Mongoose, Supabase, or PostgreSQL).
  - There are no local storage JSON files.
  - The application is 100% stateless.
- **Inventory of API Routes:**
  1. `app/api/contact/route.ts`:
     - **Status:** Partially real / Unconnected.
     - Performs honeypot trap check and server-side Zod validation.
     - Does in-memory rate limiting.
     - **Missing:** Resend email credentials, Upstash Redis credentials, Telegram bot credentials, database lead saving.
  2. `app/api/chat/route.ts`:
     - **Status:** Working via deterministic fallback / Unconnected LLM.
     - Checks `GEMINI_API_KEY`. Because no `.env` exists, it falls back to a regex keyword matcher responding with pre-written answers about Mahmud's projects.
  3. `app/api/admin/*`:
     - **Status:** **NON-EXISTENT.**
     - There are zero backend API endpoints for authentication, project management, lead viewing, or telemetry.

---

### Q5. Admin Authentication & Security (Strix Pentest Findings)
The admin panel security was evaluated using Strix authentication and authorization vulnerability testing patterns:

1. **CWE-798: Use of Hard-coded Credentials (CRITICAL)**
   - **File:** `app/admin/login/page.tsx:16`
   - **Flaw:** The admin login handler contains:
     ```ts
     if (passcode === "mahmud2026" || passcode === "admin123") {
       sessionStorage.setItem("mahmud_admin_auth", "true");
       router.push("/admin");
     }
     ```
   - **Impact:** Any visitor who inspects the client-side JavaScript chunk in Chrome DevTools can search for `sessionStorage` or `admin_auth` and read the plaintext passcodes directly.
2. **CWE-306: Missing Authentication for Critical Function (CRITICAL)**
   - **File:** `app/admin/page.tsx:23`
   - **Flaw:** Protection relies solely on a client-side `useEffect` reading `sessionStorage.getItem("mahmud_admin_auth")`.
   - **Impact:** Any user can open the browser console on any page and execute:
     ```js
     sessionStorage.setItem("mahmud_admin_auth", "true");
     window.location.href = "/admin";
     ```
     This bypasses authentication instantly without ever typing a password.
3. **CWE-693: Protection Mechanism Failure — Missing Server Middleware (HIGH)**
   - **Flaw:** There is no Next.js `middleware.ts` protecting `/admin`.
   - **Impact:** The Next.js production server serves the complete pre-rendered `/admin` HTML and all client component bundles over HTTP to any unauthenticated GET request.

---

## 3. Master Findings Table

| # | Feature / Area | Current Status | File Path | Fix Needed |
| :-: | :--- | :---: | :--- | :--- |
| **1** | Contact Form Email Dispatch | **Fake / Stub** | `app/api/contact/route.ts` | Create `.env.local`, set valid `RESEND_API_KEY` & `CONTACT_EMAIL_TO`, or integrate an alternative SMTP/webhook. |
| **2** | Contact Inquiries Storage | **Missing** | `app/api/contact/route.ts` | Inquiries are currently lost. Persist submissions to a database (Supabase, PostgreSQL, SQLite) or local JSON store so they can be viewed in `/admin`. |
| **3** | Telegram DM Link | **Broken** | `components/Footer.tsx`<br>`app/contact/page.tsx`<br>`content/site.ts` | Replace `https://t.me/+8801767850859` with real Telegram username format (e.g. `https://t.me/<username>`). |
| **4** | GitHub Project Links (404s) | **Broken** | `data/projects.ts` | Fix 3 broken 404 links: `Pc-Secure-By-apps`, `Linkdin-Automation-`, and `Student-Life-Circle` (rename or point to real active repos like `Maijrun-Teach` or `MindPulse`). |
| **5** | Project Live Demo URLs | **Fake / Broken** | `data/projects.ts` | All 7 demos point to `example.com` or dead domains (`travelwithmaijrun.com`). Replace with real live deployments, Vercel preview links, or remove `demoUrl` when no live deployment exists. |
| **6** | CV / Resume Download | **Fake / Placeholder** | `public/cv.pdf` | Replace the 317-byte empty blank PDF with Mahmud's actual resume or a professionally formatted portfolio PDF summary. |
| **7** | Admin Authentication | **Broken / Insecure** | `app/admin/login/page.tsx`<br>`app/admin/page.tsx` | Remove client-side passkeys. Implement Next.js `middleware.ts` with encrypted HTTP-only session cookies and server-side password verification. |
| **8** | Admin Projects Editability | **Hardcoded / Read-Only** | `app/admin/page.tsx` | The admin table only renders static data. Add CRUD actions (Create, Edit, Delete, Reorder) backed by API routes and persistent storage. |
| **9** | Admin Leads Inbox | **Fake Mockup** | `app/admin/page.tsx` | Currently shows a static placeholder note. Build a real inquiries inbox that fetches stored submissions from the backend and lets Mahmud mark them as read/replied. |
| **10** | Admin Retour & Telemetry | **Fake Mockup** | `app/admin/page.tsx` | Charts and 404 counts are hardcoded numbers. Wire up real Next.js analytics/telemetry or replace with genuine system metrics. |
| **11** | Public Site Content Sync | **Hardcoded** | Entire `app/` & `components/` | All 11 public site sections are static code. Centralize site content in a structured store (e.g. SQLite/JSON/DB) so editing in admin updates the live site. |
| **12** | Redundant Data Duplication | **Hardcoded Conflict** | `data/projects.ts` vs `content/projects.ts`<br>`app/blog/` vs `app/notes/` | Duplicate files and duplicate blog/notes routes exist. Consolidate into a single source of truth. |
| **13** | AI Chat Widget Backend | **Fallback Mode** | `app/api/chat/route.ts` | Configure `GEMINI_API_KEY` in `.env.local` to enable real-time conversational AI responses rather than hardcoded keyword matching. |

---

## 4. Recommended Fix Order (Prioritized Roadmap)

To transform this portfolio from a visual prototype into a fully functional, secure, production-grade system, follow this sequence:

### Phase 1: Security & Auth Hardening (Immediate Priority)
1. **Fix Admin Authentication:**
   - Remove plaintext passwords from `app/admin/login/page.tsx`.
   - Store hashed master admin secret in `.env.local` (`ADMIN_PASSWORD_HASH` or `ADMIN_SECRET`).
   - Create a secure server-side login endpoint (`/api/admin/login`) that sets an encrypted, `HttpOnly`, `SameSite=Strict` session cookie.
   - Add Next.js `middleware.ts` to block unauthenticated server requests to `/admin/*` before any HTML is sent to the client.

### Phase 2: Broken External Links & Data Hygiene
2. **Fix Telegram Link:** Update `https://t.me/+8801767850859` to Mahmud's actual Telegram username.
3. **Fix GitHub 404 Links in `data/projects.ts`:**
   - Either make the 3 private repos public, fix repository slugs, or link Mahmud's existing public projects (`Maijrun-Teach`, `MindPulse`).
   - Remove or replace fake `example.com` demo links so visitors don't hit dead ends.
4. **Replace CV Placeholder:** Provide a real PDF document at `public/cv.pdf`.
5. **Consolidate Duplicate Data:** Merge `data/projects.ts` and `content/projects.ts`; merge `/blog` and `/notes` into one canonical path.

### Phase 3: Contact Form & Real Lead Pipeline
6. **Set up `.env.local`:** Configure `RESEND_API_KEY` and `CONTACT_EMAIL_TO` so client inquiries actually land in Mahmud's inbox.
7. **Lead Persistence:**
   - Implement lightweight persistent storage (e.g. SQLite via Prisma, local encrypted JSON, or Supabase) so all inquiries are preserved regardless of email delivery status.
   - Wire Telegram bot credentials (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) for instant mobile notifications.

### Phase 4: Dynamic Admin Panel
8. **Real Leads Inbox in `/admin`:** Allow Mahmud to log into `/admin` and view every received inquiry, see timestamps, read messages, and mark them handled.
9. **Real Project & Content Management:** Enable creating, editing, and toggling visibility of projects and public content directly from the admin deck.

### Phase 5: AI Chat Widget Enhancement
10. **Enable Google Gemini API:** Add `GEMINI_API_KEY` to `.env.local` for dynamic, context-aware AI conversations about Mahmud's work.

---
*Audit complete. Awaiting user review and authorization to proceed with implementation.*
