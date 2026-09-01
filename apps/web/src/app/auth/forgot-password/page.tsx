import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { LoadingSubmit } from "@/components/interaction-ui";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const authEnabled = Boolean(getSupabaseEnv());

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Link className="back-link auth-back" href="/auth/login">
          <ArrowLeft size={17} />
          Back to login
        </Link>
        <div className="auth-brand-copy">
          <Logo inverted />
          <p className="eyebrow">Account recovery</p>
          <h1>Let’s get you back in.</h1>
          <ul>
            <li>
              <Mail size={18} />
              A secure reset link goes to your email
            </li>
            <li>
              <Mail size={18} />
              Your existing applications and hiring data stay safe
            </li>
          </ul>
        </div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">Reset password</p>
          <h2>Forgot your password?</h2>
          <p>Enter your account email and we’ll send a password reset link.</p>
          {params.error && (
            <p className="form-alert error" role="alert">
              {params.error}
            </p>
          )}
          {params.message && (
            <p className="form-alert success" role="status">
              {params.message}
            </p>
          )}
          <form className="auth-fields" action={requestPasswordReset}>
            <label className="field">
              <span>Email address</span>
              <input type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
            </label>
            <LoadingSubmit className="button button-primary button-full" type="submit" disabled={!authEnabled} pendingLabel="Sending reset link…">
              Send reset link
            </LoadingSubmit>
          </form>
          <p className="switch-auth">
            Remembered it? <Link href="/auth/login">Log in</Link>
          </p>
          <p className="form-note">
            {authEnabled
              ? "Reset links use Supabase Auth and return to TalentSouq after the email is opened."
              : "Supabase public environment variables were not found in this runtime, so password reset is disabled here."}
          </p>
        </div>
      </section>
    </main>
  );
}
