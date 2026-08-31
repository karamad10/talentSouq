import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { PublicHeader } from "@/components/public-header";

export type LegalSection = {
  title: string;
  body?: ReactNode;
  items?: string[];
};

export function LegalPage({
  locale,
  theme,
  eyebrow = "Legal",
  title,
  summary,
  updated,
  sections,
  related
}: {
  locale: Locale;
  theme: "light" | "dark";
  eyebrow?: string;
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
  related: {
    href: "/privacy" | "/terms";
    label: string;
    text: string;
  };
}) {
  return (
    <main className="page-shell legal-shell">
      <PublicHeader locale={locale} theme={theme} />
      <article className="legal-page container">
        <header className="legal-hero">
          <Link href="/" className="legal-home-link">
            TalentSouq
          </Link>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="legal-summary">{summary}</p>
          <div className="legal-meta">
            <span>Last updated: {updated}</span>
            <a href="mailto:privacy@talentsouq.com">privacy@talentsouq.com</a>
          </div>
        </header>

        <div className="legal-content">
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
          <p>{related.text}</p>
          <Link href={related.href}>{related.label}</Link>
        </footer>
      </article>
    </main>
  );
}
