import { ArrowRight, Mail } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/brand";
import { StoreBadges } from "@/components/public/store-badges";

/** Eyebrow → title → optional body, the standard opening of every public section. */
export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
  align = "start",
  tone = "light"
}: {
  eyebrow: string;
  title: string;
  body?: string;
  action?: { href: Route; label: string };
  align?: "start" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("flex flex-col items-start gap-6 min-[760px]:flex-row min-[760px]:flex-wrap min-[760px]:items-end min-[760px]:justify-between", align === "center" && "items-center text-center min-[760px]:flex-col min-[760px]:items-center")}>
      <div className={cn("min-w-0 max-w-2xl", align === "center" && "max-w-3xl")}>
        <p className={cn("m-0 inline-flex items-center gap-2 text-[13px] font-medium", tone === "dark" ? "text-ts-on-strong/75" : "text-ts-muted")}>
          <span aria-hidden="true" className="inline-block size-1.5 shrink-0 rounded-full bg-ts-accent" />
          {eyebrow}
        </p>
        <h2
          className={cn(
            "m-0 mt-3 text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance",
            tone === "dark" ? "text-ts-on-strong" : "text-ts-ink"
          )}
        >
          {title}
        </h2>
        {body ? (
          <p className={cn("m-0 mt-4 text-[16px] leading-relaxed text-pretty", tone === "dark" ? "text-ts-on-strong-muted" : "text-ts-muted")}>{body}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className={cn(
            "inline-flex h-11 shrink-0 items-center gap-2 rounded-ts-md px-5 text-[14px] font-semibold whitespace-nowrap transition-colors",
            tone === "dark" ? "bg-ts-on-strong text-surface-strong hover:opacity-90" : "border border-ts-line bg-ts-surface text-ts-ink hover:border-ts-primary hover:text-ts-primary-deep"
          )}
        >
          {action.label} <ArrowRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      ) : null}
    </div>
  );
}

/** Page width container shared by every public section. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] min-w-0 px-8 max-[900px]:px-6 max-[680px]:px-5", className)}>{children}</div>;
}

/** The closing conversion band, identical across the three public pages. */
export function CtaBand({ locale }: { locale: Locale }) {
  const copy = dictionary[locale].sections;
  return (
    <section className="border-t border-ts-line-soft bg-surface-strong py-[clamp(2.25rem,5vw,3.5rem)]">
      <Container className="flex flex-col gap-9 min-[900px]:flex-row min-[900px]:flex-wrap min-[900px]:items-end min-[900px]:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-ts-on-strong/60 uppercase">TalentSouq</p>
          <h2 className="m-0 mt-3 text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-ts-on-strong">{copy.finalTitle}</h2>
          <p className="m-0 mt-4 text-[16px] leading-relaxed text-pretty text-ts-on-strong-muted">{copy.finalBody}</p>
        </div>
        <div className="flex flex-col items-stretch gap-3 min-[520px]:flex-row min-[520px]:flex-wrap min-[520px]:items-center">
          <Link
            href="/auth/login?mode=signup"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-ts-md bg-ts-on-strong px-6 text-[15px] font-semibold text-surface-strong transition-opacity hover:opacity-90"
          >
            {copy.start} <ArrowRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
          <Link
            href="/jobs"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-ts-md border border-ts-on-strong/25 px-6 text-[15px] font-semibold text-ts-on-strong-muted transition-colors hover:border-ts-on-strong/45 hover:text-ts-on-strong"
          >
            {copy.viewAll}
          </Link>
        </div>
      </Container>
    </section>
  );
}

export function PublicFooter({ locale }: { locale: Locale }) {
  const copy = dictionary[locale];
  const columns: { title: string; links: { href: Route; label: string }[] }[] = [
    {
      title: copy.footer.product,
      links: [
        { href: "/jobs", label: copy.nav.jobs },
        { href: "/companies", label: copy.nav.companies },
        { href: "/download", label: locale === "ar" ? "احصل على التطبيق" : "Get the app" }
      ]
    },
    {
      title: copy.footer.company,
      links: [
        { href: "/auth/login?mode=signup", label: copy.sections.start },
        { href: "/auth/login", label: copy.nav.login }
      ]
    },
    {
      title: copy.footer.legal,
      links: [
        { href: "/privacy", label: locale === "ar" ? "الخصوصية" : "Privacy" },
        { href: "/terms", label: locale === "ar" ? "الشروط" : "Terms" }
      ]
    }
  ];

  return (
    <footer className="border-t border-ts-on-strong/10 bg-surface-strong py-[clamp(2rem,4vw,2.75rem)]">
      <Container className="grid grid-cols-2 gap-8 min-[560px]:grid-cols-3 min-[900px]:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] min-[900px]:gap-8">
        <div className="col-span-full min-w-0 min-[900px]:col-span-1">
          <Logo inverted />
          <p className="m-0 mt-3 max-w-xs text-sm leading-relaxed text-ts-on-strong-muted">{copy.footer.tagline}</p>
          <a
            href={`mailto:${BRAND.email.support}`}
            className="tap-target mt-4 inline-flex items-center gap-2 text-sm font-medium text-ts-on-strong/85 transition-colors hover:text-ts-on-strong"
          >
            <Mail size={16} aria-hidden="true" className="shrink-0" />
            {BRAND.email.support}
          </a>
          <div className="mt-4 flex items-center gap-2">
            <SocialLink href={BRAND.social.linkedin} label="LinkedIn">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.35h-4v-4.75c0-1.13-.02-2.59-1.58-2.59-1.58 0-1.82 1.23-1.82 2.5v4.84h-4v-11Z" />
            </SocialLink>
            <SocialLink href={BRAND.social.instagram} label="Instagram">
              <path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5-8.95a1.12 1.12 0 1 0 0 2.24 1.12 1.12 0 0 0 0-2.24ZM12 2.5c-2.58 0-2.9.01-3.92.06-1.01.05-1.7.2-2.31.44a4.66 4.66 0 0 0-1.68 1.1 4.66 4.66 0 0 0-1.1 1.68c-.23.6-.39 1.3-.44 2.31C2.51 9.1 2.5 9.42 2.5 12s.01 2.9.06 3.92c.05 1.01.2 1.7.44 2.31.24.63.57 1.16 1.1 1.68.52.53 1.05.86 1.68 1.1.6.23 1.3.39 2.31.44 1.01.05 1.34.06 3.92.06s2.9-.01 3.92-.06c1.01-.05 1.7-.2 2.31-.44a4.66 4.66 0 0 0 1.68-1.1c.53-.52.86-1.05 1.1-1.68.23-.6.39-1.3.44-2.31.05-1.01.06-1.34.06-3.92s-.01-2.9-.06-3.92c-.05-1.01-.2-1.7-.44-2.31a4.66 4.66 0 0 0-1.1-1.68 4.66 4.66 0 0 0-1.68-1.1c-.6-.23-1.3-.39-2.31-.44C14.9 2.51 14.58 2.5 12 2.5Zm0 1.71c2.54 0 2.84.01 3.84.06.93.04 1.43.2 1.77.33.44.17.76.38 1.09.71.33.33.54.65.71 1.09.13.34.29.84.33 1.77.05 1 .06 1.3.06 3.84s-.01 2.84-.06 3.84c-.04.93-.2 1.43-.33 1.77-.17.44-.38.76-.71 1.09-.33.33-.65.54-1.09.71-.34.13-.84.29-1.77.33-1 .05-1.3.06-3.84.06s-2.84-.01-3.84-.06c-.93-.04-1.43-.2-1.77-.33a2.95 2.95 0 0 1-1.09-.71 2.95 2.95 0 0 1-.71-1.09c-.13-.34-.29-.84-.33-1.77-.05-1-.06-1.3-.06-3.84s.01-2.84.06-3.84c.04-.93.2-1.43.33-1.77.17-.44.38-.76.71-1.09.33-.33.65-.54 1.09-.71.34-.13.84-.29 1.77-.33 1-.05 1.3-.06 3.84-.06Z" />
            </SocialLink>
          </div>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-2">
            <strong className="text-[11px] font-semibold tracking-[0.18em] text-ts-on-strong/60 uppercase">{column.title}</strong>
            {column.links.map((link) => (
              <Link key={`${column.title}-${link.label}`} href={link.href} className="tap-target text-sm text-ts-on-strong/75 transition-colors hover:text-ts-on-strong">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </Container>
      <Container className="mt-8">
        <StoreBadges locale={locale} size={40} />
      </Container>
      <Container className="mt-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-ts-on-strong/10 pt-4 text-[13px] text-ts-on-strong/60">
        <span>{BRAND.cities}</span>
        <span>
          © {new Date().getFullYear()} TalentSouq ·{" "}
          <a
            href={BRAND.parentUrl}
            target="_blank"
            rel="noopener"
            className="text-ts-on-strong/75 underline decoration-ts-on-strong/25 underline-offset-4 transition-colors hover:text-ts-accent hover:decoration-ts-accent"
          >
            {BRAND.signature}
          </a>
        </span>
      </Container>
    </footer>
  );
}

/** A round social icon on the dark footer: quiet at rest, the brand orange on hover and focus. */
function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`TalentSouq on ${label}`}
      className="grid size-10 place-items-center rounded-full border border-ts-on-strong/20 text-ts-on-strong/75 transition-colors hover:border-ts-accent hover:bg-ts-accent hover:text-ts-on-accent focus-visible:border-ts-accent focus-visible:text-ts-accent focus-visible:outline-none"
    >
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
