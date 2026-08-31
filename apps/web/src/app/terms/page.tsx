import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { isLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Service · TalentSouq",
  description: "Review the rules, responsibilities, paid plan notes, disclaimers, and contact details for using TalentSouq."
};

const sections: LegalSection[] = [
  {
    title: "Eligibility and accounts",
    body: <p>You must be at least 16 and legally able to enter this agreement. Keep account details accurate and credentials secure. You are responsible for activity under your account and must promptly report suspected unauthorized access.</p>
  },
  {
    title: "The service",
    body: <p>TalentSouq helps seekers discover and apply for jobs and helps employers publish roles and manage applicants. We are not an employer, recruitment agency, or party to agreements between users. We do not guarantee interviews, hires, candidates, job availability, or the accuracy of user content.</p>
  },
  {
    title: "User responsibilities",
    items: [
      "Provide lawful, accurate, and non-misleading content and only upload information you have the right to use.",
      "Do not discriminate unlawfully, impersonate others, scrape the service, send spam, introduce malware, evade access controls, or use TalentSouq for fraud or illegal activity.",
      "Employers are responsible for job-posting legality, hiring decisions, and all employment-related obligations."
    ]
  },
  {
    title: "Content and privacy",
    body: <p>You retain ownership of your content and grant TalentSouq a limited, worldwide licence to host, process, reproduce, and display it only as needed to provide, secure, and improve the service. Our <Link href="/privacy">Privacy Policy</Link> explains how personal data is handled.</p>
  },
  {
    title: "Organization plans",
    body: <p>Certain employer features may require an eligible paid organization plan. Purchases and plan changes are not offered inside the mobile app. If your organization has acquired a plan through an authorized channel, its features become available when the entitlement is active. Applicable order terms control price, renewal, cancellation, taxes, and refunds.</p>
  },
  {
    title: "Moderation and termination",
    body: <p>We may review, restrict, hide, or remove content and may suspend or terminate accounts that violate these Terms, create risk, or are required to be restricted by law. You may stop using the service and delete your account in the app.</p>
  },
  {
    title: "Third-party services",
    body: <p>The service relies on providers including Supabase, Stripe, Expo, and Sentry and may link to third-party services. Their own terms and privacy practices apply. We are not responsible for third-party services outside our control.</p>
  },
  {
    title: "Disclaimers and liability",
    body: <p>To the maximum extent permitted by law, TalentSouq is provided as is and as available without implied warranties. TalentSouq is not liable for indirect, incidental, special, consequential, or punitive loss, lost profits, lost opportunities, or user conduct. Our aggregate liability is limited to the greater of AED 500 or the fees you paid us in the 12 months before the claim. These limits do not apply where prohibited by law.</p>
  },
  {
    title: "Governing law and changes",
    body: <p>These Terms are governed by the laws of the United Arab Emirates, without regard to conflict-of-law rules, subject to mandatory consumer protections that apply where you live. We may update these Terms and will post the revised date. Material changes may also be communicated in the service.</p>
  },
  {
    title: "Contact",
    body: <p>Questions can be sent to <a href="mailto:privacy@talentsouq.com">privacy@talentsouq.com</a>. TalentSouq L.L.C, Amsterdam, Netherlands.</p>
  }
];

export default async function TermsPage() {
  const store = await cookies();
  const value = store.get("ts-locale")?.value;
  const locale = isLocale(value) ? value : "en";
  const theme = store.get("ts-theme")?.value === "dark" ? "dark" : "light";

  return (
    <LegalPage
      locale={locale}
      theme={theme}
      title="Terms of Service"
      updated="11 August 2026"
      summary="These Terms govern your use of TalentSouq. By creating an account or using the service, you agree to them. If you use TalentSouq for an organization, you confirm that you are authorized to bind that organization."
      sections={sections}
      related={{
        href: "/privacy",
        label: "Read the Privacy Policy",
        text: "The Terms explain how TalentSouq can be used. The Privacy Policy explains how personal data is handled."
      }}
    />
  );
}
