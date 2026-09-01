"use client";

import { Bookmark, Check, LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

type LoadingSubmitProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  pendingLabel?: string;
};

export function LoadingSubmit({ children, pendingLabel = "Working…", disabled, className, ...props }: LoadingSubmitProps) {
  const { pending } = useFormStatus();
  return <button {...props} className={className} disabled={disabled || pending} aria-busy={pending}>{pending ? <><LoaderCircle aria-hidden="true" className="button-spinner" size={16} />{pendingLabel}</> : children}</button>;
}

type PreviewActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  pendingLabel?: string;
  successLabel?: string;
  storageKey?: string;
};

/** A local preview action for flows whose Supabase mutation is not wired yet. */
export function PreviewActionButton({ children, pendingLabel = "Saving…", successLabel = "Saved", storageKey, className, onClick, ...props }: PreviewActionButtonProps) {
  const [state, setState] = useState<"idle" | "pending" | "complete">("idle");

  useEffect(() => {
    if (!storageKey) return;
    const id = window.setTimeout(() => {
      if (window.localStorage.getItem(storageKey) === "complete") setState("complete");
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageKey]);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented || state === "pending") return;
    setState("pending");
    window.setTimeout(() => {
      if (storageKey) window.localStorage.setItem(storageKey, "complete");
      setState("complete");
    }, 350);
  }

  return <button {...props} className={className} disabled={props.disabled || state === "pending"} onClick={handleClick} aria-busy={state === "pending"} aria-live="polite">{state === "pending" ? <><LoaderCircle aria-hidden="true" className="button-spinner" size={16} />{pendingLabel}</> : state === "complete" ? <><Check aria-hidden="true" size={16} />{successLabel}</> : children}</button>;
}

export function ToggleActionButton({ label, activeLabel, className, storageKey }: { label: string; activeLabel: string; className: string; storageKey: string }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setActive(window.localStorage.getItem(storageKey) === "active"), 0);
    return () => window.clearTimeout(id);
  }, [storageKey]);
  function toggle() {
    setActive((current) => {
      const next = !current;
      window.localStorage.setItem(storageKey, next ? "active" : "");
      return next;
    });
  }
  return <button className={className} type="button" onClick={toggle} aria-pressed={active}>{active ? activeLabel : label}</button>;
}

export function BookmarkToggle({ storageKey, label }: { storageKey: string; label: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setSaved(window.localStorage.getItem(storageKey) === "saved"), 0);
    return () => window.clearTimeout(id);
  }, [storageKey]);
  function toggle() {
    setSaved((current) => {
      const next = !current;
      window.localStorage.setItem(storageKey, next ? "saved" : "");
      return next;
    });
  }
  return <button className="save-button" type="button" aria-label={`${saved ? "Remove" : "Save"} ${label}`} aria-pressed={saved} onClick={toggle}><Bookmark aria-hidden="true" fill={saved ? "currentColor" : "none"} size={19} /></button>;
}
