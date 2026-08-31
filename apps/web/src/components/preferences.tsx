"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export function Preferences({ initialLocale, initialTheme }: { initialLocale: Locale; initialTheme: "light" | "dark" }) {
  const [locale, setLocale] = useState(initialLocale);
  const [theme, setTheme] = useState(initialTheme);

  function toggleLocale() {
    const next = locale === "en" ? "ar" : "en";
    document.cookie = `ts-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    setLocale(next);
    window.location.reload();
  }

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.cookie = `ts-theme=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  return (
    <div className="preferences" aria-label="Display preferences">
      <button className="icon-button" type="button" onClick={toggleLocale} aria-label={locale === "en" ? "العربية" : "English"}>
        <Languages size={18} strokeWidth={1.8} aria-hidden="true" />
        <span>{locale === "en" ? "AR" : "EN"}</span>
      </button>
      <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}>
        {theme === "light" ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
