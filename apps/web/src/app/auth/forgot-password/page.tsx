import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { LoadingSubmit } from "@/components/interaction-ui";
import { authMessage } from "@/lib/auth-copy";
import { getLocale } from "@/lib/locale";
import { getSupabaseEnv } from "@/lib/supabase/env";

const COPY = {
  en: {
    back: "Back to login",
    eyebrow: "Account recovery",
    title: "Let’s get you back in.",
    points: ["A secure reset link goes to your email", "Your existing applications and hiring data stay safe"],
    formEyebrow: "Reset password",
    heading: "Forgot your password?",
    intro: "Enter your account email and we’ll send a password reset link.",
    email: "Email address",
    submit: "Send reset link",
    pending: "Sending reset link…",
    remembered: "Remembered it?",
    login: "Log in",
    noteOn: "Reset links use Supabase Auth and return to TalentSouq after the email is opened.",
    noteOff: "Supabase public environment variables were not found in this runtime, so password reset is disabled here."
  },
  ar: {
    back: "العودة إلى تسجيل الدخول",
    eyebrow: "استعادة الحساب",
    title: "لنُعِدك إلى حسابك.",
    points: ["يُرسَل رابط آمن لإعادة التعيين إلى بريدك", "طلباتك وبيانات التوظيف تبقى آمنة"],
    formEyebrow: "إعادة تعيين كلمة المرور",
    heading: "نسيت كلمة المرور؟",
    intro: "أدخل بريد حسابك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.",
    email: "البريد الإلكتروني",
    submit: "إرسال رابط إعادة التعيين",
    pending: "جارٍ إرسال الرابط…",
    remembered: "تذكرتها؟",
    login: "تسجيل الدخول",
    noteOn: "يعيدك رابط إعادة التعيين إلى تالنت سوق بعد فتح الرسالة.",
    noteOff: "إعادة تعيين كلمة المرور غير متاحة في هذه البيئة حالياً."
  }
} as const;

export default async function ForgotPasswordPage({
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
                <Mail size={18} />
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
          <form className="auth-fields" action={requestPasswordReset}>
            <label className="field">
              <span>{copy.email}</span>
              <input type="email" name="email" autoComplete="email" required placeholder="you@example.com" dir="ltr" />
            </label>
            <LoadingSubmit className="button button-primary button-full" type="submit" disabled={!authEnabled} pendingLabel={copy.pending}>
              {copy.submit}
            </LoadingSubmit>
          </form>
          <p className="switch-auth">
            {copy.remembered} <Link href="/auth/login">{copy.login}</Link>
          </p>
          <p className="form-note">{authEnabled ? copy.noteOn : copy.noteOff}</p>
        </div>
      </section>
    </main>
  );
}
