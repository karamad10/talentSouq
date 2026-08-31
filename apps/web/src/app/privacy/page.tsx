import { cookies } from "next/headers";
import { PublicHeader } from "@/components/public-header";
import { isLocale } from "@/lib/i18n";

export default async function PrivacyPage() {
  const store = await cookies(); const value = store.get("ts-locale")?.value; const locale = isLocale(value) ? value : "en";
  return <main className="page-shell"><PublicHeader locale={locale} theme={store.get("ts-theme")?.value === "dark" ? "dark" : "light"} /><article className="legal container"><p className="eyebrow">Legal</p><h1>Privacy policy</h1><p className="legal-updated">Draft · Last updated 31 August 2026</p><p>TalentSouq is committed to handling personal information with care and transparency. This implementation placeholder must be replaced with owner-approved legal copy before launch.</p><h2>Information we use</h2><p>We use account, profile, application, organization, and communication information to provide the services you request, protect the platform, and improve your experience.</p><h2>Your choices</h2><p>You can update your profile and preferences, request access or correction, and begin account deletion from your account settings once authentication is connected.</p></article></main>;
}
