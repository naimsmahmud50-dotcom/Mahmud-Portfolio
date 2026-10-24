import React from "react";
import { Quote } from "lucide-react";
import type { TestimonialData } from "@/lib/data";

const fallbackTestimonials = [
  {
    quote:
      "Mahmud brought an unmatched level of technical precision to our Madrasah platform. What used to take days of manual paper tracking is now handled seamlessly via Flutter and automated WhatsApp notifications.",
    author: "Madrasah Ecosystem Partner",
    role: "Education Administration",
    badge: "Verified Production System",
  },
  {
    quote:
      "The autonomous prospecting engine Mahmud designed completely transformed how we identify and qualify enterprise prospects. It operates 24/7 with zero maintenance downtime.",
    author: "B2B Outbound Director",
    role: "AI Workflow Client",
    badge: "Multi-Agent Automation",
  },
  {
    quote:
      "Travel with Maijrun's web application immediately elevated our brand authority. The speed, editorial typography, and mobile booking concierge resulted in an instant conversion jump.",
    author: "Maijrun Concierge Lead",
    role: "Travel Operations",
    badge: "High-Craft Web App",
  },
];

interface TestimonialsProps {
  testimonials?: TestimonialData[];
}

export default function Testimonials({ testimonials: propTestimonials }: TestimonialsProps = {}) {
  const items = propTestimonials && propTestimonials.length > 0 ? propTestimonials : fallbackTestimonials;
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-3">
            <Quote className="w-3.5 h-3.5" />
            <span>Client Impact</span>
          </div>
          <h2 className="title-huge text-3xl sm:text-5xl md:text-6xl font-bold text-foreground">
            Trusted by Builders &amp; Founders
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((t, idx) => (
          <div
            key={idx}
            className="p-8 rounded-3xl bg-surface border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6">
                <Quote className="w-4 h-4" />
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed italic mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-sm text-white">
                  {t.author}
                </h4>
                <p className="text-xs font-mono text-muted">{t.role}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-accent border border-accent/20">
                {t.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
