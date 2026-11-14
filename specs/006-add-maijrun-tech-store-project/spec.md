# Feature Specification: Add Maijrun Tech Store to Project Showcase

**Feature ID:** `006-add-maijrun-tech-store-project`  
**Target:** `lib/data.ts`, `prisma/seed.ts`, `prisma/dev.db`, `public/images/projects/maijrun-tech.svg`  
**Status:** In Progress / Implementation  
**Methodology:** Spec-Driven Development (SDD) via Spec Kit  

---

## 1. Requirement & User Intent
The user requested:
> "তাহলে এখন একটা কাজ করো, Maijrun Tech Store যে প্রজেক্টটা আছে, আমার প্রজেক্ট লিস্টে সেটা অ্যাড করে দাও। বুঝতে পারছো আমি কি বলছি? আমার যে প্রজেক্ট লিস্ট আছে সেখানে Maijrun Tech Store টা নাই, সুন্দরভাবে সেটা আমার প্রজেক্ট লিস্টে অ্যাড করে দাও। অন্য কোনো ফিচারে হাত দিবা না, অন্য কোনো কোড নষ্ট করবা না। আমার পোর্টফোলিও যেন নষ্ট না হয়, এটা অলরেডি ক্লায়েন্টের কাছে চলে গেছে, ক্লায়েন্ট ওটা চেক করবে। সুতরাং Maijrun Tech Store টা অবশ্যই এখন আপডেট করে দাও।"

### Key Acceptance Criteria:
1. Register **Maijrun Tech Store** (`maijrun-tech-store`) as a featured project in `lib/data.ts` and SQLite DB.
2. Link verified public GitHub repo: `https://github.com/naimsmahmud50-dotcom/Maijrun-Teach`.
3. Link verified live demo: `https://naimsmahmud50-dotcom.github.io/Maijrun-Teach/`.
4. Create bespoke high-craft SVG project cover `public/images/projects/maijrun-tech.svg`.
5. Ensure zero regression on existing pages, routes, or client-shared links.
6. Verify production build passes (`npm run build`).
7. Commit to Git and push to GitHub `main` for automatic Vercel deployment.
