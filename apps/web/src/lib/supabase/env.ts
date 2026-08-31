export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

export function getSupabaseEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey || url.includes("your-project") || publishableKey.includes("your-key")) {
    return null;
  }

  return { url, publishableKey };
}

export function requireSupabaseEnv(): SupabasePublicEnv {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Supabase public environment variables are not configured.");
  }
  return env;
}
