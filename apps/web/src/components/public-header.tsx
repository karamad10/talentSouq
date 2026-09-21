import { Menu } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";
import type { SessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { Preferences } from "./preferences";

function initialsFromEmail(email: string) {
  const name = email.split("@")[0] ?? email;
  const parts = name.split(/[.\-_]/).filter(Boolean);
  const letters = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
  return letters.toUpperCase();
}

/**
 * The public site header. `overlay` floats it over the hero image (white text,
 * transparent ground); otherwise it sits on the page surface with a hairline.
 *
 * Narrow phones can only fit the brand, one action, and the menu button, so the
 * language/theme controls and the sign-in link move into the dropdown below 560px.
 */
export function PublicHeader({ locale, theme = "light", overlay = false, user = null }: { locale: Locale; theme?: "light" | "dark"; overlay?: boolean; user?: SessionUser | null }) {
  const copy = dictionary[locale].nav;
  const dashboardHref = user?.role === "employer" ? "/employer" : "/seeker";
  // No "For employers" entry: it pointed at a home-page anchor, so from any other
  // route it just dropped you at the top of the home page with nothing to show.
  const links = [
    { href: "/jobs" as const, label: copy.jobs },
    { href: "/companies" as const, label: copy.companies }
  ];

  return (
    <header
      className={cn(
        "z-30 w-full",
        overlay ? "absolute inset-x-0 top-0 text-white" : "sticky top-0 border-b border-ts-line bg-ts-surface/95 text-ts-ink backdrop-blur"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1240px] items-center gap-4 px-8 max-[900px]:gap-3 max-[680px]:h-18 max-[680px]:px-5">
        <Logo inverted={overlay} compact="narrow" />

        <nav className="ms-8 hidden items-center gap-8 min-[900px]:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[15px] font-semibold transition-colors",
                overlay ? "text-white/80 hover:text-white" : "text-ts-muted hover:text-ts-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex min-w-0 shrink items-center gap-2 min-[560px]:gap-3">
          <Preferences initialLocale={locale} initialTheme={theme} className="max-[559px]:hidden" />
          {user ? (
            <Link
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-full text-[13px] font-bold transition-opacity hover:opacity-90",
                overlay ? "bg-white/15 text-white" : "bg-ts-primary text-white"
              )}
              href={dashboardHref}
              aria-label={locale === "ar" ? "الذهاب إلى لوحة التحكم" : "Go to your dashboard"}
              title={user.email}
            >
              {initialsFromEmail(user.email)}
            </Link>
          ) : (
            <>
              <Link
                className={cn(
                  "hidden h-11 items-center px-2 text-[15px] font-semibold transition-colors min-[560px]:inline-flex",
                  overlay ? "text-white/80 hover:text-white" : "text-ts-muted hover:text-ts-ink"
                )}
                href="/auth/login"
              >
                {copy.login}
              </Link>
              <Link
                className="inline-flex h-11 shrink-0 items-center rounded-full bg-ts-accent px-3.5 text-sm font-bold whitespace-nowrap text-[#1d2525] transition-transform hover:-translate-y-0.5 min-[400px]:px-4 min-[560px]:px-5 min-[560px]:text-[15px]"
                href="/auth/login?mode=signup"
              >
                {locale === "ar" ? "انضم الآن" : "Join now"}
              </Link>
            </>
          )}

          <details className="relative shrink-0 min-[900px]:hidden">
            <summary
              className={cn(
                "grid size-11 cursor-pointer list-none place-items-center rounded-full [&::-webkit-details-marker]:hidden",
                overlay ? "text-white" : "text-ts-ink"
              )}
              aria-label="Open menu"
            >
              <Menu size={22} aria-hidden="true" />
            </summary>
            <nav
              className="absolute end-0 top-14 z-40 flex w-[min(15rem,calc(100vw-2.5rem))] flex-col gap-1 rounded-ts-lg border border-ts-line bg-ts-surface p-2 shadow-lg"
              aria-label="Mobile navigation"
            >
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-ts-md px-3 py-2.5 text-sm font-semibold text-ts-ink hover:bg-ts-surface-2">
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href={dashboardHref} className="rounded-ts-md px-3 py-2.5 text-sm font-semibold text-ts-ink hover:bg-ts-surface-2">
                    {locale === "ar" ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                  <form action={signOut}>
                    <button type="submit" className="w-full rounded-ts-md px-3 py-2.5 text-start text-sm font-semibold text-ts-danger hover:bg-ts-danger-tint">
                      {locale === "ar" ? "تسجيل الخروج" : "Sign out"}
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/auth/login" className="rounded-ts-md px-3 py-2.5 text-sm font-semibold text-ts-ink hover:bg-ts-surface-2">
                  {copy.login}
                </Link>
              )}
              {/* Below 560px the language and theme controls do not fit in the bar. */}
              <div className="mt-1 border-t border-ts-line pt-2 text-ts-ink min-[560px]:hidden">
                <Preferences initialLocale={locale} initialTheme={theme} className="px-1 py-1" />
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
