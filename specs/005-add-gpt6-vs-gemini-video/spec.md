# Feature Specification: Add GPT-6 Astra vs Gemini Carbon Motion Video to Extra Skills

**Feature ID:** `005-add-gpt6-vs-gemini-video`  
**Target:** `/extra-skills` (`lib/data.ts`)  
**Status:** In Progress / Completed  
**Methodology:** Spec-Driven Development (SDD) via Spec Kit  

---

## 1. Requirement Summary
The user provided a Google Drive video link (`https://drive.google.com/file/d/1dpAC9v3JJmLGT7w6Xc7lHPqu8wfxyfq7/view?usp=sharing`) and explicitly requested:
> "ai link a thak avidoe ta o portfolio te thaka extra skill a add kore felo /speckit onno kno code a feature a hat diba na just do your job"

### Constraints:
1. Download video directly from Google Drive.
2. Store locally in `public/videos/extra-skills/` as a static file (no raw Drive links).
3. Generate a high-resolution `.jpg` poster thumbnail in `public/videos/extra-skills/thumbnails/`.
4. Register the video in `lib/data.ts` under `defaultExtraSkillVideos` with bilingual metadata.
5. Absolute restriction: Do NOT touch or modify any other code or features.
6. Verify production build with `npm run build`, commit to Git, and push to GitHub `main` for Vercel deployment.
