import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { PublicHeader } from "@/components/public-header";
import { BRAND } from "@/lib/brand";
import { formatDate } from "@/lib/labels";

export type LegalSection = {
  title: string;
  body?: ReactNode;
  items?: string[];
};

type Bilingual = { en: string; ar: string };

/**
 * A legal document. The chrome (eyebrow, title, dates, links) follows the
 * visitor's language; the body is English until an approved Arabic translation
 * exists, and says so to an Arabic reader.
 */
export function LegalPage({
  locale,
  theme,
  title,
  summary,
  updated,
  sections,
  related
}: {
  locale: Locale;
  theme: "light" | "dark";
  title: Bilingual;
  summary: string;
  /** ISO date of the last revision. */
  updated: string;
  sections: LegalSection[];
  related: {
    href: "/privacy" | "/terms";
    label: Bilingual;
    text: Bilingual;
  };
}) {
  const arabic = locale === "ar";
  // The body is English-only for now; mark it so it lays out left-to-right inside an Arabic page.
  const body = arabic ? ({ lang: "en", dir: "ltr" } as const) : {};
  return (
    <main className="page-shell legal-shell">
      <PublicHeader locale={locale} theme={theme} />
      <article className="legal-page container">
        <header className="legal-hero">
          <Link href="/" className="legal-home-link">
            TalentSouq
          </Link>
          <p className="eyebrow">{arabic ? "قانوني" : "Legal"}</p>
          <h1>{title[locale]}</h1>
          {arabic ? <p className="legal-summary">النص القانوني متاح حالياً باللغة الإنجليزية.</p> : null}
          <p className="legal-summary" {...body}>
            {summary}
          </p>
          <div className="legal-meta">
            <span>
              {arabic ? "آخر تحديث:" : "Last updated:"} {formatDate(updated, locale)}
            </span>
            <span>By Triovate</span>
            <a href={`mailto:${BRAND.email.privacy}`}>{BRAND.email.privacy}</a>
          </div>
        </header>

        <div className="legal-content" {...body}>
          {sections.map((section, index) => (
            <section className="legal-section" key={section.title}>
              <span className="legal-section-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{section.title}</h2>
                {section.body}
                {section.items && (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <footer className="legal-footer-card">
          <p>{related.text[locale]}</p>
          <Link href={related.href}>{related.label[locale]}</Link>
        </footer>
      </article>
    </main>
  );
}
