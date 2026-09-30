/**
 * Where to get the app (report RPT-2026-014 §9: store access varies in Syria,
 * so offer a direct download next to the stores).
 *
 * Every link comes from an env var and is absent until set, so nothing points
 * at a store page or file that does not exist yet:
 *   NEXT_PUBLIC_IOS_APP_URL, NEXT_PUBLIC_ANDROID_APP_URL,
 *   NEXT_PUBLIC_ANDROID_APK_URL (+ optional NEXT_PUBLIC_ANDROID_APK_SIZE_MB).
 * NEXT_PUBLIC_* values are inlined at build time: redeploy after changing them.
 */
function httpsUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export type AppLinks = {
  ios: string | null;
  android: string | null;
  apk: { url: string; sizeMb: number | null } | null;
  any: boolean;
};

export function appLinks(): AppLinks {
  const ios = httpsUrl(process.env.NEXT_PUBLIC_IOS_APP_URL);
  const android = httpsUrl(process.env.NEXT_PUBLIC_ANDROID_APP_URL);
  const apkUrl = httpsUrl(process.env.NEXT_PUBLIC_ANDROID_APK_URL);
  const size = Number.parseFloat(process.env.NEXT_PUBLIC_ANDROID_APK_SIZE_MB ?? "");
  const apk = apkUrl ? { url: apkUrl, sizeMb: Number.isFinite(size) && size > 0 ? size : null } : null;
  return { ios, android, apk, any: Boolean(ios || android || apk) };
}
