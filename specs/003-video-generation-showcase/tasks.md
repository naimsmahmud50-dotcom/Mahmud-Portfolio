# Implementation Tasks: Extra Skills Page with AI Video Chapter

## Phase 1: Data Model & Seed Video Content
- [x] **Task 1.1: Define Data Types and Seed Items in `lib/data.ts`**
  - Add `ExtraSkillVideo` interface (id, slug, title, titleBn, category, categoryLabel, categoryLabelBn, aspectRatio, duration, videoUrl, thumbnail, tools, description, descriptionBn, promptNotes, promptNotesBn, featured, order).
  - Add curated initial showcase videos (SaaS Product Explainer, AI Avatar Viral Reel, 3D Cyberpunk Concept, E-Commerce Ad, LLM Explainer, Flutter App Launch).
  - Add helper `getExtraSkillVideos()` with fallback.

## Phase 2: Navigation Integration (Strict Zero Regression on Existing Links)
- [x] **Task 2.1: Route Labeling in `context/TransitionContext.tsx`**
  - Add `/extra-skills` -> `"Extra Skills"` in `formatRouteName`.
- [x] **Task 2.2: Menu Drawer in `components/NavPanel.tsx`**
  - Add `{ href: "/extra-skills", label: "Extra Skills", index: "05" }` to `navItems` below Contact.
- [x] **Task 2.3: Header Desktop Nav in `components/Header.tsx`**
  - Add `SlideLink` for `/extra-skills` ("Extra Skills").
- [x] **Task 2.4: Command Palette in `components/CommandPalette.tsx`**
  - Add Quick Jump entry for `Extra Skills — AI Video Generation & Creative Media`.

## Phase 3: Dedicated Page Construction (`app/extra-skills/`)
- [x] **Task 3.1: Server Page & Metadata (`app/extra-skills/page.tsx`)**
  - Create page with proper SEO title, description, and OpenGraph tags.
- [x] **Task 3.2: Interactive Client Page (`components/extra-skills/ExtraSkillsClient.tsx`)**
  - Hero introduction: "Beyond Code — Extra Skills & Multidisciplinary Lab".
  - Chapter selector bar: `Chapter 01: AI Video Generation & Motion Production`.
  - Filterable Bento Video Grid (16:9 Landscape & 9:16 Vertical Smartphone Reels).
  - Tool tag badges (`Kling AI`, `Runway Gen-3`, `Flux 1.1`, `ElevenLabs`, `Premiere Pro`).
  - Interactive Cinema Video Modal with prompt breakdown and sound controls.
  - 5-Step AI Video Generation Pipeline (Script -> Keyframes -> Motion -> Voice -> Captions).
  - High-conversion client inquiry CTA linking to WhatsApp / Contact.
  - 100% Bilingual support (English & Bangla) using `useI18n`.

## Phase 4: Verification & Strict Non-Regression Check
- [x] **Task 4.1: Static Type & Build Validation**
  - Run `npm run build` and ensure all 30/30 static pages compile with 0 errors.
- [x] **Task 4.2: Zero-Tampering Audit**
  - Confirm with `git diff` that no existing components, styles, or logic were altered outside of the designated navigation additions.
