# Feature Specification: Add Hero Section Portrait Image

**Feature ID:** `009-add-hero-portrait-image`  
**Target Files:** `components/home/Hero.tsx`, `public/images/mahmud-hero.webp`, `public/images/mahmud-hero.png`  
**Status:** In Progress / Implementation  
**Methodology:** Spec-Driven Development (SDD) via Spec Kit  

---

## 1. Requirement & User Intent
The user requested:
> "এই ছবিটা সুন্দরভাবে সাজিয়ে এই ছবিটা দিয়ে দাও। শোনো, আমি যে ছবিটা দিছি সেটা এডিট করে দিবা পোর্টফোলিওতে দেওয়ার মতো করে, যাতে আমি পোর্টফোলিওতে ইউজ করতে পারি। আর এটা ড্রেস ট্রেস কোনো কিছু চেঞ্জ হবে না, শুধু ব্যাকগ্রাউন্ডটা পোর্টফোলিওতে এই ব্যাকগ্রাউন্ডটা থাকবে না। শুধু ছবিটা থাকবে অনেক সুন্দর করে। ব্যাকগ্রাউন্ড এমনটা সুন্দর লাগছে না। তুমি এক কাজ করো, ব্যাকগ্রাউন্ড দেওয়ারই দরকার নাই। সরাসরি আমার এই ছবিটা টুকরো টুকরো করে দিবা, ক্রপ করে দিবা। পোর্টফোলিওতে একদম সামনে থাকবে তো, একটু ছোট ছবি চাই। আরেকটু সুন্দর চাই। যেমন ব্যাকগ্রাউন্ডটা সুন্দর হয় নাই, শার্টটা বানাই নাই। আরেকটু ছবিটা আরেকটু ছোট হবে, প্যান্ট দেখা যাবে না আরকি। যেহেতু পোর্টফোলিওতে থাকবে, মানে প্যান্ট পুরোপুরি দেখা যাবে না। গেঞ্জি পর্যন্ত ঠিক আছে। তো ব্যাকগ্রাউন্ড একদম ব্যাকগ্রাউন্ড না থাকলেও হবে। @/home/mahmud-hasan/Downloads"

### Key Acceptance Criteria:
1. **Source Image & Editing:**
   - Source: `/home/mahmud-hasan/Downloads/Sleek Tech Portfolio Portrait.png` (Mahmud in black "SECURITY. HACKER HANDLER" hoodie).
   - Background Removal: Completely remove the blue gradient background using high-fidelity edge segmentation (`rembg`), outputting a transparent cutout.
   - Cropping & Composition:
     - No pants visible — crop cleanly at the hoodie ribbed waistband/waist level (hands in pockets).
     - Remove excess padding around the head/shoulders.
     - Apply a delicate soft alpha gradient fade at the bottom (last 50px) to blend imperceptibly into the portfolio's `--bg` (`#0B0C0E`).
   - Output optimized assets: `public/images/mahmud-hero.webp` and `public/images/mahmud-hero.png`.

2. **Hero Section Integration (`components/home/Hero.tsx`):**
   - Place Mahmud's portrait cutout in the empty area on the right side of the Hero section, matching the screenshot provided by the user.
   - Visual Styling:
     - Soft ambient glow behind the portrait cutout (`bg-accent/[0.08]` or cyber cyan glow matching the hoodie badge) to provide depth against the dark background.
     - Framer Motion animation: Fade-in and gentle upward reveal synced with `isPreloaderDone`.
     - Subtle scroll parallax or hover micro-interaction (`hover:scale-[1.02]`).
   - Responsive Behavior:
     - **Desktop (>= 1024px):** Floats cleanly in the open space to the right of "Mahmud" and above/beside "Hasan —", perfectly filling the negative space without colliding with the typography.
     - **Tablet & Mobile (< 1024px):** Neatly scales and tucks in or centers so the huge name typography is never crushed or wrapped undesirably.

3. **Verification & Quality Standards:**
   - Verify visually across desktop (1440px, 1280px) and mobile (390px).
   - Zero console errors, zero layout shift or overflow bugs (`overflow-x-hidden`).
   - Build passes `npm run lint` and `npm run build`.
   - Push to GitHub `main` for automatic Vercel deployment and verify live site.
