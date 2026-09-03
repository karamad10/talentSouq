"use client";

import { Bookmark, Check, FileText, LoaderCircle, Pencil } from "lucide-react";
import type { ButtonHTMLAttributes, ChangeEvent, MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

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

/** An inline-editable block of text, persisted to localStorage. Used where a full edit form isn't warranted. */
export function InlineEditText({
  storageKey,
  defaultValue,
  multiline = false,
  className,
  editButtonClassName
}: {
  storageKey: string;
  defaultValue: string;
  multiline?: boolean;
  className?: string;
  editButtonClassName: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [draft, setDraft] = useState(defaultValue);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setValue(stored);
        setDraft(stored);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageKey]);

  function save() {
    const next = draft.trim() || defaultValue;
    window.localStorage.setItem(storageKey, next);
    setValue(next);
    setEditing(false);
  }

  if (editing) {
    const Field = multiline ? "textarea" : "input";
    return (
      <div className="flex flex-col gap-2">
        <Field
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={multiline ? 3 : undefined}
          className={cn(
            "w-full rounded-ts-md border border-ts-field bg-ts-surface px-3 py-2 text-sm leading-relaxed text-ts-ink outline-none focus:border-ts-primary",
            className
          )}
        />
        <div className="flex gap-2">
          <button type="button" onClick={save} className="inline-flex h-7 items-center rounded-ts-md bg-ts-primary px-2.5 text-xs font-semibold text-white">
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(value);
              setEditing(false);
            }}
            className="inline-flex h-7 items-center rounded-ts-md border border-ts-field px-2.5 text-xs font-semibold text-ts-ink"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2">
      <p className={cn("m-0 flex-1", className)}>{value}</p>
      <button type="button" onClick={() => setEditing(true)} className={editButtonClassName}>
        <Pencil size={13} aria-hidden="true" /> Edit
      </button>
    </div>
  );
}

/** Real file-picker driven CV replace/view: no backend yet, so the file stays in-memory for this tab. */
export function CvManager({ storageKey, defaultFileName, defaultStatus }: { storageKey: string; defaultFileName: string; defaultStatus: string }) {
  const [fileName, setFileName] = useState(defaultFileName);
  const [status, setStatus] = useState(defaultStatus);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const storedName = window.localStorage.getItem(`${storageKey}-name`);
      if (storedName) setFileName(storedName);
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageKey]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setFileName(file.name);
    setStatus(`CV uploaded · parsed just now`);
    window.localStorage.setItem(`${storageKey}-name`, file.name);
  }

  function view() {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      setStatus("No file in this session yet — replace your CV to preview it.");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-ts-sm bg-ts-surface-2 text-ts-muted">
        <FileText size={17} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <strong className="block truncate text-[13px] font-semibold text-ts-ink">{fileName}</strong>
        <p className="m-0 truncate text-xs text-ts-muted">{status}</p>
      </div>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-8 items-center gap-1.5 rounded-ts-md px-2 text-[13px] font-semibold text-ts-primary transition-colors hover:bg-ts-surface-2"
      >
        Replace
      </button>
      <button
        type="button"
        onClick={view}
        className="inline-flex h-8 items-center rounded-ts-md border border-ts-field bg-ts-surface px-2.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-surface-2"
      >
        View
      </button>
    </div>
  );
}

export function BookmarkToggle({ storageKey, label, className = "save-button", size = 19 }: { storageKey: string; label: string; className?: string; size?: number }) {
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
  return <button className={className} type="button" aria-label={`${saved ? "Remove" : "Save"} ${label}`} aria-pressed={saved} onClick={toggle}><Bookmark aria-hidden="true" fill={saved ? "currentColor" : "none"} size={size} /></button>;
}
