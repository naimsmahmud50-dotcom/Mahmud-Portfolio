# Technical Design Plan: Add GPT-6 Astra vs Gemini Carbon Video

**Feature ID:** `005-add-gpt6-vs-gemini-video`  

---

## 1. Asset Pipeline
- **Source:** Google Drive File ID `1dpAC9v3JJmLGT7w6Xc7lHPqu8wfxyfq7` (`gpt6_astra_vs_gemini_carbon_master_motion.mp4`).
- **Destination Path:** `public/videos/extra-skills/gpt6-astra-vs-gemini-carbon-motion.mp4` (Size: 18.9MB).
- **Format:** H.264 / AAC, 1080x1920 (9:16 vertical smartphone format), Duration: 1:36 (95.8s).
- **Thumbnail Path:** `public/videos/extra-skills/thumbnails/gpt6-astra-vs-gemini-carbon-motion.jpg` generated via `ffmpeg`.

---

## 2. Data Contract Update
Register in `lib/data.ts`:
```ts
{
  id: "vid-gpt6-vs-gemini",
  slug: "gpt6-astra-vs-gemini-carbon-master-motion",
  title: "GPT-6 Astra vs Gemini Carbon: Master Motion",
  titleBn: "জিপিটি-৬ আস্ট্রা বনাম জেমিনি কার্বন: মাস্টার মোশন",
  category: "reels",
  categoryLabel: "Viral Tech Reel",
  categoryLabelBn: "ভাইরাল টেক রিল",
  aspectRatio: "9:16",
  duration: "1:36",
  videoUrl: "/videos/extra-skills/gpt6-astra-vs-gemini-carbon-motion.mp4",
  thumbnail: "/videos/extra-skills/thumbnails/gpt6-astra-vs-gemini-carbon-motion.jpg",
  tools: ["Midjourney v6.1", "Runway Gen-3", "ElevenLabs", "Premiere Pro"],
  description: "High-octane AI technology showdown comparing frontier multimodal architectures: GPT-6 Astra vs Gemini Carbon with cybernetic HUD motion, neural voice cloning, and kinetic 4K visual pacing.",
  descriptionBn: "অত্যাধুনিক ফ্রন্টিয়ার এআই আর্কিটেকচার—জিপিটি-৬ আস্ট্রা বনাম জেমিনি কার্বনের সিনেমাটিক টেক শোডাউন। সাইবারনেটিক এইচইউডি মোশন, নিউরাল ভয়েস ও কাইনেটিক ভিজ্যুয়াল সমৃদ্ধ।",
  promptNotes: "Futuristic dark neon cyberspace, quantum computing processor core, holographic dual neural network battling in volumetric space, hyperrealistic lens flare, cybernetic 9:16 framing.",
  promptNotesBn: "ফিউচারিস্টিক নিয়ন সাইবারস্পেস, কোয়ান্টাম প্রসেসর কোর, হলোগ্রাফিক নিউরাল নেটওয়ার্ক শোডাউন ও সিনেমাটিক লেন্স ফ্লেয়ার।",
  featured: true,
  order: 9,
}
```

---

## 3. Verification & Deployment
- Run `npm run build` to verify zero TypeScript/SSR errors.
- Stage `public/videos/extra-skills/`, `lib/data.ts`, and spec files.
- Commit and push to `origin main` to trigger Vercel live deployment.
