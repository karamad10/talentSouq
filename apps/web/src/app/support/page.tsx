import { BRAND } from "@/lib/brand";
import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { getPreferences } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with the TalentSouq app and website: sign-in, applications, job posts, plans and your account."
};

const sections: LegalSection[] = [
  {
    title: "Contact us",
    body: <p>Email <a href={`mailto:${BRAND.email.support}`}>{BRAND.email.support}</a> and we will reply within two working days. Include the email address you sign in with and, for an employer account, your company name. In the app you can also use Profile → Contact us.</p>
  },
  {
    title: "Common questions",
    items: [
      "I didn't get my sign-up code: check your spam folder, then tap Resend on the code screen. Codes expire after a few minutes.",
      "I forgot my password: on the sign-in screen tap Forgot password and follow the email.",
      "Plans and billing: employer plans are bought and managed on the TalentSouq website, not in the app. Invoices and card details are under Billing on the website.",
      "Notifications: turn them on or off in Profile → Notifications, and in your phone's settings."
    ]
  },
  {
    title: "Your account and data",
    body: <p>You can delete your account in the app from Profile → Account → Delete account, or ask us to do it: see <a href="/delete-account">Delete your account</a>. Privacy questions go to <a href={`mailto:${BRAND.email.privacy}`}>{BRAND.email.privacy}</a>.</p>
  }
];

export default async function SupportPage() {
  const { locale, theme } = await getPreferences();

  return (
    <LegalPage
      locale={locale}
      theme={theme}
      title={{ en: "Support", ar: "الدعم" }}
      updated="2026-11-09"
      summary="Help with the TalentSouq app and website for job seekers and employers. TalentSouq is operated by Triovate Management Consultancies L.L.C, Dubai, United Arab Emirates."
      sections={sections}
      related={{
        href: "/privacy",
        label: { en: "Read the Privacy Policy", ar: "اقرأ سياسة الخصوصية" },
        text: {
          en: "How TalentSouq handles your data, and the choices you have.",
          ar: "كيف تتعامل TalentSouq مع بياناتك، والخيارات المتاحة لك."
        }
      }}
    />
  );
}
