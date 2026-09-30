import { afterEach, describe, expect, it, vi } from "vitest";
import { appLinks } from "./app-links";

afterEach(() => vi.unstubAllEnvs());

describe("appLinks", () => {
  it("offers nothing until the store and APK URLs are set", () => {
    vi.stubEnv("NEXT_PUBLIC_IOS_APP_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APP_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APK_URL", "");
    expect(appLinks()).toEqual({ ios: null, android: null, apk: null, any: false });
  });

  it("returns only the links that are configured", () => {
    vi.stubEnv("NEXT_PUBLIC_IOS_APP_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APP_URL", "https://play.google.com/store/apps/details?id=com.karehan.app");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APK_URL", "https://talentsouq.it.com/downloads/talentsouq.apk");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APK_SIZE_MB", "38");
    expect(appLinks()).toEqual({
      ios: null,
      android: "https://play.google.com/store/apps/details?id=com.karehan.app",
      apk: { url: "https://talentsouq.it.com/downloads/talentsouq.apk", sizeMb: 38 },
      any: true
    });
  });

  it("ignores a link that is not https", () => {
    vi.stubEnv("NEXT_PUBLIC_IOS_APP_URL", "javascript:alert(1)");
    vi.stubEnv("NEXT_PUBLIC_ANDROID_APK_URL", "http://insecure.example/app.apk");
    const links = appLinks();
    expect(links.ios).toBeNull();
    expect(links.apk).toBeNull();
  });
});
