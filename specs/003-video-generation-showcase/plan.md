# Technical Implementation Plan: Extra Skills Page with Video Generation Chapter

## 1. Concept & Strategic Rationale
The user requested an **"Extra Skills"** page (`/extra-skills`) featuring chapter-based navigation, where the first flagship chapter is **AI Video Generation & Production**.

### Why This Architecture Wins:
1. **Preserves Core Engineering Identity:** Mahmud's main positioning remains a Full-Stack Web, Mobile (Flutter), and AI Automation Engineer.
2. **Showcases 10x Versatility:** It proves that Mahmud is not just a coder, but a full-lifecycle digital creator who can architect the software AND produce commercial-grade promotional videos and launch campaigns.
3. **Future Scalability:** Designing it with **Chapters** (`Chapter 01: AI Video Generation`, `Chapter 02: Generative Design & Concept Art`, `Chapter 03: Advanced Motion Systems`) means future creative skills can be added seamlessly without bloating the main navigation.

---

## 2. Technical Architecture & File Structure

### 2.1 Routing & Navigation
- **Route:** `app/extra-skills/page.tsx`
- **Client Component:** `components/extra-skills/ExtraSkillsClient.tsx`
- **Sub-components:**
  - `components/extra-skills/ExtraSkillsHero.tsx`: Editorial chapter introduction.
  - `components/extra-skills/ChapterNav.tsx`: Interactive sticky chapter switcher/indexer.
  - `components/extra-skills/chapters/VideoChapter.tsx`: Complete AI Video Showcase module.
  - `components/extra-skills/chapters/VideoBentoGrid.tsx`: Filterable 16:9 & 9:16 video cards.
  - `components/extra-skills/chapters/VideoModal.tsx`: Full-screen cinema player with prompt breakdown.
  - `components/extra-skills/chapters/VideoPipeline.tsx`: 5-step generative pipeline.
- **Menu Integration:**
  - `components/NavPanel.tsx`: Add "Extra Skills" with chapter indicator badge `[01 Video]`.
  - `components/CommandPalette.tsx`: Add command to jump to `/extra-skills`.
  - `components/Footer.tsx`: Add link under Navigation.
  - `context/TransitionContext.tsx`: Map route `/extra-skills` to "Extra Skills".

### 2.2 Data Schema (`lib/data.ts`)
```typescript
export interface ExtraSkillChapter {
  id: string;
  chapterNumber: string; // e.g. "01"
  slug: string; // "video-generation"
  title: string;
  titleBn: string;
  tagline: string;
  taglineBn: string;
  description: string;
  descriptionBn: string;
  badge: string; // "Flagship Chapter"
  tools: string[];
}

export interface VideoShowcaseItem {
  id: string;
  title: string;
  titleBn?: string;
  category: "product" | "reels" | "cinematic" | "explainer";
  aspectRatio: "16:9" | "9:16";
  duration: string;
  videoUrl: string;
  thumbnail: string;
  tools: string[];
  description: string;
  promptBreakdown?: string;
  featured: boolean;
  order: number;
}
```

---

## 3. Visual UX Flow: Extra Skills Page

```
+--------------------------------------------------------------------------+
|  HEADER (Logo, Local Time, Menu Pill)                                    |
+--------------------------------------------------------------------------+
|                                                                          |
|  [PAGE HERO]                                                             |
|  - Tag: "BEYOND CODE // CREATIVE CAPABILITIES"                           |
|  - Headline: "Multidisciplinary Engineering & Generative Media"          |
|  - Description: High-impact creative skills that complement software.    |
|                                                                          |
|  [STICKY CHAPTER NAVIGATION BAR]                                         |
|  (01) AI Video Generation [ACTIVE]   |  (02) Generative Media & 3D (Next)|
|                                                                          |
+--------------------------------------------------------------------------+
|                                                                          |
|  === CHAPTER 01: AI VIDEO GENERATION & CINEMATIC PRODUCTION ===          |
|                                                                          |
|  [Chapter Intro + Showreel Hero]                                         |
|  - Headline: "From Script & Prompt to 4K Commercial Reality"             |
|  - Floating Magnetic "Watch 2026 Showreel" Pill                          |
|                                                                          |
|  [Filter Bar: All | SaaS Demos | Viral Reels | 3D Concept]               |
|                                                                          |
|  [Bento Video Grid: 16:9 SaaS Promos + 9:16 TikTok/Instagram Reels]      |
|  - Interactive hover autoplay preview                                    |
|  - Tool chips (Kling, Runway Gen-3, Flux, ElevenLabs)                    |
|                                                                          |
|  [Cinema Modal Player on Click]                                          |
|  - HD Video playback with unmuting                                       |
|  - Prompt architecture & production workflow breakdown                   |
|  - "Order a Video Like This" CTA                                         |
|                                                                          |
|  [5-Step AI Video Pipeline]                                              |
|  01 Script -> 02 Storyboard -> 03 Motion -> 04 Voice -> 05 Dynamic Subs  |
|                                                                          |
|  [Commercial Packages / Use Cases]                                       |
|  - SaaS Launch Promos                                                    |
|  - Faceless Viral Shorts/Reels Channels                                  |
|  - E-Commerce Video Ads                                                  |
|                                                                          |
+--------------------------------------------------------------------------+
|  [CONVERSION CTA: "Let's build your next app AND produce its launch ad"] |
+--------------------------------------------------------------------------+
|  FOOTER                                                                  |
+--------------------------------------------------------------------------+
```

---

## 4. Verification Plan
- [ ] Build verification: `npm run build` passes with zero errors.
- [ ] Responsive audit on mobile viewports (reels stacking cleanly, modal responsive).
- [ ] Smooth 60fps Dennis Snellenberg liquid transitions entering `/extra-skills`.
- [ ] Bilingual toggle (EN / BN) works across all chapter contents.
