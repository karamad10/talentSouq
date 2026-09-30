"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** Fired on window once the page shows the new language; client-only copy (e.g. the app banner) listens. */
export const LOCALE_EVENT = "ts-locale-change";

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => Promise<void>) => unknown };

export function Preferences({ initialLocale, initialTheme, className }: { initialLocale: Locale; initialTheme: "light" | "dark"; className?: string }) {
  const router = useRouter();
  const [switching, startSwitch] = useTransition();
  const [theme, setTheme] = useState(initialTheme);
  // Resolves the running swap once the refreshed server render has committed.
  const settle = useRef<(() => void) | null>(null);
  // The server render is the source of truth: after a switch the header re-renders with the new locale.
  const locale = initialLocale;

  useEffect(() => {
    if (!switching && settle.current) {
      settle.current();
      settle.current = null;
    }
  }, [switching]);

  /**
   * Re-renders the page in the other language in place — no full reload, no
   * white flash, scroll position kept. Text and direction change in the same
   * commit, inside a short cross-fade where the browser supports it, so the
   * page never shows English laid out right-to-left (or the reverse).
   */
  function toggleLocale() {
    if (settle.current) return;
    const next: Locale = locale === "en" ? "ar" : "en";
    document.cookie = `ts-locale=${next}; path=/; max-age=31536000; samesite=lax`;

    const swap = () =>
      new Promise<void>((resolve) => {
        const done = () => {
          const root = document.documentElement;
          root.lang = next;
          root.dir = next === "ar" ? "rtl" : "ltr";
          window.dispatchEvent(new Event(LOCALE_EVENT));
          resolve();
        };
        settle.current = done;
        // A refresh that never settles (offline) must not leave the page mid-transition.
        window.setTimeout(() => {
          if (settle.current === done) {
            settle.current = null;
            done();
          }
        }, 4000);
        startSwitch(() => router.refresh());
      });

    const doc = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduceMotion) doc.startViewTransition(swap);
    else void swap();
  }

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.cookie = `ts-theme=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  return (
    <div className={cn("preferences", className)} aria-label="Display preferences">
      <button className="icon-button" type="button" onClick={toggleLocale} aria-busy={switching} aria-label={locale === "en" ? "العربية" : "English"}>
        <Languages size={18} strokeWidth={1.8} aria-hidden="true" />
        <span>{locale === "en" ? "AR" : "EN"}</span>
      </button>
      <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}>
        {theme === "light" ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const id = window.setTimeout(() => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light"), 0);
    return () => window.clearTimeout(id);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.cookie = `ts-theme=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  return <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}>{theme === "light" ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}</button>;
}
