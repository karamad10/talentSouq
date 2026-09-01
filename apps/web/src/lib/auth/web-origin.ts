/**
 * The one trusted public web origin for auth callbacks.
 *
 * Auth redirect URLs must never be constructed from an arbitrary production
 * Host header. Preview hosts are not necessarily allow-listed in Supabase and
 * Supabase may then use its Site URL fallback (which can be the mobile deep
 * link). Native app OAuth has its own `talentsouq://` redirect flow.
 */
export const DEFAULT_WEB_ORIGIN = "https://talentsouq.it.com";

type OriginInput = {
  configuredOrigin?: string;
  host?: string | null;
  forwardedHost?: string | null;
  forwardedProtocol?: string | null;
};

function normalizeConfiguredOrigin(value: string | undefined) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(isLocal && url.protocol === "http:")) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

function localOrigin(host: string, forwardedProtocol: string | null | undefined) {
  const hostname = host.split(":")[0]?.toLowerCase();
  if (hostname !== "localhost" && hostname !== "127.0.0.1") return undefined;

  const protocol = forwardedProtocol?.split(",")[0]?.trim() === "https" ? "https" : "http";
  return `${protocol}://${host}`;
}

export function resolveWebOrigin({ configuredOrigin, host, forwardedHost, forwardedProtocol }: OriginInput) {
  const configured = normalizeConfiguredOrigin(configuredOrigin);
  if (configured) return configured;

  const requestHost = (forwardedHost ?? host)?.split(",")[0]?.trim();
  if (requestHost) {
    const local = localOrigin(requestHost, forwardedProtocol);
    if (local) return local;
  }

  return DEFAULT_WEB_ORIGIN;
}

export function configuredWebOrigin() {
  return process.env.APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
}
