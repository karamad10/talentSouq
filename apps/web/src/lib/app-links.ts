/**
 * Where to get the app (report RPT-2026-014 §9: store access varies in Syria,
 * so offer a direct download next to the stores).
 *
 * The two store pages default to the app's real listings (App Store id
 * 6778230487, Play package com.karehan.app); the store badges are a launch
 * requirement, so they always have somewhere to go. An env var overrides each:
 *   NEXT_PUBLIC_IOS_APP_URL, NEXT_PUBLIC_ANDROID_APP_URL.
 * Until both apps are approved the store pages 404, so the badges show a
 * "coming soon" state with no link; set NEXT_PUBLIC_STORES_LIVE=1 in Vercel
 * (and redeploy) the day both listings are public.
 * The direct APK is absent until NEXT_PUBLIC_ANDROID_APK_URL is set
 * (+ optional NEXT_PUBLIC_ANDROID_APK_SIZE_MB, _VERSION, and _SHA256 so people
 * can check the file they got).
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

export const APP_STORE_URL = "https://apps.apple.com/app/id6778230487";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.karehan.app";

export type AppLinks = {
  ios: string;
  android: string;
  apk: { url: string; sizeMb: number | null; version: string | null; sha256: string | null } | null;
  /** Both store listings are public; until then the badges link nowhere. */
  live: boolean;
};

export function appLinks(): AppLinks {
  const ios = httpsUrl(process.env.NEXT_PUBLIC_IOS_APP_URL) ?? APP_STORE_URL;
  const android = httpsUrl(process.env.NEXT_PUBLIC_ANDROID_APP_URL) ?? PLAY_STORE_URL;
  const apkUrl = httpsUrl(process.env.NEXT_PUBLIC_ANDROID_APK_URL);
  const size = Number.parseFloat(process.env.NEXT_PUBLIC_ANDROID_APK_SIZE_MB ?? "");
  const version = process.env.NEXT_PUBLIC_ANDROID_APK_VERSION?.trim() || null;
  const sha = process.env.NEXT_PUBLIC_ANDROID_APK_SHA256?.trim().toLowerCase() ?? "";
  const apk = apkUrl
    ? {
        url: apkUrl,
        sizeMb: Number.isFinite(size) && size > 0 ? size : null,
        version: version && /^[\w.() -]{1,32}$/.test(version) ? version : null,
        sha256: /^[0-9a-f]{64}$/.test(sha) ? sha : null
      }
    : null;
  return { ios, android, apk, live: process.env.NEXT_PUBLIC_STORES_LIVE === "1" };
}
