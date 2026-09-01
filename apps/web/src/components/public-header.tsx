import { Menu } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";
import type { SessionUser } from "@/lib/auth/session";
import { Logo } from "./logo";
import { Preferences } from "./preferences";

function initialsFromEmail(email: string) {
  const name = email.split("@")[0] ?? email;
  const parts = name.split(/[.\-_]/).filter(Boolean);
  const letters = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
  return letters.toUpperCase();
}

export function PublicHeader({ locale, theme = "light", overlay = false, user = null }: { locale: Locale; theme?: "light" | "dark"; overlay?: boolean; user?: SessionUser | null }) {
  const copy = dictionary[locale].nav;
  const dashboardHref = user?.role === "employer" ? "/employer" : "/seeker";
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
          {user ? (
            <Link className="icon-button" href={dashboardHref} aria-label={locale === "ar" ? "الذهاب إلى لوحة التحكم" : "Go to your dashboard"} title={user.email}>
              {initialsFromEmail(user.email)}
            </Link>
          ) : (
            <>
              <Link className="text-link login-link" href="/auth/login">{copy.login}</Link>
              <Link className="button button-small button-coral" href="/auth/login?mode=signup">{locale === "ar" ? "انضم الآن" : "Join now"}</Link>
            </>
          )}
          <details className="mobile-menu">
            <summary className="icon-button" aria-label="Open menu"><Menu size={22} /></summary>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              <Link href="/jobs">{copy.jobs}</Link>
              <Link href="/companies">{copy.companies}</Link>
              <Link href="/#employers">{copy.forEmployers}</Link>
              {user ? (
                <>
                  <Link href={dashboardHref}>{locale === "ar" ? "لوحة التحكم" : "Dashboard"}</Link>
                  <form action={signOut}><button type="submit">{locale === "ar" ? "تسجيل الخروج" : "Sign out"}</button></form>
                </>
              ) : (
                <Link href="/auth/login">{copy.login}</Link>
              )}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
