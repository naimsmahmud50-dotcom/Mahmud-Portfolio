# Feature Specification: Update All Project Years to 2026

**Feature ID:** `007-update-all-projects-year-to-2026`  
**Target Files:** `lib/data.ts`, `prisma/seed.ts`, `prisma/dev.db`  
**Status:** In Progress / Implementation  
**Methodology:** Spec-Driven Development (SDD) via Spec Kit  

---

## 1. Requirement & User Intent
The user requested:
> "আমার প্রজেক্টগুলা সবগুলা ২০২৪ সাল লেখা। এটা কি তুমি নোটিস করতে পারছ? কারণ আমি প্রজেক্টগুলা করেছি ২০২৬ সালে। কিন্তু আমার পোর্টফোলিও প্রজেক্টে লেখা ২০২৪ সাল।"
> "হ্যাঁ, সুন্দর করে যেগুলোতে সমস্যা পেয়েছো, সালে দেখতে গিয়ে, কারণ আমি ২০২৬ সাল থেকে আমার কাজ শুরু করেছি, সুতরাং সবগুলা ২০২৬ সাল হিসেবে অ্যাড করে দাও।"
> "অন্য কোনো ফিচারে হাত দিবা না, অন্য কোনো কোড নষ্ট করবা না। আমার পোর্টফোলিও যেন নষ্ট না হয়, এটা অলরেডি ক্লায়েন্টের কাছে চলে গেছে, ক্লায়েন্ট ওটা চেক করবে।"
> "আপডেট করার পর সেগুলো গিটহাবে আপডেট করবা। কোডগুলো গিটহাবে আপডেট করার পর সেটা আবার ভার্সেল আপডেট করে দিবা।"

### Key Acceptance Criteria:
1. Update `year` attribute to `"2026"` for all projects in `lib/data.ts` (`defaultProjects` list).
2. Update `year` attribute to `"2026"` for all projects in `prisma/seed.ts` (`projectsData` list).
3. Update `year` attribute to `"2026"` for all project records in SQLite database `prisma/dev.db`.
4. Ensure zero regressions across other portfolio sections, styles, routes, and data models.
5. Verify production build integrity via `npm run build` and `npm run lint`.
6. Commit changes with a clean, conventional commit message and push to GitHub `main` to trigger Vercel deployment.
