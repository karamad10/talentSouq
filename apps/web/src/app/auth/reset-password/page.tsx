import { ArrowLeft, KeyRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { updatePassword } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { LoadingSubmit } from "@/components/interaction-ui";
import { authMessage } from "@/lib/auth-copy";
import { getLocale } from "@/lib/locale";
import { getSupabaseEnv } from "@/lib/supabase/env";

const COPY = {
  en: {
    back: "Back to login",
    eyebrow: "Choose a new password",
    title: "A fresh key for the same door.",
    points: ["Use at least 8 characters", "The reset link must be opened from the latest email"],
    formEyebrow: "Secure reset",
    heading: "Set a new password",
    intro: "After saving, you can log in with your new password.",
    password: "New password",
    confirm: "Confirm new password",
    submit: "Update password",
    pending: "Updating password…",
    needLink: "Need a new link?",
    another: "Send another reset email",
    noteOn: "This page needs the session from a Supabase recovery link before the password can be changed.",
    noteOff: "Supabase public environment variables were not found in this runtime, so password reset is disabled here."
  },
  ar: {
    back: "العودة إلى تسجيل الدخول",
    eyebrow: "اختر كلمة مرور جديدة",
    title: "مفتاح جديد للباب نفسه.",
    points: ["استخدم 8 أحرف على الأقل", "افتح رابط إعادة التعيين من أحدث رسالة"],
    formEyebrow: "إعادة تعيين آمنة",
    heading: "عيّن كلمة مرور جديدة",
    intro: "بعد الحفظ يمكنك تسجيل الدخول بكلمة المرور الجديدة.",
    password: "كلمة المرور الجديدة",
    confirm: "تأكيد كلمة المرور الجديدة",
    submit: "تحديث كلمة المرور",
    pending: "جارٍ تحديث كلمة المرور…",
    needLink: "تحتاج رابطاً جديداً؟",
    another: "أرسل رسالة إعادة تعيين أخرى",
    noteOn: "تحتاج هذه الصفحة إلى فتحها من رابط استعادة الحساب قبل تغيير كلمة المرور.",
    noteOff: "إعادة تعيين كلمة المرور غير متاحة في هذه البيئة حالياً."
  }
} as const;

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, locale] = await Promise.all([searchParams, getLocale()]);
  const copy = COPY[locale];
  const authEnabled = Boolean(getSupabaseEnv());

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Link className="back-link auth-back" href="/auth/login">
          <ArrowLeft size={17} className="rtl:-scale-x-100" />
          {copy.back}
        </Link>
        <div className="auth-brand-copy">
          <Logo inverted />
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <ul>
            {copy.points.map((point) => (
              <li key={point}>
                <KeyRound size={18} />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">{copy.formEyebrow}</p>
          <h2>{copy.heading}</h2>
          <p>{copy.intro}</p>
          {params.error && (
            <p className="form-alert error" role="alert">
              {authMessage(params.error, locale)}
            </p>
          )}
          {params.message && (
            <p className="form-alert success" role="status">
              {authMessage(params.message, locale)}
            </p>
          )}
          <form className="auth-fields" action={updatePassword}>
            <label className="field">
              <span>{copy.password}</span>
              <input type="password" name="password" autoComplete="new-password" required minLength={8} />
            </label>
            <label className="field">
              <span>{copy.confirm}</span>
              <input type="password" name="confirmPassword" autoComplete="new-password" required minLength={8} />
            </label>
            <LoadingSubmit className="button button-primary button-full" type="submit" disabled={!authEnabled} pendingLabel={copy.pending}>
              {copy.submit}
            </LoadingSubmit>
          </form>
          <p className="switch-auth">
            {copy.needLink} <Link href={"/auth/forgot-password" as Route}>{copy.another}</Link>
          </p>
          <p className="form-note">{authEnabled ? copy.noteOn : copy.noteOff}</p>
        </div>
      </section>
    </main>
  );
}
