"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { messages, Language } from "@/content/messages";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: typeof messages["en"];
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("mahmud_portfolio_lang") as Language;
    if (saved === "en" || saved === "bn") {
      setLang(saved);
      document.documentElement.setAttribute("lang", saved);
    } else {
      document.documentElement.setAttribute("lang", "en");
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("mahmud_portfolio_lang", newLang);
    document.documentElement.setAttribute("lang", newLang);
  };

  const toggleLang = () => {
    const nextLang: Language = lang === "en" ? "bn" : "en";
    handleSetLang(nextLang);
  };

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        toggleLang,
        t: messages[lang],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
