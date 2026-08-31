import { Menu } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";
import { Logo } from "./logo";
import { Preferences } from "./preferences";

export function PublicHeader({ locale, theme = "light", overlay = false }: { locale: Locale; theme?: "light" | "dark"; overlay?: boolean }) {
  const copy = dictionary[locale].nav;
  return (
    <header className={`site-header${overlay ? " site-header-overlay" : ""}`}>
      <div className="container header-inner">
        <Logo inverted={overlay} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/jobs">{copy.jobs}</Link>
          <Link href="/companies">{copy.companies}</Link>
          <Link href="/#employers">{copy.forEmployers}</Link>
        </nav>
        <div className="header-actions">
          <Preferences initialLocale={locale} initialTheme={theme} />
          <Link className="text-link login-link" href="/auth/login">{copy.login}</Link>
          <Link className="button button-small button-coral" href="/auth/login?mode=signup">{locale === "ar" ? "انضم الآن" : "Join now"}</Link>
          <details className="mobile-menu">
            <summary className="icon-button" aria-label="Open menu"><Menu size={22} /></summary>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              <Link href="/jobs">{copy.jobs}</Link>
              <Link href="/companies">{copy.companies}</Link>
              <Link href="/#employers">{copy.forEmployers}</Link>
              <Link href="/auth/login">{copy.login}</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
