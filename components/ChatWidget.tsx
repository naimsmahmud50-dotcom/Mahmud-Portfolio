"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, Loader2, MessageCircle } from "lucide-react";
import MagneticWrapper from "./MagneticWrapper";
import { useI18n } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

// Lightweight, safe markdown formatter for links, bold, bullets, and line breaks
function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="h-1" />;
        }

        // Parse markdown links [text](url) and bold **text**
        const parts: React.ReactNode[] = [];
        const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }

          if (match[1] && match[2]) {
            // Link
            parts.push(
              <a
                key={`${lIdx}-${match.index}`}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline font-semibold hover:opacity-85 transition-opacity"
              >
                {match[1]}
              </a>
            );
          } else if (match[3]) {
            // Bold
            parts.push(
              <strong key={`${lIdx}-${match.index}`} className="text-text font-bold">
                {match[3]}
              </strong>
            );
          }

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }

        const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");

        return (
          <p key={lIdx} className={isBullet ? "pl-2 flex items-start gap-1.5" : ""}>
            {parts}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "bot",
      text: "Hello! I am Mahmud Hasan's AI Assistant. Ask me how any of his projects work (like Madrasah Ecosystem or AI Agents), his tech stack, or how to directly collaborate with him.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { lang } = useI18n();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const query = messageText || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "I am currently unable to answer that question.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Direct connection available: You can reach Mahmud directly on WhatsApp ([+880 1767-850859](https://wa.me/8801767850859)) or email [mahmudhasan.infodev@gmail.com](mailto:mahmudhasan.infodev@gmail.com).",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <MagneticWrapper strength={0.35}>
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            aria-label="Open AI Assistant"
            className="group relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-surface-2 border border-line-strong text-text font-semibold text-xs font-mono uppercase tracking-wider shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-accent hover:text-accent active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <Bot className="w-4 h-4 text-accent" />
            <span>{lang === "bn" ? "মাহমুদ এআই সহকারী" : "Ask Mahmud AI"}</span>
          </button>
        </MagneticWrapper>
      )}

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="w-[92vw] sm:w-[420px] h-[580px] rounded-3xl border border-line bg-surface shadow-2xl flex flex-col overflow-hidden text-text"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-line bg-surface-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-soft border border-accent/25 flex items-center justify-center text-accent">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-sm text-text">
                    {lang === "bn" ? "মাহমুদ এআই অ্যাসিস্ট্যান্ট" : "Ask Mahmud AI"}
                  </h4>
                  <p className="text-[10px] font-mono text-success flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Ultra-Fast Verified AI Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Instant WhatsApp Quick Link */}
                <a
                  href="https://wa.me/8801767850859"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Direct WhatsApp (+880 1767-850859)"
                  className="w-8 h-8 rounded-full bg-surface-2 hover:bg-surface border border-line flex items-center justify-center text-success transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  aria-label="Close chat"
                  className="w-8 h-8 rounded-full bg-surface hover:bg-surface-2 border border-line flex items-center justify-center text-muted hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-sans">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] px-4 py-3 rounded-2xl ${
                      m.sender === "user"
                        ? "bg-accent text-accent-ink font-medium rounded-br-none"
                        : "bg-surface-2 border border-line text-text rounded-bl-none"
                    }`}
                  >
                    <FormattedMessage text={m.text} />
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-surface-2 border border-line text-muted rounded-bl-none flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                    <span className="text-[11px] font-mono">Formulating response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="px-4 py-2 bg-surface border-t border-line flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSend("What tech stack does Mahmud use for web apps?")}
                className="shrink-0 px-2.5 py-1 rounded-full bg-surface-2 border border-line-strong text-[10px] font-mono text-text-2 hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                Web Stack?
              </button>
              <button
                onClick={() => handleSend("Tell me about the Madrasah Ecosystem project")}
                className="shrink-0 px-2.5 py-1 rounded-full bg-surface-2 border border-line-strong text-[10px] font-mono text-text-2 hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                Madrasah App?
              </button>
              <button
                onClick={() => handleSend("How can I hire Mahmud or contact him?")}
                className="shrink-0 px-2.5 py-1 rounded-full bg-surface-2 border border-line-strong text-[10px] font-mono text-text-2 hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                How to Hire?
              </button>
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-surface-2 border-t border-line flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                maxLength={500}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  lang === "bn"
                    ? "মাহমুদের কাজ সম্পর্কে প্রশ্ন করুন..."
                    : "Ask about Mahmud's projects or skills..."
                }
                className="flex-1 bg-surface border border-line px-3.5 py-2.5 rounded-xl text-xs text-text placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-9 h-9 rounded-xl bg-accent text-accent-ink flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
