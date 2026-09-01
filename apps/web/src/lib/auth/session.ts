import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  email: string;
  role: "seeker" | "employer";
};

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.email) return null;

    const role = data.claims.user_metadata?.requested_role === "employer" ? "employer" : "seeker";
    return { email: data.claims.email, role };
  } catch {
    return null;
  }
}
