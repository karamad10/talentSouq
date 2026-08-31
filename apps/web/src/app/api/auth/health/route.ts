import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

function summarizeKey(key: string) {
  if (key.startsWith("sb_publishable_")) {
    return "sb_publishable";
  }

  if (key.startsWith("eyJ")) {
    return "legacy_anon_jwt";
  }

  if (key.startsWith("sb_secret_")) {
    return "secret_rejected";
  }

  return "unknown";
}

export async function GET() {
  const env = getSupabaseEnv();

  if (!env) {
    return NextResponse.json(
      {
        configured: false,
        keyAccepted: false,
        message: "Supabase public environment variables are missing or unusable."
      },
      { status: 503 }
    );
  }

  const supabaseUrl = new URL(env.url);
  const supabase = createClient(env.url, env.publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });

  const { error } = await supabase.auth.signInWithPassword({
    email: "codex-auth-probe@example.invalid",
    password: "not-a-real-password"
  });

  const errorMessage = error?.message ?? "No auth error returned.";
  const keyAccepted = !errorMessage.toLowerCase().includes("invalid api key");

  return NextResponse.json(
    {
      configured: true,
      keyAccepted,
      projectHost: supabaseUrl.host,
      keyType: summarizeKey(env.publishableKey),
      authResponse: keyAccepted ? "key accepted" : "invalid api key"
    },
    { status: keyAccepted ? 200 : 503 }
  );
}
