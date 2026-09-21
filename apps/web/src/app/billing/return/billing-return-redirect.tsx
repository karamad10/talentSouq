"use client";

import { useEffect } from "react";

/**
 * Hands the customer back to the mobile app after Stripe.
 *
 * One attempt, then nothing: a desktop browser or a phone without the app
 * installed simply stays on this page, which explains itself, rather than
 * showing the browser's "cannot open" error. The visible button below stays
 * available either way.
 */
export function BillingReturnRedirect({ deepLink }: { deepLink: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = deepLink;
    }, 600);
    return () => clearTimeout(timer);
  }, [deepLink]);

  return null;
}
