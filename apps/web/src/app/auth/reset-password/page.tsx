import { ArrowLeft, KeyRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { updatePassword } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default async function ResetPasswordPage({
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
          <p className="eyebrow">Choose a new password</p>
          <h1>A fresh key for the same door.</h1>
          <ul>
            <li>
              <KeyRound size={18} />
              Use at least 8 characters
            </li>
            <li>
              <KeyRound size={18} />
              The reset link must be opened from the latest email
            </li>
          </ul>
        </div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <p className="eyebrow">Secure reset</p>
          <h2>Set a new password</h2>
          <p>After saving, you can log in with your new password.</p>
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
          <form className="auth-fields" action={updatePassword}>
            <label className="field">
              <span>New password</span>
              <input type="password" name="password" autoComplete="new-password" required minLength={8} />
            </label>
            <label className="field">
              <span>Confirm new password</span>
              <input type="password" name="confirmPassword" autoComplete="new-password" required minLength={8} />
            </label>
            <button className="button button-primary button-full" type="submit" disabled={!authEnabled}>
              Update password
            </button>
          </form>
          <p className="switch-auth">
            Need a new link? <Link href={"/auth/forgot-password" as Route}>Send another reset email</Link>
          </p>
          <p className="form-note">
            {authEnabled
              ? "This page needs the session from a Supabase recovery link before the password can be changed."
              : "Supabase public environment variables were not found in this runtime, so password reset is disabled here."}
          </p>
        </div>
      </section>
    </main>
  );
}
