# Technical Design Plan: Two-Row Square Video Marquee

**Feature ID:** `004-two-row-square-video-marquee`  
**File Modified:** `components/extra-skills/ExtraSkillsClient.tsx`  

---

## 1. Architectural Strategy

### Data Partitioning
We have 8 videos in `initialVideos`.
- Divide `initialVideos` into two distinct subsets:
  - `row1Videos`: 4 videos (e.g., indices `0, 2, 4, 6` or first half).
  - `row2Videos`: 4 videos (e.g., indices `1, 3, 5, 7` or second half).
- Duplicate each array at least 2 to 3 times to form a seamless infinite loop track:
  - `track1 = [...row1Videos, ...row1Videos, ...row1Videos]`
  - `track2 = [...row2Videos, ...row2Videos, ...row2Videos]`
  (Or repeat until length >= 8 items per track).

### CSS & Animation Configuration
1. **Marquee Animation Class:**
   - Use `animate-marquee` defined in `tailwind.config.ts`:
     ```css
     @keyframes marquee {
       0% { transform: translateX(0%); }
       100% { transform: translateX(-50%); }
     }
     ```
   - Track 1 duration: `38s`
   - Track 2 duration: `48s` (slight offset prevents synchronized lockstep)
2. **Hover Interaction:**
   - Add `group/track` on the parent container.
   - On hover over the track, apply `group-hover/track:[animation-play-state:paused]`.
   - On individual card hover:
     - Scale play button (`group-hover/card:scale-110`).
     - Play video preview (`video.play().catch(...)`).
     - Border highlight (`group-hover/card:border-accent/60`).

### Card Component Architecture (`SquareVideoCard`)
```tsx
<div
  onClick={() => setSelectedVideo(item)}
  className="group/card relative w-[280px] sm:w-[320px] md:w-[350px] aspect-square rounded-3xl bg-surface border border-line/80 hover:border-accent/60 overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] select-none"
>
  {/* Square Video Media */}
  <video
    src={item.videoUrl}
    poster={item.thumbnail}
    muted
    loop
    playsInline
    preload="metadata"
    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
  />

  {/* Top Badges */}
  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
    <span className="px-2.5 py-1 rounded-full bg-bg/85 backdrop-blur-md border border-line text-[10px] font-mono text-accent font-medium">
      {isBn ? item.categoryLabelBn : item.categoryLabel}
    </span>
    <span className="px-2 py-0.5 rounded-full bg-bg/85 backdrop-blur-md border border-line text-[10px] font-mono text-text flex items-center gap-1">
      <Clock className="w-2.5 h-2.5 text-muted" />
      {item.duration}
    </span>
  </div>

  {/* Center Play Icon */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="w-12 h-12 rounded-full bg-accent text-accent-ink flex items-center justify-center opacity-85 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-300 shadow-xl">
      <Play className="w-5 h-5 ml-0.5 fill-accent-ink text-accent-ink" />
    </div>
  </div>

  {/* Bottom Overlay */}
  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg via-bg/80 to-transparent z-10">
    <h3 className="font-display text-sm sm:text-base font-medium text-text group-hover/card:text-accent transition-colors line-clamp-1 mb-1.5">
      {isBn ? item.titleBn : item.title}
    </h3>
    <div className="flex items-center justify-between text-[11px] font-mono text-muted">
      <span className="line-clamp-1">{item.tools[0]} • {item.aspectRatio}</span>
      <span className="text-accent flex items-center gap-0.5 group-hover/card:underline">
        {isBn ? "প্লে করুন" : "Play"}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </div>
</div>
```

---

## 2. Risk Mitigation & Verification
- **Performance:** `will-change-transform` on the marquee tracks prevents frame drops.
- **Side Fades:** Side gradient masks `bg-gradient-to-r from-bg to-transparent` hide entrance and exit boundaries smoothly.
- **Verification:** Run `npm run build`, inspect in development, and test responsiveness.
