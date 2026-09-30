/**
 * The brand in one place (report RPT-2026-014 §6–7, §10).
 *
 * - One tagline across the site and the app.
 * - "by Triovate" is the parent-brand signature, Latin in both languages.
 * - Every published address is on talentsouq.it.com, the domain the company
 *   controls. talentsouq.com belongs to someone else and never received mail.
 *   If the brand domain changes, edit it here.
 */
export const BRAND = {
  name: "TalentSouq",
  nameAr: "تالنت سوق",
  signature: "by Triovate",
  origin: "https://talentsouq.it.com",
  tagline: { en: "Opportunity meets ambition.", ar: "الفرصة تلتقي بالطموح." },
  email: { privacy: "privacy@talentsouq.it.com", hello: "hello@talentsouq.it.com" },
  cities: "Dubai · Riyadh · Doha · Damascus"
} as const;
