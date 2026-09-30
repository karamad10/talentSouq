import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * The visitor's language and theme, from the cookies the header's switchers
 * set. One reader instead of a copy of the parsing in every page.
 * Server-only; client components read `document.documentElement.lang`.
 */
export async function getPreferences(): Promise<{ locale: Locale; theme: "light" | "dark" }> {
  const store = await cookies();
  const value = store.get("ts-locale")?.value;
  return {
    locale: isLocale(value) ? value : "en",
    theme: store.get("ts-theme")?.value === "dark" ? "dark" : "light"
  };
}

export async function getLocale(): Promise<Locale> {
  return (await getPreferences()).locale;
}
