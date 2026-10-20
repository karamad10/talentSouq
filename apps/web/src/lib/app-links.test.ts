import { afterEach, describe, expect, it, vi } from "vitest";
import { APP_STORE_URL, PLAY_STORE_URL, appLinks } from "./app-links";

afterEach(() => vi.unstubAllEnvs());

describe("appLinks", () => {
  it("falls back to the real store listings and offers no APK until it is set", () => {
    vi.stubEnv("NEXT_PUBLIC_IOS_APP_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APP_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APK_URL", "");
    vi.stubEnv("NEXT_PUBLIC_STORES_LIVE", "");
    expect(appLinks()).toEqual({ ios: APP_STORE_URL, android: PLAY_STORE_URL, apk: null, live: false });
  });

  it("lets an env var override a store link and adds the APK", () => {
    vi.stubEnv("NEXT_PUBLIC_IOS_APP_URL", "https://apps.apple.com/ae/app/talentsouq/id6778230487");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APP_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APK_URL", "https://talentsouq.it.com/downloads/talentsouq.apk");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APK_SIZE_MB", "38");
    expect(appLinks()).toEqual({
      ios: "https://apps.apple.com/ae/app/talentsouq/id6778230487",
      android: PLAY_STORE_URL,
      apk: { url: "https://talentsouq.it.com/downloads/talentsouq.apk", sizeMb: 38 },
      live: false
    });
  });

  it("is live only once NEXT_PUBLIC_STORES_LIVE is 1", () => {
    vi.stubEnv("NEXT_PUBLIC_STORES_LIVE", "1");
    expect(appLinks().live).toBe(true);
  });

  it("ignores a link that is not https", () => {
    vi.stubEnv("NEXT_PUBLIC_IOS_APP_URL", "javascript:alert(1)");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APK_URL", "http://insecure.example/app.apk");
    const links = appLinks();
    expect(links.ios).toBe(APP_STORE_URL);
    expect(links.apk).toBeNull();
  });
});
