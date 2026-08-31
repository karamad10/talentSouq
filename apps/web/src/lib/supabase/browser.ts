"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, publishableKey } = requireSupabaseEnv();
  return createBrowserClient(url, publishableKey);
}
