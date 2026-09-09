"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const IOS_URL = process.env.NEXT_PUBLIC_IOS_APP_URL ?? "";
const ANDROID_URL = process.env.NEXT_PUBLIC_ANDROID_APP_URL ?? "";
const DISMISSED_KEY = "ts-app-banner-dismissed";
const DISMISSED_EVENT = "ts-app-banner-dismissed";
const NARROW = "(max-width: 900px)";

/** Public marketing routes only — inside the workspace the user is already "in the app". */
function isPublicRoute(pathname: string) {
  return !/^\/(seeker|employer|auth|invite)(\/|$)/.test(pathname);
}

/**
 * The store link for this device, or "" when there is nothing to offer: a desktop
 * browser, a platform without a configured URL, or a visitor who dismissed the bar.
 * Read synchronously so `useSyncExternalStore` can compare snapshots by value.
 */
function bannerHref() {
  if (!window.matchMedia(NARROW).matches) return "";
  try {
    if (window.localStorage.getItem(DISMISSED_KEY) === "1") return "";
  } catch {
    // Private mode or blocked storage: show the bar rather than fail closed.
  }
  const ua = navigator.userAgent;
  // iPadOS 13+ reports a desktop UA, so fall back to the touch-point check.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return IOS_URL;
  if (/Android/i.test(ua)) return ANDROID_URL;
  return "";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(NARROW);
  media.addEventListener("change", onChange);
  window.addEventListener(DISMISSED_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(DISMISSED_EVENT, onChange);
  };
}

/**
 * Offers the native app to phone visitors without taking the web experience away
 * from them: the site stays fully usable, and a dismissal sticks.
 *
 * Renders nothing on the server or on desktop, and nothing at all until
 * NEXT_PUBLIC_IOS_APP_URL / NEXT_PUBLIC_ANDROID_APP_URL are configured — so it
 * stays invisible until the apps actually ship.
 */
export function AppBanner() {
  const pathname = usePathname();
  const href = useSyncExternalStore(subscribe, bannerHref, () => "");

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to persist to; the event below still hides it for this page view.
    }
    window.dispatchEvent(new Event(DISMISSED_EVENT));
  }

  if (!href || !isPublicRoute(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ts-line bg-ts-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(11,27,35,0.12)] backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3">
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-ts-md bg-ts-primary text-base font-bold text-white">
          T
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-sm font-bold text-ts-ink">TalentSouq</strong>
          <span className="block truncate text-[13px] text-ts-muted">Faster applying in the app</span>
        </span>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center rounded-full bg-ts-primary px-4 text-sm font-bold whitespace-nowrap text-white"
        >
          Open
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="grid size-9 shrink-0 place-items-center rounded-full text-ts-muted hover:bg-ts-surface-2 hover:text-ts-ink"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
