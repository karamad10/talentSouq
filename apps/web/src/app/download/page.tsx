import type { Metadata } from "next";
import { Download, ShieldCheck } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Logo } from "@/components/logo";
import { Container, PublicFooter } from "@/components/public/public-shell";
import { StoreBadges } from "@/components/public/store-badges";
import { appLinks } from "@/lib/app-links";
import { getSessionUser } from "@/lib/auth/session";
import { getPreferences } from "@/lib/locale";
import { Stopped } from "@/components/brand-stop";

export const metadata: Metadata = {
  title: "Get the app",
  description:
    "Download TalentSouq for iPhone and Android, or install it directly where the stores are not available.",
};

/**
 * The app on every route a visitor might have (report RPT-2026-014 §9: store
 * access varies in Syria): both store badges always, the direct APK once its
 * link is configured. Signed-in visitors land here from the workspace routes,
 * which are app-only for now, so they are told to carry on in the app.
 */
export default async function DownloadPage() {
  const [{ locale, theme }, user] = await Promise.all([
    getPreferences(),
    getSessionUser(),
  ]);
  const arabic = locale === "ar";
  const links = appLinks();

  const button =
    "inline-flex h-14 w-full items-center justify-center gap-3 rounded-ts-md px-6 text-[15px] font-bold transition-opacity hover:opacity-90 min-[560px]:w-auto";

  // The phone mockup shows a real screenshot of the app's home screen once one
  // is saved at public/images/app-home.png (never the demo jobs); until then
  // the column is left out rather than filled with a placeholder.
  const screenshot = existsSync(
    join(process.cwd(), "public", "images", "app-home.png"),
  );

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />
      <section className="ts-bg-dark py-[clamp(3rem,8vw,6rem)]">
        <Container className="grid grid-cols-1 items-center gap-12 min-[1000px]:grid-cols-[1.1fr_0.9fr]">
          <div className="min-w-0">
            <Logo inverted />
            <h1 className="m-0 mt-8 text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] font-bold tracking-[-0.04em] text-ts-on-strong">
              {user ? (
                <Stopped>
                  {arabic ? "تابع من التطبيق" : "Carry on in the app"}
                </Stopped>
              ) : (
                <>
                  <Stopped>
                    {arabic ? "وظيفتك القادمة" : "Your next role"}
                  </Stopped>
                  <br />
                  <Stopped>{arabic ? "في جيبك" : "In your pocket"}</Stopped>
                </>
              )}
            </h1>
            <p className="m-0 mt-5 max-w-xl text-[17px] leading-relaxed text-ts-on-strong-muted">
              {user
                ? arabic
                  ? "أنت مسجّل الدخول. ملفك وطلباتك ورسائلك ووظائفك المنشورة في التطبيق: سجّل الدخول بالحساب نفسه."
                  : "You are signed in. Your profile, applications, messages and job posts live in the app: sign in there with the same account."
                : arabic
                  ? "قدّم على الوظائف، وتابع طلباتك، وتلقَّ إشعاراً عند رد صاحب العمل."
                  : "Apply for roles, follow your applications, and get a notification when an employer replies."}
            </p>

            <StoreBadges locale={locale} size={52} className="mt-9" />

            {/* Desktop visitors scan it with the phone they will install on. */}
            <div className="mt-8 inline-flex items-center gap-4 rounded-ts-md bg-ts-on-strong p-3 pe-5 max-[999px]:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element -- static vector QR */}
              <img
                src="/brand/download-qr.svg"
                alt=""
                width={96}
                height={96}
                className="size-24 rounded-ts-xs bg-white"
              />
              <span className="text-sm font-semibold text-ts-ink">
                {arabic ? "امسح الرمز للتنزيل" : "Scan to download"}
              </span>
            </div>
          </div>

          {screenshot ? (
            <div
              aria-hidden="true"
              className="mx-auto w-[min(17rem,70vw)] min-[1000px]:rotate-[4deg]"
            >
              <div className="rounded-[2.6rem] border border-ts-on-strong/15 bg-surface-strong p-2.5 shadow-ts-lift">
                {/* eslint-disable-next-line @next/next/no-img-element -- a local screenshot, shown at one size */}
                <img
                  src="/images/app-home.png"
                  alt=""
                  className="block aspect-[9/19.5] w-full rounded-[2.1rem] object-cover object-top"
                />
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      {links.apk ? (
        <section className="py-[clamp(2rem,5vw,3.5rem)]">
          <Container className="max-w-3xl">
            <div className="rounded-ts-lg border border-ts-line bg-ts-surface p-6">
              <h2 className="m-0 text-xl font-bold tracking-[-0.02em] text-ts-ink">
                {arabic
                  ? "تنزيل مباشر لأجهزة Android"
                  : "Direct download for Android"}
              </h2>
              <p className="m-0 mt-2 text-[15px] leading-relaxed text-ts-muted">
                {arabic
                  ? "ثبّت التطبيق من Google Play إن كان متاحاً في بلدك. التنزيل المباشر مخصص للأجهزة التي لا تصل إلى Google Play، ولا يمكن تحديثه من Google Play لاحقاً."
                  : "Install from Google Play when it is available in your country; the direct download is for devices without Play access. It cannot be updated from Play."}
              </p>
              <a
                href={links.apk.url}
                download
                className={`${button} mt-5 border border-ts-line bg-ts-paper text-ts-ink`}
              >
                <Download size={19} aria-hidden="true" />
                {arabic ? "تنزيل ملف APK" : "Download the APK"}
                {links.apk.sizeMb ? (
                  <span className="font-semibold text-ts-muted">
                    · {links.apk.sizeMb} MB
                  </span>
                ) : null}
              </a>
              <p className="m-0 mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-ts-subtle">
                <ShieldCheck
                  size={16}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                />
                {arabic
                  ? "قد يطلب Android السماح بالتثبيت من هذا المصدر. نزّل الملف من هذه الصفحة فقط."
                  : "Android may ask you to allow installs from this source. Only download the file from this page."}
              </p>
            </div>
          </Container>
        </section>
      ) : null}
      <PublicFooter locale={locale} />
    </main>
  );
}
