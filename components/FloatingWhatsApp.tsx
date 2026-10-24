"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact-links";

interface FloatingWhatsAppProps {
  phone: string;
}

/**
 * Floating WhatsApp CTA — fixed bottom-right, accessible,
 * positioned above mobile navigation and not blocking content.
 */
export default function FloatingWhatsApp({ phone }: FloatingWhatsAppProps) {
  const whatsappUrl = buildWhatsAppUrl(
    phone,
    "Hi Mahmud, I visited your portfolio and would like to discuss a project."
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="fixed bottom-6 left-6 z-40"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center justify-center w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300" />
      </a>

      {/* Pulse ring animation */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none"
        style={{ animationDuration: "3s" }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
