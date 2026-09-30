/**
 * Career-page videos are URLs the employer pastes in the app. Only YouTube and
 * Vimeo over https are embedded; anything else is dropped rather than put in an
 * iframe blind. A port of `toEmbedUrl` in karehan's @talentsouq/shared
 * (company-media.ts), with the same host allowlist — keep the two in step.
 */
const VIDEO_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "vimeo.com", "www.vimeo.com", "player.vimeo.com"];

function parse(url: string): URL | null {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && VIDEO_HOSTS.includes(u.hostname.toLowerCase()) ? u : null;
  } catch {
    return null;
  }
}

export function toEmbedUrl(url: string): string | null {
  const u = parse(url);
  if (!u) return null;
  const host = u.hostname.toLowerCase();

  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : null;
  }
  if (host.endsWith("youtube.com")) {
    if (u.pathname.startsWith("/embed/")) return u.toString();
    const id = u.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : null;
  }
  if (host.endsWith("vimeo.com")) {
    if (host === "player.vimeo.com") return u.toString();
    const id = u.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}
