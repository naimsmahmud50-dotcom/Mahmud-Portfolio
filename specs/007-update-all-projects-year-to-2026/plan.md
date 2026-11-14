# Implementation Plan: Update All Project Years to 2026

**Feature ID:** `007-update-all-projects-year-to-2026`  

---

## 1. Targeted Code Modifications

### 1.1 `lib/data.ts`
Update `defaultProjects` array entries to set `year: "2026"`:
- `madrasah-ecosystem`: `"2024"` -> `"2026"`
- `secure-my-pc`: `"2024"` -> `"2026"`
- `autonomous-ai-agent`: `"2024"` -> `"2026"`
- `travel-with-maijrun`: `"2024"` -> `"2026"`
- `arabic-language-club`: `"2023"` -> `"2026"`
- `student-life-circle`: `"2023"` -> `"2026"`
- `facebook-automation`: `"2024"` -> `"2026"`
- `autonomous-linkedin-lead-outreach-engine`: `"2026"` (already 2026)
- `maijrun-tech-store`: `"2024"` -> `"2026"`

### 1.2 `prisma/seed.ts`
Update `projectsData` array entries to set `year: "2026"`:
- `madrasah-ecosystem`: `"2024"` -> `"2026"`
- `secure-my-pc`: `"2024"` -> `"2026"`
- `autonomous-ai-agent`: `"2024"` -> `"2026"`
- `travel-with-maijrun`: `"2024"` -> `"2026"`
- `arabic-language-club`: `"2023"` -> `"2026"`
- `student-life-circle`: `"2023"` -> `"2026"`
- `facebook-automation`: `"2024"` -> `"2026"`
- `autonomous-linkedin-lead-outreach-engine`: `"2026"`
- `maijrun-tech-store`: `"2024"` -> `"2026"`

### 1.3 `prisma/dev.db`
Update all project records in the SQLite database to set `year = '2026'`.

---

## 2. Verification & Safety Checks
1. Database record verification query confirming all projects have `year === "2026"`.
2. Static typecheck and Next.js production build (`npm run build`).
3. ESLint validation (`npm run lint`).
4. Commit cleanly and push to GitHub remote `main`.
