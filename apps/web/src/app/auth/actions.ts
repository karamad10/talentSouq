"use server";

import type { Provider } from "@supabase/supabase-js";
import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authRedirectPath, safeRelativePath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

type AuthMode = "login" | "signup";

async function getOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

function getCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? "")
  };
}

function getRole(formData: FormData) {
  return formData.get("role") === "employer" ? "employer" : "seeker";
}

function failurePath(mode: AuthMode, formData: FormData, error: string) {
  return authRedirectPath({
    mode: mode === "signup" ? "signup" : undefined,
    next: safeRelativePath(formData.get("next"), getRole(formData) === "employer" ? "/employer" : "/seeker"),
    error
  });
}

function redirectTo(path: string): never {
  redirect(path as Route);
}

export async function signInWithPassword(formData: FormData) {
  const { email, password } = getCredentials(formData);
  const next = safeRelativePath(formData.get("next"), "/seeker");

  if (!email || !password) {
    redirectTo(failurePath("login", formData, "Enter your email and password."));
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirectTo(failurePath("login", formData, "Supabase is not configured for this environment yet."));
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirectTo(failurePath("login", formData, error.message));
  }

  redirectTo(next);
}

export async function signUpWithPassword(formData: FormData) {
  const { email, password } = getCredentials(formData);
  const role = getRole(formData);
  const next = safeRelativePath(formData.get("next"), role === "employer" ? "/employer" : "/seeker");

  if (!email || password.length < 8) {
    redirectTo(failurePath("signup", formData, "Use a valid email and a password with at least 8 characters."));
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirectTo(failurePath("signup", formData, "Supabase is not configured for this environment yet."));
  }

  const origin = await getOrigin();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      data: { requested_role: role }
    }
  });

  if (error) {
    redirectTo(failurePath("signup", formData, error.message));
  }

  redirectTo(authRedirectPath({ message: "Check your email to confirm your TalentSouq account.", next }));
}

export async function signInWithOAuth(formData: FormData) {
  const providerValue = formData.get("provider");
  const provider = providerValue === "apple" ? "apple" : "google";
  const next = safeRelativePath(formData.get("next"), "/seeker");

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirectTo(authRedirectPath({ error: "Supabase is not configured for this environment yet.", next }));
  }

  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error || !data.url) {
    redirectTo(authRedirectPath({ error: error?.message ?? "Could not start social login.", next }));
  }

  redirectTo(data.url);
}

export async function signOut() {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirectTo("/");
  }

  await supabase.auth.signOut();
  redirectTo("/");
}
