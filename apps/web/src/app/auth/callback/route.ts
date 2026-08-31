import { NextResponse, type NextRequest } from "next/server";
import { authRedirectPath, safeRelativePath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeRelativePath(requestUrl.searchParams.get("next"), "/seeker");
  const providerError = requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");

  if (providerError) {
    return NextResponse.redirect(
      new URL(authRedirectPath({ error: providerError, next }), request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL(authRedirectPath({ error: "Missing auth callback code.", next }), request.url));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL(authRedirectPath({ error: error.message, next }), request.url));
    }
  } catch {
    return NextResponse.redirect(new URL(authRedirectPath({ error: "Supabase is not configured for this environment yet.", next }), request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
