import { ArrowLeft, Check } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { signInWithOAuth, signInWithPassword, signUpWithPassword } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { authMessage } from "@/lib/auth-copy";
import { getLocale } from "@/lib/locale";
import { getSupabaseEnv } from "@/lib/supabase/env";

const COPY = {
  en: {
    back: "Back",
    eyebrow: "Ambition starts here",
    titleSignup: "Make your next move count.",
    titleLogin: "Welcome back to what’s next.",
    points: ["A profile that works harder for you", "Relevant roles from growing teams", "Every application, clearly tracked"],
    formEyebrowSignup: "Create your account",
    formEyebrowLogin: "Your account",
    headingSignup: "Join TalentSouq",
    headingLogin: "Log in",
    introSignup: "Start as a job seeker or employer with your TalentSouq account.",
    introLogin: "Continue your search or get back to hiring.",
    roleLegend: "I’m here to",
    roleSeeker: "Find work",
    roleEmployer: "Hire talent",
    email: "Email address",
    password: "Password",
    passwordHint: "At least 8 characters",
    forgot: "Forgot password?",
    submitSignup: "Create account",
    submitLogin: "Log in",
    divider: "or continue with",
    haveAccount: "Already have an account?",
    newHere: "New to TalentSouq?",
    switchLogin: "Log in",
    switchSignup: "Join now",
    unavailable: "Sign-in is unavailable in this environment right now."
  },
  ar: {
    back: "رجوع",
    eyebrow: "طموحك يبدأ هنا",
    titleSignup: "اجعل خطوتك القادمة مهمّة.",
    titleLogin: "مرحباً بعودتك إلى ما هو قادم.",
    points: ["ملف شخصي يعمل لصالحك", "وظائف مناسبة من فرق متنامية", "كل طلب تقديم، بمتابعة واضحة"],
    formEyebrowSignup: "أنشئ حسابك",
    formEyebrowLogin: "حسابك",
    headingSignup: "انضم إلى تالنت سوق",
    headingLogin: "تسجيل الدخول",
    introSignup: "ابدأ باحثاً عن عمل أو صاحب عمل بحساب تالنت سوق.",
    introLogin: "تابع بحثك أو عُد إلى التوظيف.",
    roleLegend: "أنا هنا كي",
    roleSeeker: "أبحث عن عمل",
    roleEmployer: "أوظّف كفاءات",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordHint: "8 أحرف على الأقل",
    forgot: "نسيت كلمة المرور؟",
    submitSignup: "إنشاء حساب",
    submitLogin: "تسجيل الدخول",
    divider: "أو تابع باستخدام",
    haveAccount: "لديك حساب بالفعل؟",
    newHere: "جديد على تالنت سوق؟",
    switchLogin: "تسجيل الدخول",
    switchSignup: "إنشاء حساب",
    unavailable: "تسجيل الدخول غير متاح في هذه البيئة حالياً."
  }
} as const;

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ mode?: string; error?: string; message?: string; next?: string }>;
}) {
  const [params, locale] = await Promise.all([searchParams, getLocale()]);
  const copy = COPY[locale];
  const signup = params.mode === "signup";
  const authEnabled = Boolean(getSupabaseEnv());
  const next = params.next ?? "/seeker";
  const passwordAction = signup ? signUpWithPassword : signInWithPassword;

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Link className="back-link auth-back" href="/">
          <ArrowLeft size={17} className="rtl:-scale-x-100" />
          {copy.back}
        </Link>
        <div className="auth-brand-copy">
          <Logo inverted />
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{signup ? copy.titleSignup : copy.titleLogin}</h1>
          <ul>
            {copy.points.map((point) => (
              <li key={point}>
                <Check size={18} />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">{signup ? copy.formEyebrowSignup : copy.formEyebrowLogin}</p>
          <h2>{signup ? copy.headingSignup : copy.headingLogin}</h2>
          <p>{signup ? copy.introSignup : copy.introLogin}</p>
          {params.error && <p className="form-alert error" role="alert">{authMessage(params.error, locale)}</p>}
          {params.message && <p className="form-alert success" role="status">{authMessage(params.message, locale)}</p>}
          <form className="auth-fields" action={passwordAction}>
            <input type="hidden" name="next" value={next} />
            {signup && (
              <fieldset className="role-choice">
                <legend>{copy.roleLegend}</legend>
                <label>
                  <input type="radio" name="role" value="seeker" defaultChecked />
                  <span>{copy.roleSeeker}</span>
                </label>
                <label>
                  <input type="radio" name="role" value="employer" />
                  <span>{copy.roleEmployer}</span>
                </label>
              </fieldset>
            )}
            <label className="field">
              <span>{copy.email}</span>
              <input type="email" name="email" autoComplete="email" required placeholder="you@example.com" dir="ltr" />
            </label>
            <label className="field">
              <span>{copy.password}</span>
              <input
                type="password"
                name="password"
                autoComplete={signup ? "new-password" : "current-password"}
                required
                minLength={8}
                placeholder={copy.passwordHint}
              />
            </label>
            {!signup && (
              <Link className="minor-form-link" href={"/auth/forgot-password" as Route}>
                {copy.forgot}
              </Link>
            )}
            <button
              className="button button-primary button-full"
              type="submit"
              disabled={!authEnabled}
              aria-describedby={authEnabled ? undefined : "auth-form-note"}
            >
              {signup ? copy.submitSignup : copy.submitLogin}
            </button>
          </form>
          <div className="form-divider">
            <span>{copy.divider}</span>
          </div>
          <div className="social-buttons">
            <form action={signInWithOAuth}>
              <input type="hidden" name="next" value={next} />
              <button className="button button-secondary" type="submit" disabled={!authEnabled}>
                <span className="google-g">G</span>Google
              </button>
            </form>
          </div>
          <p className="switch-auth">
            {signup ? copy.haveAccount : copy.newHere}{" "}
            <Link
              href={
                signup
                  ? `/auth/login?next=${encodeURIComponent(next)}`
                  : `/auth/login?mode=signup&next=${encodeURIComponent(next)}`
              }
            >
              {signup ? copy.switchLogin : copy.switchSignup}
            </Link>
          </p>
          {!authEnabled && (
            <p className="form-note" id="auth-form-note">
              {copy.unavailable}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
