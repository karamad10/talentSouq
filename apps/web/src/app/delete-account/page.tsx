import { BRAND } from "@/lib/brand";
import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { getPreferences } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Delete your account",
  description: "How to delete your TalentSouq account and data, in the app or by email, and what is deleted."
};

const sections: LegalSection[] = [
  {
    title: "In the app",
    body: <p>Sign in, then go to Profile → Account → Delete account and confirm. Your account is deleted straight away.</p>
  },
  {
    title: "Without the app",
    body: <p>Email <a href={`mailto:${BRAND.email.privacy}?subject=Delete%20my%20TalentSouq%20account`}>{BRAND.email.privacy}</a> from the address you sign in with, with the subject &quot;Delete my TalentSouq account&quot;. We confirm by reply and delete the account within 30 days.</p>
  },
  {
    title: "What is deleted",
    items: [
      "Your sign-in, profile, photo, CVs and other files you uploaded.",
      "Your applications, saved jobs, messages you sent, and notification settings.",
      "For an employer: your membership of the company account. To close the whole company account with its job posts, email us as above."
    ]
  },
  {
    title: "What may be kept",
    body: <p>Payment and invoice records may be kept where tax or accounting law requires, and limited records where needed to resolve disputes or prevent fraud, as described in the <a href="/privacy">Privacy Policy</a>. Stripe keeps its own payment records under its policy.</p>
  }
];

export default async function DeleteAccountPage() {
  const { locale, theme } = await getPreferences();

  return (
    <LegalPage
      locale={locale}
      theme={theme}
      title={{ en: "Delete your account", ar: "حذف حسابك" }}
      updated="2026-11-09"
      summary="TalentSouq (by Triovate Management Consultancies L.L.C) lets job seekers and employers delete their account and data at any time."
      sections={sections}
      related={{
        href: "/privacy",
        label: { en: "Read the Privacy Policy", ar: "اقرأ سياسة الخصوصية" },
        text: {
          en: "What data TalentSouq collects and how long it is kept.",
          ar: "ما البيانات التي تجمعها TalentSouq ومدة الاحتفاظ بها."
        }
      }}
    />
  );
}
