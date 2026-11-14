"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Film,
  ArrowUpRight,
  Clapperboard,
  Cpu,
  Layers,
  Wand2,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import MagneticWrapper from "@/components/MagneticWrapper";
import { usePageTransition } from "@/context/TransitionContext";
import { useI18n } from "@/lib/i18n";
import type { ExtraSkillVideo, SiteSettingsData } from "@/lib/data";

interface ExtraSkillsClientProps {
  initialVideos: ExtraSkillVideo[];
  settings?: SiteSettingsData;
}

type VideoCategory = "all" | "saas" | "reels" | "cinematic" | "ecommerce";

const pipelineSteps = [
  {
    step: "01",
    titleEn: "Script & Concept Ideation",
    titleBn: "স্ক্রিপ্ট ও কনসেপ্ট আইডিয়া",
    descEn:
      "Deep narrative structuring, visual pacing, and multi-prompt architecture tailored for high engagement.",
    descBn:
      "উচ্চ এনগেজমেন্টের জন্য নিখুঁত স্ক্রিপ্ট স্ট্রাকচারিং, প্রম্পট ডিজাইন এবং ভিজ্যুয়াল পেসিং প্ল্যান।",
    icon: Wand2,
  },
  {
    step: "02",
    titleEn: "Visual Keyframe Generation",
    titleBn: "ভিজ্যুয়াল কি-ফ্রেম তৈরি",
    descEn:
      "Crafting high-fidelity photorealistic and stylised keyframes using Flux 1.1 Pro and Midjourney v6.1.",
    descBn:
      "ফ্লাক্স ও মিডজার্নির সাহায্যে অতিবাস্তবসম্মত ও শৈল্পিক কি-ফ্রেম আর্ট জেনারেশন।",
    icon: Layers,
  },
  {
    step: "03",
    titleEn: "Autonomous Motion Synthesis",
    titleBn: "অটোনোমাস মোশন সিন্থেসিস",
    descEn:
      "Injecting realistic camera sweeps, fluid dynamics, and 4K character animation with Kling AI and Runway Gen-3.",
    descBn:
      "ক্লিং এবং রানওয়ে জেন-৩ দিয়ে মসৃণ ক্যামেরা মুভমেন্ট, ক্যারেক্টার ও সিনেমাটিক মোশন অ্যানিমেশন।",
    icon: Film,
  },
  {
    step: "04",
    titleEn: "Neural Voice Cloning & SFX",
    titleBn: "নিউরাল ভয়েস ক্লোনিং ও সাউন্ড",
    descEn:
      "Studio-grade neural voiceovers using ElevenLabs combined with immersive multi-track sound effects.",
    descBn:
      "ইলেভেনল্যাবস দিয়ে স্টুডিও গ্রেড ভয়েসওভার ও মাল্টি-ট্র্যাক সাউন্ড এফেক্টস সমন্বয়।",
    icon: Cpu,
  },
  {
    step: "05",
    titleEn: "Kinetic Editing & Dynamic Subs",
    titleBn: "কাইনেটিক এডিটিং ও সাবটাইটেল",
    descEn:
      "High-retention post-production with animated dynamic captions, color grading, and final delivery.",
    descBn:
      "ডায়নামিক অ্যানিমেটেড সাবটাইটেল, কালার গ্রেডিং এবং ফাইনাল হাই-রেজ্যুলেশন রেন্ডার ডেলিভারি।",
    icon: Clapperboard,
  },
];

function SquareVideoCard({
  item,
  lang,
  onSelect,
}: {
  item: ExtraSkillVideo;
  lang: string;
  onSelect: (item: ExtraSkillVideo) => void;
}) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group/card relative w-[280px] sm:w-[320px] md:w-[360px] aspect-square rounded-3xl bg-surface border border-line/80 hover:border-accent/60 overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] select-none"
    >
      {/* Background Media with Autoplay on Hover */}
      <video
        src={item.videoUrl}
        poster={item.thumbnail}
        loop
        muted
        playsInline
        preload="metadata"
        onMouseEnter={(e) => {
          const v = e.currentTarget;
          v.play().catch(() => {});
        }}
        onMouseLeave={(e) => {
          const v = e.currentTarget;
          v.pause();
          v.currentTime = 0;
        }}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
      />

      {/* Dark Vignette Overlay on Top & Bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-black/60 pointer-events-none" />

      {/* Top Floating Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
        <span className="px-2.5 py-1 rounded-full bg-bg/85 backdrop-blur-md border border-line text-[10px] font-mono text-accent font-semibold">
          {lang === "bn" ? item.categoryLabelBn : item.categoryLabel}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-bg/85 backdrop-blur-md border border-line text-[10px] font-mono text-text flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted" />
          {item.duration}
        </span>
      </div>

      {/* Center Floating Play Button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-accent/90 text-accent-ink flex items-center justify-center scale-90 opacity-80 group-hover/card:scale-110 group-hover/card:opacity-100 transition-all duration-300 shadow-xl">
          <Play className="w-5 sm:w-6 h-5 sm:h-6 ml-0.5 fill-accent-ink text-accent-ink" />
        </div>
      </div>

      {/* Bottom Content Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-bg via-bg/85 to-transparent pointer-events-none z-10">
        <h3 className="font-display text-sm sm:text-base font-medium text-text group-hover/card:text-accent transition-colors line-clamp-1 mb-1.5">
          {lang === "bn" ? item.titleBn : item.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] font-mono text-muted">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-surface border border-line text-muted">
              {item.tools[0]}
            </span>
            <span className="text-[10px] text-muted/80 uppercase">
              {item.aspectRatio}
            </span>
          </div>
          <span className="text-accent flex items-center gap-0.5 group-hover/card:underline">
            {lang === "bn" ? "ভিডিও দেখুন" : "Watch"}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ExtraSkillsClient({
  initialVideos,
  settings,
}: ExtraSkillsClientProps) {
  const { lang } = useI18n();
  const { navigate } = usePageTransition();

  const [activeCategory, setActiveCategory] = useState<VideoCategory>("all");
  const [selectedVideo, setSelectedVideo] = useState<ExtraSkillVideo | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const phone = settings?.phone || "+8801767850859";
  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hi Mahmud, I saw your AI Video Generation showcase on your portfolio and would like to discuss a project!"
  )}`;

  // Filter video items based on selected category
  const filteredVideos = initialVideos.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  // Split filtered videos into 2 distinct rows for the marquee
  const row1Items = filteredVideos.filter((_, idx) => idx % 2 === 0);
  const row2Items = filteredVideos.filter((_, idx) => idx % 2 !== 0);

  const actualRow1 = row1Items.length > 0 ? row1Items : filteredVideos;
  const actualRow2 = row2Items.length > 0 ? row2Items : filteredVideos;

  // Build repeated tracks to ensure continuous 50% translateX marquee loop
  const buildTrack = (items: ExtraSkillVideo[]) => {
    if (items.length === 0) return [];
    let list = [...items];
    while (list.length < 8) {
      list = [...list, ...items];
    }
    return [...list, ...list];
  };

  const track1 = buildTrack(actualRow1);
  const track2 = buildTrack(actualRow2);

  const categories: { labelEn: string; labelBn: string; value: VideoCategory }[] = [
    { labelEn: "All Work", labelBn: "সকল প্রজেক্ট", value: "all" },
    { labelEn: "SaaS & Tech", labelBn: "স্যাস ও টেক", value: "saas" },
    { labelEn: "Viral Reels (9:16)", labelBn: "ভাইরাল রিলস (৯:১৬)", value: "reels" },
    { labelEn: "3D Cinematic", labelBn: "সিনেমেটিক ৩ডি", value: "cinematic" },
    { labelEn: "E-Commerce Ads", labelBn: "ই-কমার্স বিজ্ঞাপন", value: "ecommerce" },
  ];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleModalPlay = () => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play();
      setIsPlaying(true);
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleModalMute = () => {
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !modalVideoRef.current.muted;
    setIsMuted(modalVideoRef.current.muted);
  };

  return (
    <div className="relative pt-32 sm:pt-40 md:pt-48 pb-28 sm:pb-36 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none">
      {/* Soft Ambient Radial Background Glow */}
      <div
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[550px] rounded-full blur-[170px] pointer-events-none -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* 1. HERO SECTION */}
      <section className="mb-20 sm:mb-28">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
            {lang === "bn"
              ? "কোডিংয়ের বাইরে // মাল্টিডিসিপ্লিনারি ল্যাব"
              : "Beyond Code // Multidisciplinary Lab"}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-surface border border-line text-accent">
            {lang === "bn" ? "চ্যাপ্টার ০১" : "Chapter 01"}
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight text-text leading-[1.02] max-w-5xl mb-8">
          {lang === "bn" ? (
            <>
              এক্সট্রা স্কিলস ও{" "}
              <span className="text-accent">অটোনোমাস এআই ভিডিও</span>
            </>
          ) : (
            <>
              Extra Skills &amp;{" "}
              <span className="text-accent">Autonomous AI Video</span>
            </>
          )}
        </h1>

        <p className="text-base sm:text-xl text-muted font-normal max-w-3xl leading-relaxed">
          {lang === "bn"
            ? "আধুনিক সফটওয়্যার ডেভেলপমেন্টের সাথে উচ্চমানের ভিজ্যুয়াল স্টোরিটেলিংয়ের যুগলবন্দী। স্ক্রিপ্ট ও প্রম্পট থেকে সরাসরি কমার্শিয়াল ৪কে ভিডিও, ভাইরাল সোশ্যাল রিলস ও পণ্য লঞ্চ বিজ্ঞাপন তৈরি।"
            : "Bridging the gap between robust software engineering and autonomous generative media. Transforming raw concepts, code, and prompts into commercial-grade 4K SaaS promos, viral vertical reels, and cinematic brand narratives."}
        </p>

        {/* Chapter Quick Switcher Banner */}
        <div className="mt-12 p-1.5 sm:p-2 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-4 max-w-2xl">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-bg border border-line text-xs sm:text-sm font-mono text-text">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-semibold">
              {lang === "bn"
                ? "চ্যাপ্টার ০১: এআই ভিডিও জেনারেশন"
                : "Chapter 01: AI Video Generation"}
            </span>
            <span className="text-accent text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
              Active
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-muted">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === "bn"
                ? "চ্যাপ্টার ০২: ৩ডি ও জেনারেটিভ ডিজাইন (শীঘ্রই)"
                : "Chapter 02: 3D & Generative Design (Soon)"}
            </span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTER BAR */}
      <section className="mb-12 flex flex-wrap items-center gap-2 sm:gap-3 border-b border-line pb-6">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          const count =
            cat.value === "all"
              ? initialVideos.length
              : initialVideos.filter((v) => v.category === cat.value).length;

          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-mono transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-accent text-accent-ink font-semibold shadow-lg scale-105"
                  : "bg-surface border border-line text-muted hover:text-text hover:border-accent/40"
              }`}
            >
              <span>{lang === "bn" ? cat.labelBn : cat.labelEn}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-accent-ink/20 text-accent-ink"
                    : "bg-bg text-muted"
                }`}
              >
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </section>

      {/* 3. TWO-ROW SQUARE VIDEO MARQUEE (RIGHT TO LEFT) */}
      <section className="mb-28 sm:mb-36">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-muted uppercase">
                {lang === "bn" ? "ভিডিও শোকেস // ডাবল-রো মোশন" : "Video Showcase // Two-Row Marquee"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-medium text-text">
              {lang === "bn" ? "প্রোডাকশন ভিডিও স্ট্রিম" : "Live Production Stream"}
            </h2>
          </div>
          <div className="text-xs font-mono text-muted flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            <span>
              {lang === "bn"
                ? "যেকোনো কার্ডে ক্লিক করে সম্পূর্ণ ফুল-স্ক্রিন ভিডিও দেখুন"
                : "Click any square card to expand full video"}
            </span>
          </div>
        </div>

        {/* Marquee Wrapper with Edge Fade Vignettes */}
        <div className="relative w-full overflow-hidden select-none py-2 -mx-6 sm:-mx-10 md:-mx-14 px-6 sm:px-10 md:px-14">
          {/* Side Edge Fade Gradients for Seamless Blend */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-bg via-bg/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-bg via-bg/80 to-transparent z-20 pointer-events-none" />

          <div className="flex flex-col gap-6 sm:gap-8">
            {/* ROW 1: Right to Left */}
            <div className="flex w-max gap-5 sm:gap-6 animate-marquee hover:[animation-play-state:paused] will-change-transform py-2">
              {track1.map((item, idx) => (
                <SquareVideoCard
                  key={`r1-${item.id}-${idx}`}
                  item={item}
                  lang={lang}
                  onSelect={setSelectedVideo}
                />
              ))}
            </div>

            {/* ROW 2: Right to Left (Fluid Pace for Organic Movement) */}
            <div
              className="flex w-max gap-5 sm:gap-6 animate-marquee hover:[animation-play-state:paused] will-change-transform py-2"
              style={{ animationDuration: "45s" }}
            >
              {track2.map((item, idx) => (
                <SquareVideoCard
                  key={`r2-${item.id}-${idx}`}
                  item={item}
                  lang={lang}
                  onSelect={setSelectedVideo}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 5-STEP GENERATIVE VIDEO PIPELINE */}
      <section className="mb-28 sm:mb-36 p-8 sm:p-12 md:p-16 rounded-3xl bg-surface border border-line relative overflow-hidden">
        {/* Subtle accent glow */}
        <div
          className="absolute -right-20 -bottom-20 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-20"
          style={{ background: "var(--accent)" }}
          aria-hidden="true"
        />

        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <h2 className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
              {lang === "bn"
                ? "উৎপাদন প্রক্রিয়া // পাইপলাইন"
                : "Production Pipeline // How It Works"}
            </h2>
          </div>
          <p className="text-2xl sm:text-4xl font-display font-medium text-text">
            {lang === "bn"
              ? "প্রম্পট ও স্ক্রিপ্ট থেকে সম্পূর্ণ স্বয়ংক্রিয় সিনেমাটিক ভিডিও"
              : "Autonomous Generative Architecture: From Prompt to 4K Master"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {pipelineSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-bg border border-line flex flex-col justify-between hover:border-accent/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-accent font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                      {s.step}
                    </span>
                    <Icon className="w-5 h-5 text-muted" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-text mb-2">
                    {lang === "bn" ? s.titleBn : s.titleEn}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    {lang === "bn" ? s.descBn : s.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. COMMERCIAL SERVICES & USE CASES */}
      <section className="mb-28 sm:mb-36">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h2 className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
            {lang === "bn"
              ? "কমার্শিয়াল সার্ভিসেস"
              : "Commercial Capabilities"}
          </h2>
        </div>

        <h3 className="text-3xl sm:text-5xl font-display font-medium text-text mb-12">
          {lang === "bn"
            ? "ব্যবসার বৃদ্ধির জন্য এআই ভিডিও সমাধান"
            : "Tailored AI Video Systems for Founders & Brands"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 rounded-3xl bg-surface border border-line flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-bg border border-line flex items-center justify-center text-accent mb-6">
                <Film className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl sm:text-2xl font-medium text-text mb-3">
                {lang === "bn"
                  ? "স্যাস ও প্রোডাক্ট লঞ্চ প্রোমো"
                  : "SaaS & Product Launch Promos"}
              </h4>
              <p className="text-sm text-muted leading-relaxed mb-6">
                {lang === "bn"
                  ? "সফটওয়্যার ও স্টার্টআপদের জন্য বিশ্বমানের থ্রিডি মকআপ, ড্যাশবোর্ড মোশন ও হাই-কনভার্টিং এক্সপ্লেইনার ভিডিও।"
                  : "High-energy commercial launch videos for tech products, AI platforms, and SaaS apps. 3D device mockups, UI animations, and persuasive scripting."}
              </p>
            </div>
            <ul className="space-y-2 text-xs font-mono text-muted pt-4 border-t border-line">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                <span>16:9 4K Master Video</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                <span>Custom Voiceover & SFX</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-surface border border-line flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-bg border border-line flex items-center justify-center text-accent mb-6">
                <Clapperboard className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl sm:text-2xl font-medium text-text mb-3">
                {lang === "bn"
                  ? "ভাইরাল ফেসলেস রিলস ও শর্টস"
                  : "Viral Faceless Shorts & Reels"}
              </h4>
              <p className="text-sm text-muted leading-relaxed mb-6">
                {lang === "bn"
                  ? "ইনস্টাগ্রাম, টিকটক ও ইউটিউব শর্টসের জন্য তৈরি হাই-রিটেনশন ভিডিও। ক্যাপশন, হুক ও কন্টেন্ট অটোমেশন পাইপলাইন।"
                  : "Automated content generation engineered for rapid social follower growth. Kinetic typography, retention hooks, and viral pacing."}
              </p>
            </div>
            <ul className="space-y-2 text-xs font-mono text-muted pt-4 border-t border-line">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                <span>9:16 Vertical Smartphone Format</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                <span>Auto Dynamic Subtitles</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-surface border border-line flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-bg border border-line flex items-center justify-center text-accent mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl sm:text-2xl font-medium text-text mb-3">
                {lang === "bn"
                  ? "ই-কমার্স ও পারফর্ম্যান্স অ্যাড"
                  : "E-Commerce & High-CTR Ads"}
              </h4>
              <p className="text-sm text-muted leading-relaxed mb-6">
                {lang === "bn"
                  ? "অনলাইন শপ ও ব্র্যান্ডের জন্য পণ্যের ৩৬০-ডিগ্রি রোটেশনাল ও সিনেমাটিক ভিডিও অ্যাড যা সরাসরি সেলস কনভার্সন বাড়ায়।"
                  : "Explosive product commercials, 360-degree floating asset physics, and dynamic lighting that convert viewers into paying customers."}
              </p>
            </div>
            <ul className="space-y-2 text-xs font-mono text-muted pt-4 border-t border-line">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                <span>High CTR Ad Variations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                <span>24-48h Rapid Turnaround</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. CONVERSION CTA */}
      <section className="relative p-10 sm:p-16 md:p-20 rounded-3xl bg-surface border border-line text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-radial from-accent/10 via-transparent to-transparent opacity-50 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse mb-6" />
          <h3 className="font-display text-3xl sm:text-5xl md:text-6xl font-medium text-text mb-6">
            {lang === "bn"
              ? "আপনার পরবর্তী ভিডিও প্রজেক্ট শুরু করবেন?"
              : "Ready to Create Your Next High-Impact AI Video?"}
          </h3>
          <p className="text-sm sm:text-base text-muted leading-relaxed mb-10">
            {lang === "bn"
              ? "প্রোডাক্ট লঞ্চ, সোশ্যাল মিডিয়া গ্রোথ বা ব্র্যান্ড কমার্শিয়ালের জন্য আজই যোগাযোগ করুন। দ্রুত ডেলিভারি ও প্রিমিয়াম কোয়ালিটি গ্যারান্টি।"
              : "Whether you need a SaaS launch teaser, a month's worth of automated viral reels, or a cinema-grade brand commercial, let's build it together."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticWrapper strength={0.3}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-accent text-accent-ink font-mono text-xs uppercase tracking-wider font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{lang === "bn" ? "হোয়াটসঅ্যাপে চ্যাট করুন" : "Chat on WhatsApp"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </MagneticWrapper>

            <MagneticWrapper strength={0.25}>
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 rounded-full bg-bg border border-line text-text hover:border-accent hover:text-accent font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2"
              >
                <span>{lang === "bn" ? "প্রজেক্টের তথ্য পাঠান" : "Inquire via Contact Form"}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </MagneticWrapper>
          </div>
        </div>
      </section>

      {/* 7. CINEMATIC VIDEO DETAIL MODAL */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
              className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-surface border border-line rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-bg/80 backdrop-blur-md border border-line text-text hover:text-accent hover:border-accent flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Player Column */}
              <div className="relative w-full lg:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px]">
                <video
                  ref={modalVideoRef}
                  src={selectedVideo.videoUrl}
                  poster={selectedVideo.thumbnail}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain max-h-[75vh]"
                />

                {/* Custom Overlay Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-full bg-bg/85 backdrop-blur-md border border-line">
                  <button
                    onClick={toggleModalPlay}
                    className="p-1.5 rounded-full hover:bg-surface text-text hover:text-accent transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>

                  <span className="text-xs font-mono text-muted">
                    {selectedVideo.duration} • {selectedVideo.aspectRatio}
                  </span>

                  <button
                    onClick={toggleModalMute}
                    className="p-1.5 rounded-full hover:bg-surface text-text hover:text-accent transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-accent" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Specification & Architecture Panel */}
              <div className="w-full lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-[85vh]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-semibold">
                      {lang === "bn"
                        ? selectedVideo.categoryLabelBn
                        : selectedVideo.categoryLabel}
                    </span>
                    <span className="text-xs font-mono text-muted">
                      {selectedVideo.duration}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-medium text-text mb-3">
                    {lang === "bn" ? selectedVideo.titleBn : selectedVideo.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                    {lang === "bn"
                      ? selectedVideo.descriptionBn
                      : selectedVideo.description}
                  </p>

                  {/* Prompt Architecture Insight */}
                  <div className="mb-6 p-4 rounded-2xl bg-bg border border-line">
                    <div className="flex items-center gap-2 text-xs font-mono text-accent mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-semibold uppercase tracking-wider">
                        {lang === "bn"
                          ? "প্রম্পট ও কনসেপ্ট আর্কিটেকচার"
                          : "Prompt & Concept Architecture"}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-text/85 leading-relaxed italic">
                      &ldquo;
                      {lang === "bn"
                        ? selectedVideo.promptNotesBn
                        : selectedVideo.promptNotes}
                      &rdquo;
                    </p>
                  </div>

                  {/* Tools Stack */}
                  <div className="mb-6">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-2">
                      {lang === "bn" ? "ব্যবহৃত টুলস" : "AI Tool Stack"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVideo.tools.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-full text-xs font-mono bg-bg border border-line text-text"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal CTA */}
                <div className="pt-6 border-t border-line">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-full bg-accent text-accent-ink font-mono text-xs uppercase tracking-wider font-semibold shadow-lg hover:bg-accent-hover transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      {lang === "bn"
                        ? "এমন একটি ভিডিও তৈরি করতে চান?"
                        : "Order a Video Like This"}
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
