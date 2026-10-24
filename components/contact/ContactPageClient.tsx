"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowUpRight,
  Copy,
  Check,
  Send,
  Loader2,
  Clock,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import MagneticWrapper from "@/components/MagneticWrapper";
import { buildWhatsAppUrl, buildTelegramUrl } from "@/lib/contact-links";
import { contactSchema, ContactFormData } from "@/lib/validations/contact";
import { usePreloader } from "@/context/TransitionContext";
import type { SiteSettingsData } from "@/lib/data";

const serviceOptions = [
  "AI Automation & Agents",
  "Full-Stack Web App (Next.js)",
  "Android & Mobile App (Flutter)",
  "Social Commerce Automation",
  "Backend & Systems Architecture",
  "Other / Consultation",
];

interface ContactPageClientProps {
  settings: SiteSettingsData;
}

export default function ContactPageClient({ settings }: ContactPageClientProps) {
  const { isPreloaderDone } = usePreloader();

  const email = settings.email || "mahmudhasan.infodev@gmail.com";
  const phone = settings.phone || "+880 1767-850859";
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp || "https://wa.me/8801767850859",
    "Hi Mahmud, I visited your portfolio and would like to discuss a project."
  );
  const telegramUrl = buildTelegramUrl(settings.telegram || "https://t.me/naimsmahmud50");
  const githubUrl = settings.github || "https://github.com/naimsmahmud50-dotcom";
  const linkedinUrl = settings.linkedin || "https://www.linkedin.com/in/mahmud-hasan-687908269";

  // Form State
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    service: "AI Automation & Agents",
    message: "",
    tel: "", // Honeypot trap
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Field focus trackers for animated bottom line
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Copy Email Toast State
  const [copied, setCopied] = useState(false);

  // Live Dhaka Time Clock
  const [dhakaTime, setDhakaTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDhakaTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: settings.timeZone || "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.timeZone]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Client-side Zod validation
    const validationResult = contactSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const formattedErrors: Partial<Record<keyof ContactFormData, string>> = {};
      for (const [key, val] of Object.entries(fieldErrors)) {
        if (val && val.length > 0) {
          formattedErrors[key as keyof ContactFormData] = val[0];
        }
      }
      setErrors(formattedErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to transmit inquiry.");
      }

      setSubmitted(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.65 },
          colors: ["#C8F24A", "#ECEAE3", "#121417"],
        });
      } catch {}
    } catch (err: unknown) {
      setApiError(
        err instanceof Error
          ? err.message
          : `An unexpected error occurred. Please contact ${email} directly.`
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      service: "AI Automation & Agents",
      message: "",
      tel: "",
    });
    setErrors({});
    setSubmitted(false);
    setApiError(null);
  };

  const titleText = "Let’s start a project together—";
  const titleWords = titleText.split(" ");

  return (
    <div className="pt-36 sm:pt-44 md:pt-48 pb-32 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none">
      {/* 1. HUGE EDITORIAL TITLE WITH LETTER / WORD STAGGER */}
      <div className="mb-16 sm:mb-24">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
            Initiate Collaboration
          </span>
          <span className="text-xs sm:text-sm font-mono text-muted">
            (Contact Mahmud)
          </span>
        </div>

        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-text leading-[1.05] max-w-5xl"
          aria-label={titleText}
        >
          {titleWords.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className="inline-block overflow-hidden mr-[0.28em] pb-1"
            >
              <motion.span
                className="inline-block"
                initial={{ y: "115%" }}
                animate={isPreloaderDone ? { y: "0%" } : { y: "115%" }}
                transition={{
                  duration: 0.85,
                  ease: [0.25, 1, 0.5, 1], // power4.out
                  delay: 0.05 + wordIndex * 0.04,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* 2. MAIN LAYOUT: FORM (LEFT) + DIRECT CHANNELS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 items-start">
        {/* LEFT COLUMN: INTERACTIVE FORM WITH DENNIS SNELLENBERG UNDERLINES */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                onSubmit={handleSubmit}
                className="space-y-10 sm:space-y-12"
              >
                {/* Honeypot field (hidden from humans, catches automated bots) */}
                <input
                  type="text"
                  name="tel"
                  value={formData.tel}
                  onChange={(e) => handleChange("tel", e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="sr-only"
                  aria-hidden="true"
                />

                {/* Field 1: Name */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono tracking-wider uppercase text-muted">
                    <label htmlFor="contact-name" className="flex items-center gap-2">
                      <span className="text-accent font-bold">01</span>
                      <span>What&apos;s your name?</span>
                    </label>
                    {errors.name && (
                      <span className="text-xs font-mono text-danger">
                        {errors.name}
                      </span>
                    )}
                  </div>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="John Doe *"
                    value={formData.name}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full bg-transparent text-xl sm:text-2xl md:text-3xl font-display text-text placeholder:text-muted/60 py-3 focus:outline-none"
                  />
                  <div className="w-full h-[1px] bg-line relative">
                    <motion.div
                      className="absolute inset-0 bg-accent h-[2px] -top-[0.5px]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: focusedField === "name" ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </div>

                {/* Field 2: Email */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono tracking-wider uppercase text-muted">
                    <label htmlFor="contact-email" className="flex items-center gap-2">
                      <span className="text-accent font-bold">02</span>
                      <span>What&apos;s your email?</span>
                    </label>
                    {errors.email && (
                      <span className="text-xs font-mono text-danger">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="john@example.com *"
                    value={formData.email}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full bg-transparent text-xl sm:text-2xl md:text-3xl font-display text-text placeholder:text-muted/60 py-3 focus:outline-none"
                  />
                  <div className="w-full h-[1px] bg-line relative">
                    <motion.div
                      className="absolute inset-0 bg-accent h-[2px] -top-[0.5px]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </div>

                {/* Field 3: Service of Interest */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono tracking-wider uppercase text-muted">
                    <label className="flex items-center gap-2">
                      <span className="text-accent font-bold">03</span>
                      <span>What services are you looking for?</span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {serviceOptions.map((serv) => {
                      const isSelected = formData.service === serv;
                      return (
                        <button
                          key={serv}
                          type="button"
                          onClick={() => handleChange("service", serv)}
                          className={`px-4 py-2.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-accent text-accent-ink font-bold shadow-md"
                              : "bg-surface border border-line hover:border-accent text-muted hover:text-text"
                          }`}
                        >
                          {serv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 4: Message */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono tracking-wider uppercase text-muted">
                    <label htmlFor="contact-message" className="flex items-center gap-2">
                      <span className="text-accent font-bold">04</span>
                      <span>Your message</span>
                    </label>
                    {errors.message && (
                      <span className="text-xs font-mono text-danger">
                        {errors.message}
                      </span>
                    )}
                  </div>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Hello Mahmud, can you help me with... *"
                    value={formData.message}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="w-full bg-transparent text-xl sm:text-2xl font-display text-text placeholder:text-muted/60 py-3 focus:outline-none resize-none"
                  />
                  <div className="w-full h-[1px] bg-line relative">
                    <motion.div
                      className="absolute inset-0 bg-accent h-[2px] -top-[0.5px]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: focusedField === "message" ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </div>

                {/* API Error Notification */}
                {apiError && (
                  <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 flex items-center gap-3 text-danger text-xs font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                {/* SUBMIT BUTTON: Signature Dennis Snellenberg Magnetic Disc */}
                <div className="pt-6 flex justify-start">
                  <MagneticWrapper strength={0.4} innerStrength={0.65}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-accent text-accent-ink flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-300 disabled:opacity-50 cursor-pointer overflow-hidden"
                    >
                      {loading ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-accent-ink" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider">
                            Transmitting
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-center leading-tight">
                            Send it!
                          </span>
                          <div className="w-8 h-8 rounded-full bg-accent-ink/15 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                            <Send className="w-3.5 h-3.5 text-accent-ink" />
                          </div>
                        </div>
                      )}
                    </button>
                  </MagneticWrapper>
                </div>
              </motion.form>
            ) : (
              /* SUCCESS STATE WITH ANIMATED CONFIRMATION */
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="p-10 sm:p-14 rounded-3xl bg-surface border border-line text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-3xl sm:text-4xl text-text font-normal">
                  Inquiry Transmitted Successfully
                </h3>
                <p className="max-w-md mx-auto text-muted text-sm sm:text-base leading-relaxed font-normal">
                  Thank you for reaching out, <strong>{formData.name}</strong>. Mahmud has received your message and will review your project scope within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 rounded-full bg-surface-raised border border-line hover:border-accent text-xs font-mono uppercase tracking-wider text-text transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. RIGHT: CONTACT DETAILS, CHANNELS, COPY-EMAIL, LIVE TIME FROM DATABASE */}
        <div className="lg:col-span-5 space-y-8">
          {/* Direct Channels Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-line space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-accent block mb-2">
                Contact Details
              </span>
              <p className="font-display text-xl sm:text-2xl text-text font-medium break-all">
                {email}
              </p>
              <p className="text-xs font-mono text-muted mt-1">
                {phone}
              </p>
            </div>

            {/* Copy Email Button with Animated Toast */}
            <div className="relative">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full py-3.5 px-5 rounded-2xl bg-surface-raised border border-line hover:border-accent text-xs font-mono text-text flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Copy className="w-4 h-4 text-accent" />
                  <span>Copy email address</span>
                </span>
                <span className="text-muted text-[10px]">Click to copy</span>
              </button>

              {/* Toast Notification */}
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-accent text-accent-ink text-xs font-mono font-bold shadow-xl flex items-center gap-2 pointer-events-none"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Email copied to clipboard!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messaging Buttons: WhatsApp & Telegram */}
            <div className="space-y-3 pt-4 border-t border-line/60">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted block">
                Direct Channels
              </span>

              <MagneticWrapper strength={0.25} className="w-full">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-surface-raised border border-line hover:border-accent hover:text-accent text-text text-xs font-mono font-medium flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-accent" />
                    <span>WhatsApp ({phone})</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted" />
                </a>
              </MagneticWrapper>

              <MagneticWrapper strength={0.25} className="w-full">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-surface-raised border border-line hover:border-accent hover:text-accent text-text text-xs font-mono font-medium flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-4 h-4 text-accent" />
                    <span>Telegram ({phone})</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted" />
                </a>
              </MagneticWrapper>
            </div>

            {/* Social Network Links */}
            <div className="space-y-3 pt-4 border-t border-line/60">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted block">
                Social Profiles
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-surface-raised border border-line hover:border-accent text-text flex items-center justify-between transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-surface-raised border border-line hover:border-accent text-text flex items-center justify-between transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                </a>
              </div>
            </div>
          </div>

          {/* Time & Availability Card */}
          <div className="p-8 rounded-3xl bg-surface border border-line space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between text-muted">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>Local Time:</span>
              </span>
              <span className="text-text font-bold">
                {dhakaTime || "08:30 PM"} GMT+6 (Dhaka)
              </span>
            </div>

            <div className="flex items-center justify-between text-muted">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Current Status:</span>
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for Q4/2026</span>
              </span>
            </div>

            <div className="pt-3 border-t border-line flex items-center justify-between text-muted">
              <span>Expected Response:</span>
              <span className="text-text font-bold">&lt; 24 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
