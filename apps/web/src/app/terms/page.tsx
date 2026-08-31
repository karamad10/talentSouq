import { cookies } from "next/headers";
import { PublicHeader } from "@/components/public-header";
import { isLocale } from "@/lib/i18n";

export default async function TermsPage() {
  const store = await cookies(); const value = store.get("ts-locale")?.value; const locale = isLocale(value) ? value : "en";
  return <main className="page-shell"><PublicHeader locale={locale} theme={store.get("ts-theme")?.value === "dark" ? "dark" : "light"} /><article className="legal container"><p className="eyebrow">Legal</p><h1>Terms of service</h1><p className="legal-updated">Draft · Last updated 31 August 2026</p><p>These draft terms describe the expected use of TalentSouq. They are a structural placeholder and must be replaced with owner-approved legal copy before public launch.</p><h2>Using TalentSouq</h2><p>Use the service lawfully, keep your account details accurate, and respect the privacy and rights of other people and organizations.</p><h2>Accounts and content</h2><p>You are responsible for your account activity and the content you submit. TalentSouq may restrict access when necessary to protect users or comply with law.</p></article></main>;
}
