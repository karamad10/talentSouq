import type { Metadata } from "next";
import { Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Organization invite", description: "Accept a TalentSouq organization invitation." };

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const [{ token }, cookieStore] = await Promise.all([params, cookies()]);
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";
  const shortToken = token.length > 8 ? `${token.slice(0, 8)}...` : token;
  return <main className="page-shell"><PublicHeader locale={locale} theme={theme} /><section className="invite-wrap container"><div className="invite-panel"><Building2 size={30} /><p className="eyebrow">Organization invitation</p><h1>Join your hiring team on TalentSouq.</h1><p>This invite screen is ready for the Supabase membership validation flow. Once connected, it will verify the token, show the organization, and add the user with the correct role.</p><dl><div><dt>Invite token</dt><dd>{shortToken}</dd></div><div><dt>Status</dt><dd>Backend validation pending</dd></div></dl><Link className="button button-primary button-full" href="/auth/login?mode=signup">Sign in to continue</Link><div className="invite-note"><ShieldCheck size={18} /><span>Invitation tokens must be validated on the server before any membership is created.</span></div></div><aside className="invite-steps"><h2>Expected flow</h2><ol><li><CheckCircle2 size={18} />Verify invite token and expiry.</li><li><CheckCircle2 size={18} />Authenticate the user.</li><li><CheckCircle2 size={18} />Create membership under organization RLS.</li><li><CheckCircle2 size={18} />Route to the employer workspace.</li></ol></aside></section></main>;
}
