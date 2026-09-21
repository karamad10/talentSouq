import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { cookies } from "next/headers";
import { PublicHeader } from "@/components/public-header";
import { Container, PublicFooter } from "@/components/public/public-shell";
import { getSessionUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n";
import { BillingReturnRedirect } from "./billing-return-redirect";

// Where Stripe sends a customer back to after checkout or the billing portal.
//
// It exists because Stripe validates `success_url`, `cancel_url` and the
// portal's `return_url` as http(s) URLs and rejects an app scheme outright — so
// pointing them straight at `talentsouq://billing` meant the checkout session
// could not even be created. This page is the https hop that hands the customer
// back to the app, and the page a desktop buyer lands on, where there is no app
// to open.
//
// The mobile app opens checkout in an auth session bound to `talentsouq://`, so
// on a phone the redirect below closes the browser automatically.

export const metadata: Metadata = {
  title: "Back to TalentSouq",
  robots: { index: false, follow: false }
};

const APP_STORE_URL = "https://apps.apple.com/app/id6778230487";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.karehan.app";

export default async function BillingReturnPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [resolved, cookieStore, user] = await Promise.all([searchParams, cookies(), getSessionUser()]);
  const rawLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const arabic = locale === "ar";
  const canceled = resolved.status === "cancel";
  const deepLink = `talentsouq://billing${resolved.status ? `?status=${encodeURIComponent(resolved.status)}` : ""}`;

  const title = canceled
    ? arabic ? "تم إلغاء الدفع" : "Checkout canceled"
    : arabic ? "تم تفعيل اشتراكك" : "You're all set";
  const body = canceled
    ? arabic
      ? "لم يتم خصم أي مبلغ. يمكنك اختيار باقة مرة أخرى من صفحة الفوترة في التطبيق."
      : "Nothing was charged. You can pick a package again from Plans & billing in the app."
    : arabic
      ? "تمت عملية الدفع بنجاح. تم تحديث باقتك وأرصدتك — افتح التطبيق لرؤيتها."
      : "Your payment went through. Your package and its allowances are updated — open the app to see them.";

  return (
    <>
      <PublicHeader locale={locale} user={user} />
      <main className="py-20 max-[680px]:py-14">
        <Container className="max-w-2xl">
          <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-8 max-[680px]:p-6">
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-full bg-ts-primary/10 text-ts-primary"
            >
              {canceled ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
            </span>
            <h1 className="m-0 mt-5 text-[clamp(1.5rem,4vw,2.1rem)] leading-tight font-bold tracking-[-0.02em] text-ts-ink">
              {title}
            </h1>
            <p className="m-0 mt-3 text-[16px] leading-relaxed text-ts-muted">{body}</p>

            <BillingReturnRedirect deepLink={deepLink} />

            <a
              href={deepLink}
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-ts-primary px-7 text-base font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {arabic ? "افتح التطبيق" : "Open the app"}
            </a>

            <p className="m-0 mt-6 text-sm text-ts-muted">
              {arabic ? "على الكمبيوتر؟ افتح تطبيق TalentSouq على هاتفك — " : "On a computer? Just open TalentSouq on your phone — "}
              <a href={APP_STORE_URL} className="font-semibold text-ts-primary underline">iPhone</a>
              {" · "}
              <a href={PLAY_STORE_URL} className="font-semibold text-ts-primary underline">Android</a>
              {canceled ? "." : arabic ? ". قد يستغرق ظهور الاشتراك بضع ثوانٍ." : ". A subscription can take a few seconds to appear."}
            </p>
          </div>
        </Container>
      </main>
      <PublicFooter locale={locale} />
    </>
  );
}
