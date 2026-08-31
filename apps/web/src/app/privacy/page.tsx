import { cookies } from "next/headers";
import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { isLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy · TalentSouq",
  description: "Learn what personal data TalentSouq collects, how it is used, and the choices available to job seekers and employers."
};

const sections: LegalSection[] = [
  {
    title: "Data we collect",
    items: [
      "Account and contact information, including name, email address, optional phone number, role, and authentication records.",
      "Profile and recruitment content, including photos, company details, CVs, job posts, applications, cover letters, skills, and messages.",
      "Subscription records, including Stripe customer identifiers, plan, status, and billing cycle. TalentSouq does not receive or store full payment-card details.",
      "Technical data needed to operate and secure the service, including push tokens, app interactions, crash reports, diagnostics, and security logs."
    ]
  },
  {
    title: "How we use data",
    items: [
      "Provide accounts, profiles, job discovery, applications, messaging, notifications, and employer features.",
      "Authenticate users, prevent abuse, secure the service, provide support, and diagnose reliability issues.",
      "Process employer subscriptions, maintain plan entitlements, comply with law, and enforce our Terms."
    ]
  },
  {
    title: "When data is shared",
    body: <p>Recruitment content is shared with other users only as the service requires—for example, an employer can see information a seeker submits with an application, and seekers can see published employer and job information. We use Supabase for authentication, database, and file storage; Stripe for payment processing; Expo for push delivery; and Sentry for crash diagnostics. We do not sell personal data or share it for third-party advertising.</p>
  },
  {
    title: "Legal bases and international transfers",
    body: <p>Depending on where you live, we process data to perform our contract with you, pursue legitimate interests such as security and service improvement, comply with legal obligations, and act on consent where required. Service providers may process data outside your country. Where applicable, we use contractual and other safeguards required for international transfers.</p>
  },
  {
    title: "Retention and security",
    body: <p>We retain information while your account is active and as needed for the purposes above. After deletion, limited records may be retained where legally required or necessary to resolve disputes and prevent fraud. We use access controls, encryption in transit, row-level database policies, and other reasonable safeguards, but no system can guarantee absolute security.</p>
  },
  {
    title: "Your choices and rights",
    body: <p>You can update profile information and notification preferences in the app. You can delete your account from Profile → Account → Delete account. Depending on your location, you may also request access, correction, deletion, restriction, portability, or object to processing, and may complain to your local data-protection authority.</p>
  },
  {
    title: "Children",
    body: <p>TalentSouq is not intended for children under 16. We do not knowingly collect personal data from children under 16.</p>
  },
  {
    title: "Changes and contact",
    body: <p>We may update this policy and will post the revised date here. Questions or privacy requests can be sent to <a href="mailto:privacy@talentsouq.com">privacy@talentsouq.com</a>. The responsible entity is TalentSouq L.L.C, Amsterdam, Netherlands.</p>
  }
];

export default async function PrivacyPage() {
  const store = await cookies();
  const value = store.get("ts-locale")?.value;
  const locale = isLocale(value) ? value : "en";
  const theme = store.get("ts-theme")?.value === "dark" ? "dark" : "light";

  return (
    <LegalPage
      locale={locale}
      theme={theme}
      title="Privacy Policy"
      updated="11 August 2026"
      summary="TalentSouq L.L.C operates the TalentSouq recruitment platform for job seekers and employers. This policy explains what data we collect, why we use it, and the choices available to you."
      sections={sections}
      related={{
        href: "/terms",
        label: "Read the Terms of Service",
        text: "The Privacy Policy explains how data is handled. The Terms explain the rules for using TalentSouq."
      }}
    />
  );
}
