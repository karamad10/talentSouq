import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Download, ShieldCheck } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { Container, PublicFooter } from "@/components/public/public-shell";
import { Stopped } from "@/components/brand-stop";
import { appLinks } from "@/lib/app-links";
import { getSessionUser } from "@/lib/auth/session";
import { getPreferences } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Install on Android without Google Play",
  description:
    "Download the TalentSouq Android app directly, for phones and countries without Google Play.",
};

/**
 * The direct-download APK (report RPT-2026-014 §9: Google Play is not
 * available everywhere TalentSouq hires, Syria in particular). A short link to
 * share: talentsouq.it.com/android. Until NEXT_PUBLIC_ANDROID_APK_URL is set
 * there is nothing to install, so the page sends visitors to /download.
 */
export default async function AndroidPage() {
  const apk = appLinks().apk;
  if (!apk) redirect("/download");

  const [{ locale, theme }, user] = await Promise.all([getPreferences(), getSessionUser()]);
  const arabic = locale === "ar";

  const steps = arabic
    ? [
        "اضغط «تحميل ملف APK». إن نبّهك المتصفح إلى أن الملف قد يكون ضاراً، فاختر «تحميل على أي حال».",
        "افتح الملف من الإشعارات أو من مجلد التنزيلات.",
        "إن طُلب منك ذلك، اسمح بتثبيت التطبيقات من هذا المصدر: الإعدادات ← «السماح من هذا المصدر» لمتصفحك، ثم ارجع.",
        "اضغط «تثبيت» ثم «فتح»، وسجّل الدخول بحسابك في TalentSouq.",
      ]
    : [
        "Tap “Download the APK”. If your browser warns that the file might be harmful, choose “Download anyway”.",
        "Open the file from your notifications or your Downloads folder.",
        "If Android asks, allow installs from this source: Settings → “Allow from this source” for your browser, then go back.",
        "Tap Install, then Open, and sign in with your TalentSouq account.",
      ];

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />
      <section className="ts-bg-dark py-[clamp(3rem,8vw,5rem)]">
        <Container className="max-w-3xl">
          <h1 className="m-0 text-[clamp(2.1rem,4.5vw,3.2rem)] leading-[1.08] font-bold tracking-[-0.04em] text-ts-on-strong">
            <Stopped>
              {arabic ? "TalentSouq على Android دون Google Play" : "TalentSouq on Android, without Google Play"}
            </Stopped>
          </h1>
          <p className="m-0 mt-5 max-w-xl text-[17px] leading-relaxed text-ts-on-strong-muted">
            {arabic
              ? "إن لم يكن Google Play متاحاً على جهازك أو في بلدك، حمّل التطبيق مباشرة من هنا. إنه التطبيق نفسه الموجود في المتجر، وتسجّل الدخول فيه بالحساب نفسه."
              : "If Google Play isn't available on your phone or in your country, download the app directly here. It is the same app as in the store, and you sign in with the same account."}
          </p>
          <a
            href={apk.url}
            download
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-ts-md bg-ts-accent px-6 text-[15px] font-bold text-ts-on-accent transition-opacity hover:opacity-90 min-[560px]:w-auto"
          >
            <Download size={19} aria-hidden="true" />
            {arabic ? "تحميل ملف APK" : "Download the APK"}
            {apk.sizeMb ? (
              <span className="font-semibold opacity-80">
                · <bdi dir="ltr">{apk.sizeMb} MB</bdi>
              </span>
            ) : null}
          </a>
          <p className="m-0 mt-4 text-[13px] text-ts-on-strong-muted">
            {apk.version ? (
              <>
                {arabic ? "الإصدار " : "Version "}
                <bdi dir="ltr">{apk.version}</bdi>
                {" · "}
              </>
            ) : null}
            {arabic ? "يتطلب Android 7.0 أو أحدث" : "Needs Android 7.0 or newer"}
          </p>
        </Container>
      </section>

      <section className="py-[clamp(2rem,5vw,3.5rem)]">
        <Container className="grid max-w-3xl gap-6">
          <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6">
            <h2 className="m-0 text-xl font-bold tracking-[-0.02em] text-ts-ink">
              {arabic ? "طريقة التثبيت" : "How to install"}
            </h2>
            <ol className="m-0 mt-4 grid list-none gap-4 p-0">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-ts-ink">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-ts-paper text-[13px] font-bold text-ts-ink"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6">
            <h2 className="m-0 text-xl font-bold tracking-[-0.02em] text-ts-ink">
              {arabic ? "التحديثات" : "Updates"}
            </h2>
            <p className="m-0 mt-3 text-[15px] leading-relaxed text-ts-muted">
              {arabic
                ? "يتلقى التطبيق معظم التحسينات تلقائياً. وحين يصدر إصدار جديد يحتاج إلى تثبيت، حمّل أحدث ملف من هذه الصفحة وثبّته فوق التطبيق الحالي، دون أن تفقد حسابك أو بياناتك."
                : "The app picks up most improvements by itself. When a new version needs installing, download the latest file from this page and install it over the app you have; your account and data stay."}
            </p>
            <p className="m-0 mt-3 text-[15px] leading-relaxed text-ts-muted">
              {arabic
                ? "إن كان التطبيق مثبّتاً من Google Play فأبقِه كما هو. لا تستطيع إحدى النسختين تحديث الأخرى، فاحذف إحداهما قبل تثبيت الأخرى."
                : "Installed it from Google Play? Keep that one. The two versions can't update each other, so uninstall one before installing the other."}
            </p>
          </div>

          <p className="m-0 flex items-start gap-2 text-[13px] leading-relaxed text-ts-subtle">
            <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span className="min-w-0">
              {arabic
                ? "حمّل الملف من هذه الصفحة فقط، ولا تثبّت نسخاً تصلك من مصادر أخرى."
                : "Only download the file from this page, never a copy sent to you from elsewhere."}
              {apk.sha256 ? (
                <>
                  {" "}
                  {arabic ? "بصمة الملف (SHA-256) للتحقق منه:" : "To check the file, its SHA-256 is:"}{" "}
                  <code dir="ltr" className="font-mono break-all text-ts-muted">
                    {apk.sha256}
                  </code>
                </>
              ) : null}
            </span>
          </p>
        </Container>
      </section>
      <PublicFooter locale={locale} />
    </main>
  );
}
