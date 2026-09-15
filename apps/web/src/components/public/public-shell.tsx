import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import type { Locale } from "@/lib/i18n";
import { dictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";

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
        <p className={cn("m-0 text-xs font-bold tracking-[0.12em] uppercase", tone === "dark" ? "text-ts-primary-deep" : "text-ts-primary")}>{eyebrow}</p>
        <h2
          className={cn(
            "m-0 mt-3 text-[clamp(1.6rem,5.5vw,2.9rem)] leading-[1.1] font-bold tracking-[-0.03em]",
            tone === "dark" ? "text-white" : "text-ts-ink"
          )}
        >
          {title}
        </h2>
        {body ? (
          <p className={cn("m-0 mt-4 text-[16px] leading-relaxed min-[680px]:text-[17px]", tone === "dark" ? "text-white/70" : "text-ts-muted")}>{body}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className={cn(
            "inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-6 text-[15px] font-bold whitespace-nowrap transition-colors",
            tone === "dark" ? "bg-white text-ts-ink hover:bg-white/90" : "border border-ts-line bg-ts-surface text-ts-ink hover:border-ts-primary hover:text-ts-primary-deep"
          )}
        >
          {action.label} <ArrowRight size={17} aria-hidden="true" className="rtl:-scale-x-100" />
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
    <section className="bg-ts-ink py-20 max-[680px]:py-14">
      <Container className="flex flex-col gap-8 min-[900px]:flex-row min-[900px]:flex-wrap min-[900px]:items-center min-[900px]:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="m-0 text-xs font-bold tracking-[0.12em] text-ts-accent uppercase">TalentSouq</p>
          <h2 className="m-0 mt-3 text-[clamp(1.6rem,5.5vw,2.9rem)] leading-[1.1] font-bold tracking-[-0.03em] text-white">{copy.finalTitle}</h2>
          <p className="m-0 mt-4 text-[16px] leading-relaxed text-white/70 min-[680px]:text-[17px]">{copy.finalBody}</p>
        </div>
        <div className="flex flex-col items-stretch gap-3 min-[520px]:flex-row min-[520px]:flex-wrap min-[520px]:items-center">
          <Link
            href="/auth/login?mode=signup"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ts-accent px-7 text-base font-bold text-[#1d2525] transition-transform hover:-translate-y-0.5"
          >
            {copy.start} <ArrowRight size={18} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
          <Link
            href="/jobs"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-base font-bold text-white transition-colors hover:bg-white/10"
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
        { href: "/#employers", label: copy.nav.forEmployers }
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
    <footer className="border-t border-white/10 bg-ts-ink py-14">
      <Container className="grid grid-cols-2 gap-8 min-[560px]:grid-cols-3 min-[900px]:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] min-[900px]:gap-10">
        <div className="col-span-full min-w-0 min-[900px]:col-span-1">
          <Logo inverted />
          <p className="m-0 mt-4 max-w-xs text-sm leading-relaxed text-white/60">{copy.footer.tagline}</p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <strong className="text-xs font-bold tracking-[0.12em] text-white/50 uppercase">{column.title}</strong>
            {column.links.map((link) => (
              <Link key={`${column.title}-${link.label}`} href={link.href} className="tap-target text-sm font-medium text-white/80 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </Container>
      <Container className="mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/10 pt-6 text-[13px] text-white/50">
        <span>Dubai · Riyadh · Doha</span>
        <span>© 2026 TalentSouq</span>
      </Container>
    </footer>
  );
}
