import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const envFiles = [
  resolve(process.cwd(), "../../.env"),
  resolve(process.cwd(), "../../.env.local"),
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), ".env.local"),
];

function loadEnvFile(file) {
  if (!existsSync(file)) {
    return;
  }

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ||= value;
  }
}

for (const file of envFiles) {
  loadEnvFile(file);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !publishableKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const requestedPersonas = process.argv.slice(2);
const personas = requestedPersonas.length
  ? requestedPersonas
  : ["seeker", "seeker", "employer", "employer", "recruiter", "viewer"];

const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);
const rows = [];

for (const persona of personas) {
  const normalizedPersona = persona.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const suffix = randomBytes(3).toString("hex");
  const email = `codex+${normalizedPersona}-${timestamp}-${suffix}@talentsouq.it.com`;
  const password = `Tsq-${normalizedPersona}-${randomBytes(8).toString("base64url")}!9`;
  const requestedRole = normalizedPersona === "seeker" ? "seeker" : "employer";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        requested_role: requestedRole,
        test_persona: normalizedPersona,
      },
    },
  });

  rows.push({
    persona: normalizedPersona,
    email,
    password,
    userId: data.user?.id ?? "not-created",
    status: error
      ? `ERROR: ${error.message}`
      : data.session
        ? "Ready to log in now."
        : "Created, but email confirmation may be required before login.",
  });
}

const outputPath = resolve(process.cwd(), "../../TEST_ACCOUNTS.local.md");
const lines = [
  "# TalentSouq local test accounts",
  "",
  "This file is intentionally ignored by Git. Do not commit real or test passwords to the public repo.",
  "",
  `Created: ${new Date().toISOString()}`,
  `Supabase project: ${new URL(supabaseUrl).host}`,
  "",
  "| Persona | Email | Password | User ID | Status |",
  "| --- | --- | --- | --- | --- |",
  ...rows.map(
    (row) => `| ${row.persona} | ${row.email} | ${row.password} | ${row.userId} | ${row.status} |`,
  ),
  "",
  "If status says email confirmation may be required, confirm these users in Supabase Dashboard → Authentication → Users before using them.",
  "",
];

writeFileSync(outputPath, lines.join("\n"), { mode: 0o600 });

console.log(`Created ${rows.length} account attempts and wrote ${outputPath}.`);
console.log("Passwords were written only to the ignored local file, not printed here.");
for (const row of rows) {
  console.log(`${row.persona}: ${row.email} — ${row.status}`);
}
