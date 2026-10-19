import type { Metadata } from "next";
import { Download, ShieldCheck } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { Container, PublicFooter } from "@/components/public/public-shell";
import { StoreBadges } from "@/components/public/store-badges";
import { appLinks } from "@/lib/app-links";
import { getSessionUser } from "@/lib/auth/session";
import { getPreferences } from "@/lib/locale";
import { Eyebrow, Stopped } from "@/components/brand-stop";

export const metadata: Metadata = {
  title: "Get the app",
  description: "Download TalentSouq for iPhone and Android, or install it directly where the stores are not available."
};

/**
 * The app on every route a visitor might have (report RPT-2026-014 §9: store
 * access varies in Syria): both store badges always, the direct APK once its
 * link is configured. Signed-in visitors land here from the workspace routes,
 * which are app-only for now, so they are told to carry on in the app.
 */
export default async function DownloadPage() {
  const [{ locale, theme }, user] = await Promise.all([getPreferences(), getSessionUser()]);
  const arabic = locale === "ar";
  const links = appLinks();

  const button =
    "inline-flex h-14 w-full items-center justify-center gap-3 rounded-ts-md px-6 text-[15px] font-bold transition-opacity hover:opacity-90 min-[560px]:w-auto";

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />
      <section className="py-[clamp(3rem,8vw,6rem)]">
        <Container className="max-w-3xl">
          <Eyebrow>{arabic ? "التطبيق" : "The app"}</Eyebrow>
          <h1 className="m-0 mt-3 text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">
            <Stopped>
              {user
                ? arabic
                  ? "تابع من تطبيق تالنت سوق."
                  : "Carry on in the TalentSouq app."
                : arabic
                  ? "احصل على تطبيق تالنت سوق."
                  : "Get the TalentSouq app."}
            </Stopped>
          </h1>
          <p className="m-0 mt-4 text-[17px] leading-relaxed text-ts-muted">
            {user
              ? arabic
                ? "أنت مسجّل الدخول. ملفك وطلباتك ورسائلك ووظائفك المنشورة في التطبيق: سجّل الدخول بالحساب نفسه."
                : "You are signed in. Your profile, applications, messages and job posts live in the app: sign in there with the same account."
              : arabic
                ? "قدّم على الوظائف، وتابع طلباتك، وتلقَّ إشعاراً عند رد صاحب العمل."
                : "Apply for roles, follow your applications, and get a notification when an employer replies."}
          </p>

          <StoreBadges locale={locale} size={52} className="mt-9" />

          {links.apk ? (
            <div className="mt-10 rounded-ts-lg border border-ts-line bg-ts-surface p-6">
              <h2 className="m-0 text-xl font-bold tracking-[-0.02em] text-ts-ink">
                {arabic ? "تنزيل مباشر لأجهزة Android" : "Direct download for Android"}
              </h2>
              <p className="m-0 mt-2 text-[15px] leading-relaxed text-ts-muted">
                {arabic
                  ? "ثبّت التطبيق من Google Play إن كان متاحاً في بلدك. التنزيل المباشر مخصص للأجهزة التي لا تصل إلى Google Play، ولا يمكن تحديثه من Google Play لاحقاً."
                  : "Install from Google Play when it is available in your country; the direct download is for devices without Play access. It cannot be updated from Play."}
              </p>
              <a href={links.apk.url} download className={`${button} mt-5 border border-ts-line bg-ts-paper text-ts-ink`}>
                <Download size={19} aria-hidden="true" />
                {arabic ? "تنزيل ملف APK" : "Download the APK"}
                {links.apk.sizeMb ? <span className="font-semibold text-ts-muted">· {links.apk.sizeMb} MB</span> : null}
              </a>
              <p className="m-0 mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-ts-subtle">
                <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                {arabic
                  ? "قد يطلب Android السماح بالتثبيت من هذا المصدر. نزّل الملف من هذه الصفحة فقط."
                  : "Android may ask you to allow installs from this source. Only download the file from this page."}
              </p>
            </div>
          ) : null}
        </Container>
      </section>
      <PublicFooter locale={locale} />
    </main>
  );
}
