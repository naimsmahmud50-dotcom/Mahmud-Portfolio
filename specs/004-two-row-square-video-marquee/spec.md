# Feature Specification: Two-Row Square Video Marquee Showcase

**Feature ID:** `004-two-row-square-video-marquee`  
**Target Page:** `/extra-skills` (`components/extra-skills/ExtraSkillsClient.tsx`)  
**Status:** In Progress / Implementation  
**Methodology:** Spec-Driven Development (SDD) via Spec Kit  

---

## 1. Problem Statement & Motivation
The previous 3-column vertical grid layout for the 8 video productions on `/extra-skills` required excessive vertical scrolling, caused layout imbalances between 16:9 widescreen and 9:16 vertical reels, and did not showcase the cinematic breadth of the videos attractively.

The user explicitly requested:
> "আমি যে ভিডিওগুলো দিয়েছি, সেগুলো এখন যেভাবে রেখেছো সেভাবে সুন্দর দেখা যাচ্ছে না। চারকোনা শেপ করে সুন্দর করে ভিডিওগুলো স্ক্রল ভইউতে রাইট সাইড থেকে লেফট সাইডে যাবে। দুই সারিতে এভাবে ভিডিওগুলো যাবে, তাহলে সুন্দর লাগবে।"

---

## 2. Requirements & User Stories

### User Stories
- **US1: Dual-Row Right-to-Left Infinite Marquee:** As a prospective client visiting the portfolio, I want to see a fluid, modern marquee where square video cards continuously drift from right to left across two stacked horizontal rows, so I immediately grasp the creator's breadth of video work without tedious manual scrolling.
- **US2: Uniform Square Cards:** As a visitor, I want each video card to have a consistent square (`1:1` aspect-ratio) aesthetic with rounded edges, high-resolution poster artwork, category badges, and duration indicators.
- **US3: Hover-to-Pause & Video Hover Preview:** As a visitor, when I hover over any card in either row, the marquee must pause smoothly, and the card's video should preview or highlight, giving me complete control.
- **US4: Full-Screen Interactive Modal on Click:** When I click any card, the dedicated video modal must open smoothly to play the complete video with audio, display full English/Bengali descriptions, software tool stack, and generative prompts.
- **US5: Zero Regression Guarantee:** No other pages, menu links, routes, or backend systems should be touched or degraded.

---

## 3. Acceptance Criteria
1. **Layout Structure:**
   - Two stacked horizontal scrolling tracks (`Row 1` and `Row 2`).
   - Cards are square (`aspect-square`, `w-[280px] sm:w-[320px] md:w-[360px]`).
   - Left and right edge vignette gradients (`from-bg to-transparent`) for an infinite seamless blend into the page background.
2. **Animation Direction & Performance:**
   - Both rows scroll from **Right to Left** (`translateX(0%)` to `translateX(-50%)`).
   - GPU-accelerated CSS animations (`will-change-transform`, `linear infinite`).
   - Row 1 and Row 2 have complementary durations (e.g., 38s and 46s) for organic parallax.
   - Pauses cleanly on hover (`group-hover:[animation-play-state:paused]`).
3. **Card Presentation:**
   - Card displays category pill, duration badge, glowing play button on hover, and video title with tool tags on bottom gradient overlay.
4. **Bilingual Support:**
   - Respects English (`en`) and Bengali (`bn`) locales dynamically.
5. **Mobile & Touch Responsiveness:**
   - Responsive sizing, overflow hidden without horizontal page jitter, smooth 60fps performance on mobile devices.
