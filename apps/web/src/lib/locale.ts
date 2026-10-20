import { cookies, headers } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * The visitor's language when they have not chosen one: whichever of Arabic
 * or English their browser ranks higher, and Arabic when it names neither
 * (or sends nothing, like most crawlers): the audience is the Gulf and Syria.
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  const ranked = (header ?? "")
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = Number.parseFloat(params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? "1");
      return { tag, q: Number.isFinite(q) ? q : 0, index };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { tag } of ranked) {
    if (tag === "ar" || tag.startsWith("ar-")) return "ar";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }
  return "ar";
}

/**
 * The visitor's language and theme: the cookies the header's switchers set,
 * else the browser's language. One reader instead of a copy of the parsing in
 * every page. Server-only; client components read `document.documentElement.lang`.
 */
export async function getPreferences(): Promise<{ locale: Locale; theme: "light" | "dark" }> {
  const store = await cookies();
  const value = store.get("ts-locale")?.value;
  const locale = isLocale(value) ? value : localeFromAcceptLanguage((await headers()).get("accept-language"));
  return {
    locale,
    theme: store.get("ts-theme")?.value === "dark" ? "dark" : "light"
  };
}

export async function getLocale(): Promise<Locale> {
  return (await getPreferences()).locale;
}
