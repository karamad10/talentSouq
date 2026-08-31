import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const envFiles = [
  resolve(process.cwd(), "../../.env"),
  resolve(process.cwd(), "../../.env.local"),
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), ".env.local"),
];

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const equalsIndex = trimmed.indexOf("=");
  if (equalsIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

for (const file of envFiles) {
  if (!existsSync(file)) {
    continue;
  }

  const contents = readFileSync(file, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const parsed = parseEnvLine(line);
    if (!parsed || process.env[parsed.key]) {
      continue;
    }
    process.env[parsed.key] = parsed.value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function summarizeKey(key) {
  if (!key) {
    return "missing";
  }

  const shape = key.startsWith("sb_publishable_")
    ? "sb_publishable"
    : key.startsWith("eyJ")
      ? "legacy_anon_jwt"
      : "unknown";

  return `${shape}, length ${key.length}, whitespace ${
    /\s/.test(key) ? "present" : "none"
  }`;
}

function fail(message) {
  console.error(`Auth check failed: ${message}`);
  process.exitCode = 1;
}

if (!supabaseUrl || !publishableKey) {
  fail(
    "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) must be set.",
  );
  process.exit();
}

let url;
try {
  url = new URL(supabaseUrl);
} catch {
  fail("NEXT_PUBLIC_SUPABASE_URL is not a valid URL.");
  process.exit();
}

console.log(`Supabase URL host: ${url.host}`);
console.log(`Public key summary: ${summarizeKey(publishableKey)}`);

try {
  const healthResponse = await fetch(new URL("/auth/v1/health", url));
  console.log(
    `Auth endpoint reachability: HTTP ${healthResponse.status} ${healthResponse.statusText}`,
  );
} catch (error) {
  fail(`Auth endpoint was not reachable: ${error.message}`);
  process.exit();
}

const supabase = createClient(supabaseUrl, publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const { error } = await supabase.auth.signInWithPassword({
  email: "codex-auth-probe@example.invalid",
  password: "not-a-real-password",
});

if (!error) {
  console.log("Auth key check: accepted; fake credentials unexpectedly passed.");
  process.exit();
}

const status = "status" in error ? error.status : "unknown";
const code = "code" in error ? error.code : "unknown";
console.log(`Auth key check response: ${error.message} (status ${status}, code ${code})`);

if (error.message.toLowerCase().includes("invalid api key")) {
  fail(
    "Supabase rejected this public key. Copy the full matching publishable key for this exact project, or add the legacy anon key as NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
} else {
  console.log(
    "Auth key check: accepted by Supabase. Login/signup can now be tested with a real test account.",
  );
}
