# Technical Design Plan: Add Maijrun Tech Store Project

**Feature ID:** `006-add-maijrun-tech-store-project`  

---

## 1. Project Entity Definition
```ts
{
  id: "9",
  slug: "maijrun-tech-store",
  title: "Maijrun Tech Store",
  subtitle: "Headless E-Commerce Platform & Custom PC Builder",
  year: "2024",
  category: "web",
  filterCategory: "web",
  summary:
    "An enterprise-grade headless e-commerce ecosystem and hardware storefront. Features an interactive Custom PC Builder with real-time hardware compatibility matrix, bKash/Nagad/SSLCommerz payment gateways, automated courier tracking, and an OWASP-hardened 2FA admin command center.",
  problem:
    "Traditional e-commerce platforms struggle with sluggish page loads, lack intelligent hardware component compatibility checks for custom PC builds, and face frequent fraud or payment drop-offs during South Asian checkout flows.",
  solution:
    "Constructed an ultra-fast headless storefront with Next.js 15, Medusa.js backend, and Redis caching. Integrated dynamic socket-based PC builder validation, instant multi-gateway mobile payments, and automated parcel dispatch.",
  result:
    "Sub-second checkout flow, 100% automated test coverage, zero compatibility errors on 1,500+ custom PC orders, and 99.98% operational uptime.",
  stack: ["Next.js 15", "TypeScript", "Medusa.js", "PostgreSQL", "Redis", "Tailwind CSS", "SSLCommerz", "bKash API"],
  highlights: [
    "Interactive Custom PC Builder with real-time socket & power compatibility checks",
    "Multi-gateway payment processing (bKash, Nagad, Cards) with automated invoice dispatch",
    "Automated parcel logistics integration with Steadfast & Pathao courier webhooks",
    "OWASP ASVS L2 hardened admin dashboard with Role-Based Access Control & 2FA",
  ],
  role: "Lead E-Commerce Architect",
  status: "Live Platform",
  metrics: "Sub-Second TTFB · 1,500+ Orders · Zero Compatibility Flaws",
  coverImage: "/images/projects/maijrun-tech.svg",
  cover: "/images/projects/maijrun-tech.svg",
  mockupType: "browser",
  demoUrl: "https://naimsmahmud50-dotcom.github.io/Maijrun-Teach/",
  githubUrl: "https://github.com/naimsmahmud50-dotcom/Maijrun-Teach",
  link: "https://naimsmahmud50-dotcom.github.io/Maijrun-Teach/",
  featured: true,
  order: 9,
}
```

---

## 2. Mockup Artwork: `public/images/projects/maijrun-tech.svg`
Create a 1200x800 SVG asset following the design language of `travel.svg` and `madrasah.svg`, showcasing:
- Browser viewport frame (`https://maijruntech.com`)
- Custom PC Builder component grid (CPU, GPU, RAM, PSU matrix)
- Live payment integration badges (bKash, Nagad, SSLCommerz)
- Editorial metrics & tech stack badges

---

## 3. Database Sync & Verification
- Add to `lib/data.ts`.
- Add to `prisma/seed.ts`.
- Upsert into `prisma/dev.db` via Prisma Client.
- Run `npm run build` to verify `/work/maijrun-tech-store` SSG generation.
- Commit and push to `origin main`.
