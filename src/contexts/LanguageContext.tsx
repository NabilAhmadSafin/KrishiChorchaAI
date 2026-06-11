import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("appLang") as Language;
    if (savedLang === "en" || savedLang === "bn") {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === "en" ? "bn" : "en";
      localStorage.setItem("appLang", next);
      return next;
    });
  };

  const t = (text: string | null | undefined) => {
    if (!text) return "";
    
    // Support newline separated and " | " separated dual languages
    // e.g. "English | বাংলা" or "English\nবাংলা"
    
    let parts = text.split(" | ");
    if (parts.length === 1) {
      parts = text.split("\n");
    }
    
    if (parts.length === 1) return text;
    
    return language === "en" ? parts[0] : parts[1] || parts[0];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
