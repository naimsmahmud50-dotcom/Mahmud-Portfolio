# Implementation Plan: Add Hero Section Portrait Image

**Feature ID:** `009-add-hero-portrait-image`  
**Status:** In Progress  

---

## 1. Technical Context
- User provided image: `/home/mahmud-hasan/Downloads/Sleek Tech Portfolio Portrait.png` (1165x1350).
- Background removal: already extracted transparent cutout with `rembg`.
- Cropping: cropped from y=286 to y=1275 with 50px bottom alpha fade to exclude pants completely and ensure seamless blend.
- Assets saved to: `public/images/mahmud-hero.webp` and `public/images/mahmud-hero.png`.
- Component to update: `components/home/Hero.tsx`.

## 2. Layout & Positioning Architecture in `components/home/Hero.tsx`

### Desktop Layout (>= 1024px):
- In `Hero.tsx`, wrap the name block or position an absolute/floating container on the right side:
  - Width: `w-[280px] sm:w-[320px] lg:w-[340px] xl:w-[390px] 2xl:w-[420px]`
  - Position: Aligned to the right (`right-0 sm:right-2 md:right-4 lg:right-6 xl:right-10`)
  - Vertical alignment: Centered with the hero name block or positioned beside "Mahmud" and above/beside "Hasan —".
  - Soft ambient glow backing: Radial gradient with `var(--accent)` (or `#38bdf8` cyan matching the badge) at ~10% opacity, 60px blur.
  - Motion: Reveal with `isPreloaderDone`, subtle parallax Y shift with scroll (`[0, 50]`), and hover scale (`hover:scale-[1.02] duration-500`).

### Mobile Layout (< 1024px):
- On tablet/mobile, to keep the typography bold and unconstrained, display the portrait centered or as a neat floating hero element, or right under the badge with a compact frame, or seamlessly stacked so mobile responsiveness remains 100% clean.

## 3. Step-by-Step Execution:
1. Verify `public/images/mahmud-hero.webp` and `public/images/mahmud-hero.png`.
2. Update `components/home/Hero.tsx` with `Image` component from `next/image` and Framer Motion reveal.
3. Test production build with `npm run build` and `npm run lint`.
4. Run dev server, take headless browser screenshots at 1440x900 and 390x844 to verify visual excellence.
5. Commit and push to GitHub `main` for Vercel deployment.
6. Verify live deployment on Vercel.
