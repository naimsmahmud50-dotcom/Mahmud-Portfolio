# Feature Specification: Remove Hero Section Portrait Image

**Feature ID:** `010-remove-hero-portrait-image`  
**Target Files:** `components/home/Hero.tsx`, `public/images/mahmud-hero.webp`, `public/images/mahmud-hero.png`  
**Status:** In Progress / Implementation  
**Methodology:** Spec-Driven Development (SDD) via Spec Kit  

---

## 1. Requirement & User Intent
The user requested:
> "jei pic ta aktu age update kore add kore dila oita remove kore dew sundor lagtache na chobita r onno kno kichu remove korba na just pic jeta akhkn add korlm oitai remove kore diba /speckit"

### Key Acceptance Criteria:
1. **Revert Hero Component (`components/home/Hero.tsx`):**
   - Remove the desktop portrait cutout component, its floating wrapper, ambient glow, and status pill.
   - Remove the mobile avatar addition from the top badge row.
   - Remove unused imports (`Image`) and transform hooks (`photoParallaxY`).
   - Restore `Hero.tsx` exactly to its previous clean state (commit `3c3fc9e`).
2. **Clean up public asset files:**
   - Remove `public/images/mahmud-hero.webp` and `public/images/mahmud-hero.png`.
3. **Safety Constraints:**
   - Do NOT touch or remove any other existing feature, code, styling, or service (e.g. Full Stack Development and Business Automation services must remain 100% intact).
4. **Verification & Deployment:**
   - Run `npm run lint` and `npm run build` (confirm 28/28 pages build cleanly with 0 errors).
   - Commit cleanly and push to GitHub `origin main` to trigger Vercel deployment.
   - Verify live production on Vercel (`mahmud-portfolio-flame.vercel.app`).
