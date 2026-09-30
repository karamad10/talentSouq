import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Call one of the public, anon-callable RPCs (public_jobs, public_companies,
 * public_career_page, public_job) from a server component.
 *
 * A public page must always render: with no env, an unreachable database, a
 * missing function (before the migration reaches production) or any non-200,
 * this resolves to `null` and the page shows its honest empty state — never a
 * 500 and never demo data. Responses are cached for five minutes.
 */
export async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T | null> {
  const env = getSupabaseEnv();
  if (!env) return null;
  try {
    const res = await fetch(`${env.url}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        apikey: env.publishableKey,
        Authorization: `Bearer ${env.publishableKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args),
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    return (await res.json()) as T | null;
  } catch {
    return null;
  }
}
