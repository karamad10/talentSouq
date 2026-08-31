export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

function firstUsableValue(values: Array<string | undefined>) {
  return values.find((value) => value && !value.includes("your-project") && !value.includes("your-key"));
}

export function getSupabaseEnv(): SupabasePublicEnv | null {
  const url = firstUsableValue([process.env.SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_URL]);
  const publishableKey = firstUsableValue([
    process.env.SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ]);

  if (!url || !publishableKey || publishableKey.startsWith("sb_secret_")) {
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
