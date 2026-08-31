import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authRedirectPath } from "@/lib/auth/redirects";
import { getSupabaseEnv } from "@/lib/supabase/env";

const protectedPrefixes = ["/seeker", "/employer"];

export async function proxy(request: NextRequest) {
  const env = getSupabaseEnv();
  let response = NextResponse.next({ request });

  if (!env) {
    return response;
  }

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      }
    }
  });

  const { data, error } = await supabase.auth.getClaims();
  const pathname = request.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const guardsDisabledForTests = process.env.TALENTSOUQ_DISABLE_AUTH_GUARDS === "1";

  if (!guardsDisabledForTests && needsAuth && (error || !data?.claims)) {
    const url = new URL(authRedirectPath({
      next: `${pathname}${request.nextUrl.search}`,
      error: "Log in to continue."
    }), request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml).*)"]
};
