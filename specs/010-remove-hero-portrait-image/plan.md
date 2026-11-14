# Implementation Plan: Remove Hero Section Portrait Image

**Feature ID:** `010-remove-hero-portrait-image`  
**Status:** In Progress  

---

## 1. Plan Overview
Revert all additions made to `components/home/Hero.tsx` in feature 009, removing both the desktop cutout portrait and the mobile avatar, returning the Hero section to its previous pure typographic Dennis Snellenberg editorial layout.

## 2. Step-by-Step Execution:
1. Revert `components/home/Hero.tsx` to commit `3c3fc9e`.
2. Remove `public/images/mahmud-hero.webp` and `public/images/mahmud-hero.png`.
3. Verify with `npm run lint` and `npm run build`.
4. Commit changes: `revert(hero): remove portrait cutout from hero section as requested`
5. Push to GitHub `main` for Vercel deployment.
6. Verify live site on `https://mahmud-portfolio-flame.vercel.app`.
