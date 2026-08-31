export function safeRelativePath(value: FormDataEntryValue | string | null | undefined, fallback = "/seeker") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(value, "https://talentsouq.it.com");
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function authRedirectPath(params: { mode?: "signup"; next?: string; error?: string; message?: string }) {
  const query = new URLSearchParams();
  if (params.mode) query.set("mode", params.mode);
  if (params.next) query.set("next", safeRelativePath(params.next));
  if (params.error) query.set("error", params.error);
  if (params.message) query.set("message", params.message);
  const text = query.toString();
  return `/auth/login${text ? `?${text}` : ""}`;
}
