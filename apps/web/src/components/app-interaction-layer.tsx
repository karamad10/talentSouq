"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Global progressive feedback for native forms and App Router navigations. */
export function AppInteractionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    delete document.documentElement.dataset.navigating;
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download") || link.href.startsWith("mailto:") || link.origin !== window.location.origin) return;
      const next = new URL(link.href);
      if (next.pathname === window.location.pathname && next.search === window.location.search) return;
      document.documentElement.dataset.navigating = "true";
    }

    function onSubmit(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.dataset.noPending !== undefined) return;
      form.dataset.pending = "true";
      form.setAttribute("aria-busy", "true");
      for (const button of form.querySelectorAll<HTMLButtonElement>('button[type="submit"]')) button.disabled = true;
    }

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return <div className="route-progress" aria-hidden="true" />;
}
