# Feature Specification: AI Video Generation Skill & Dedicated Showcase Page

## 1. Background & Value Proposition
Mahmud Hasan is expanding his fullstack & AI automation portfolio to include **AI Video Generation & Generative Media Production**. In today's digital landscape, AI video generation (combining text-to-video, image-to-video, AI voice synthesis, automated editing, and dynamic subtitle overlays) is one of the highest-demand, high-ticket services for SaaS founders, content creators, and corporate brands.

Adding this skill to the portfolio accomplishes two major goals:
1. **Showcases Advanced Modern Capabilities:** Positions Mahmud as a versatile, next-generation AI engineer who masters not just code and web/mobile apps, but also autonomous creative workflows and generative media pipelines.
2. **Dedicated High-Conversion Showcase Page (`/video` or `/ai-video`):** Gives prospective clients and agencies an engaging, cinematic gallery where they can view real AI-generated video samples, inspect the prompt & tool architectures, understand the production pipeline, and immediately commission video projects.

---

## 2. User Scenarios & Core Capabilities

### Scenario 1: Visitor Discovers Video Capability from Main Navigation / Homepage
- Visitor lands on homepage or opens the menu drawer (`NavPanel`).
- Visitor sees "Video" or "AI Video" in the menu with a glowing accent indicator.
- On the homepage's Skill Clusters and Services sections, "AI Video Generation" is featured with key deliverables (e.g. Faceless YouTube/Reels, SaaS Demos, 3D Product Promos, Prompt-to-Video Pipelines).

### Scenario 2: Exploring the Dedicated Video Page (`/video`)
- Visitor navigates to `/video` via the snappy liquid page transition.
- **Hero:** Immersive, dark-mode showreel header with a floating magnetic "Watch Reel" button.
- **Bento Showcase Grid:** Filterable video library categorized by:
  - `All`
  - `SaaS & Product Promos` (16:9 Landscape)
  - `Viral Reels & Shorts` (9:16 Vertical Faceless Content)
  - `Cinematic & 3D Motion` (High-concept visuals)
  - `Brand Storytelling & Ads`
- **Video Interaction:** Hovering over a card plays a silent lightweight preview; clicking opens a cinematic modal with high-definition playback, sound toggle, duration, tools badge (e.g. Kling, Runway Gen-3, Flux, ElevenLabs), and prompt/workflow breakdown.
- **Pipeline Breakdown:** Visual 5-step diagram explaining how Mahmud transforms a raw prompt or script into a polished, revenue-generating video.
- **Direct Lead Conversion:** Call-to-action button connecting the visitor straight to WhatsApp or Contact form to request an AI video package.

### Scenario 3: Admin Management (Optional/Future Phase)
- In `/admin`, Mahmud can add/edit/reorder video showcase entries (title, video URL, thumbnail, category, tools used, prompt notes).

---

## 3. Success Metrics
- 100% responsive on all viewports (desktop 1440px, tablet 768px, mobile 375px/390px).
- Zero layout shift (CLS < 0.05) and instant video thumbnail loading using lazy video loading or poster previews.
- Perfect continuity with existing portfolio styling (Dennis Snellenberg aesthetic, `#0B0C0E` background, `#4ADE80` green accent, font typography).
- Build passes with zero TypeScript and ESLint warnings.
