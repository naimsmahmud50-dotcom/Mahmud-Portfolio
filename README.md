# ⚡ Mahmud Hasan — Award-Grade Editorial Portfolio & Custom CMS

<div align="center">

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.6-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A high-craft editorial portfolio and autonomous content management system architected for Mahmud Hasan (AI Automation Architect & Full-Stack Developer, Dhaka, Bangladesh).**

[Live Showcase](https://mahmudhasan.dev) • [Case Studies](https://mahmudhasan.dev/work) • [Contact Mahmud](https://mahmudhasan.dev/contact)

</div>

---

## 🌟 Architecture & Motion Highlights

Modeled on modern luxury editorial aesthetics (inspired by *Dennis Snellenberg*, *Linear*, and *Awwwards Site of the Year* winners), engineered with **zero external template bloat** and **100% custom-crafted TypeScript modules**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MAHMUD HASAN PORTFOLIO                           │
├───────────────────────────────────┬─────────────────────────────────────────┤
│           PUBLIC CLIENT           │            FULLSTACK ENGINE             │
│  • Dennis Snellenberg Motion      │  • Next.js 14 App Router (RSC)          │
│  • Magnetic Physics & Cursor      │  • SQLite + Prisma ORM                  │
│  • Word-by-Word Scroll Illumination│ • Server Actions & REST API            │
│  • Multilingual (EN / বাংলা)      │  • Web Crypto HMAC Session Auth         │
│  • Zero-Flash Theme Engine        │  • Resend Anti-Spam Email Pipeline      │
└───────────────────────────────────┴─────────────────────────────────────────┘
```

### 1. Motion & Interaction Craft
* **Liquid Curved Boundaries**: Dynamic SVG Bezier curves that morph and flatten in real-time as users scroll past sections.
* **Magnetic Physics**: Every button, social link, and navigation element utilizes spring-mass-damper physics (`MagneticWrapper`).
* **Trailing Spring Cursor**: Custom cursor supporting `default`, `link`, `view` (88px bubble), and `drag` interactive states.
* **Preloader & Curtain Transitions**: Multilingual preloader cycling across international greetings with smooth Bezier curtain transitions between routes.
* **Hero Editorial Reveal**: Two-level split text animation (`Mahmud Hasan—`) with per-letter magnetic hover shifts and scroll parallax.

### 2. Fullstack Headless CMS & Admin Panel
* **Comprehensive 9-Section CRUD**: Manage `Site Settings`, `Hero`, `About`, `Skills`, `Projects`, `Services`, `Testimonials`, `Experience`, and `Messages Inbox`.
* **Zero-Lead-Loss Contact Pipeline**: 
  - Zod server-side schema verification.
  - Forensic Honeypot trap (`tel`) drops automated bots silently.
  - Sliding-window IP rate limiting (in-memory + Upstash Redis ready).
  - Messages auto-persisted to database before email dispatch via **Resend**.
* **Enterprise Security**:
  - Web Crypto API HMAC-SHA256 session token generation (Edge compatible).
  - `httpOnly`, `SameSite=Lax` secure session cookies.
  - Content Security Policy (CSP), `X-Frame-Options: DENY`, and strict input sanitization.

---

## 🛠️ Tech Stack & Tooling

| Domain | Technologies |
|---|---|
| **Core Framework** | Next.js 14.2 (App Router, Server Components) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling & Design Tokens** | Tailwind CSS 3.4, Custom CSS Variables (60/30/10 Rule) |
| **Motion Physics** | Framer Motion 14, GSAP 3.15 ScrollTrigger, Lenis Smooth Scroll |
| **Database & ORM** | SQLite (`dev.db`), Prisma ORM 6.4 |
| **Communication** | Resend API, Telegram Bot Webhooks |
| **Validation** | Zod 3.23 (Client & Server Schema Matching) |
| **Icons & Media** | Lucide React, Canvas Confetti |

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js**: `v18.18+` or `v20+`
* **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Clone Repository
```bash
git clone https://github.com/naimsmahmud50-dotcom/Mahmud-Portfolio.git
cd Mahmud-Portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the template configuration:
```bash
cp .env.example .env
```

Open `.env` and configure your credentials:
```env
DATABASE_URL="file:./dev.db"

# Admin Security Credentials
ADMIN_PASSWORD="your-strong-password"
ADMIN_SESSION_SECRET="your-64-char-random-secret"
ADMIN_COOKIE_NAME="mahmud_admin_session"

# Email Delivery (Resend.com)
RESEND_API_KEY="re_your_api_key_here"
CONTACT_EMAIL_TO="mahmudhasan.infodev@gmail.com"
CONTACT_FROM_EMAIL="onboarding@resend.dev"
```

### 4. Initialize Database & Seed Content
```bash
# Push schema to SQLite
npx prisma db push

# Seed initial verified content (Hero, Projects, Skills, Services)
npm run seed
```

### 5. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎛️ Content Management Capabilities

The portfolio includes an integrated private dashboard for authenticated site administration:
* **Dynamic Case Study Curation**: Create, edit, and reorder case study blueprints and media assets.
* **Bilingual Copy Engine**: Live synchronization for English and Bengali content across all sections.
* **Inbound Lead Inbox**: Real-time reader for contact form inquiries with status tracking.
* **Protected Operations**: Secured via server-side Web Crypto HMAC token verification.

---

## 📁 Project Directory Map

```text
├── app/
│   ├── (public)/              # Public route handlers (/, /work, /about, /contact)
│   ├── admin/                 # Admin Dashboard shell & login routes
│   ├── api/                   # Typed API handlers (admin, contact, upload, crud)
│   └── layout.tsx             # Root Layout with SmoothScroll, Preloader, Header, Footer
├── components/
│   ├── admin/                 # 9 Modular CRUD managers (Settings, Projects, etc.)
│   ├── contact/               # Contact form with Dennis Snellenberg underlines
│   ├── home/                  # Hero, Project slider, Services accordion, About preview
│   └── ui/                    # Reusable magnetic wrappers, buttons, switches
├── lib/
│   ├── auth.ts                # Edge-compatible Web Crypto HMAC session signing
│   ├── contact-links.ts       # Automatic phone, WhatsApp & Telegram link normalizers
│   ├── data.ts                # Cached database getters (5s revalidation)
│   ├── prisma.ts              # Global Prisma client instance
│   └── validations/           # Zod data integrity models
├── prisma/
│   ├── schema.prisma          # Database schema (9 relational models)
│   └── seed.ts                # Production database seeder
└── public/
    ├── images/                # Static brand photography & project assets
    └── uploads/               # Dynamic runtime uploaded media
```

---

## 🚢 Production Build & Deployment

### Build Locally
```bash
npm run build
npm run start
```

### Deploy to Vercel
1. Push this repository to your GitHub account.
2. Import the project into [Vercel](https://vercel.com).
3. Add environment variables (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `RESEND_API_KEY`, `CONTACT_EMAIL_TO`).
4. Hit **Deploy** — your portfolio is live worldwide on edge networks!

---

## 👤 Author & Connect

**Mahmud Hasan**  
*AI Automation Architect · Full-Stack Web Engineer · Android Specialist*  
Dhaka, Bangladesh 🇧🇩

* 💬 **WhatsApp**: [+880 1767-850859](https://wa.me/8801767850859)
* ✈️ **Telegram**: [@naimsmahmud50](https://t.me/naimsmahmud50)
* ✉️ **Email**: [mahmudhasan.infodev@gmail.com](mailto:mahmudhasan.infodev@gmail.com)
* 💼 **LinkedIn**: [mahmud-hasan-687908269](https://www.linkedin.com/in/mahmud-hasan-687908269)
* 🐙 **GitHub**: [@naimsmahmud50-dotcom](https://github.com/naimsmahmud50-dotcom)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
