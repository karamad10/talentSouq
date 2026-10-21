/**
 * Social sign-in providers the website offers.
 *
 * Google always. Apple only when NEXT_PUBLIC_APPLE_SIGNIN=1: the iPhone app's
 * native Apple sign-in needs nothing but the bundle id in Supabase, but the
 * browser flow also needs an Apple Services ID, a signing key and the Supabase
 * callback registered with Apple. Until that is set up the button would only
 * lead to an error, so it stays hidden (TODO.md has the steps).
 */
export type WebOAuthProvider = "google" | "apple";

export function appleWebSignInEnabled(): boolean {
  return process.env.NEXT_PUBLIC_APPLE_SIGNIN === "1";
}

/** The provider a sign-in form asked for, never one the site does not offer. */
export function requestedProvider(value: FormDataEntryValue | null): WebOAuthProvider {
  return value === "apple" && appleWebSignInEnabled() ? "apple" : "google";
}
