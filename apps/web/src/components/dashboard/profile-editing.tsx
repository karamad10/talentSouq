"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Editing primitives for the seeker profile. Everything persists per device
 * through localStorage — the same seam the rest of the preview build uses, so
 * swapping in a Supabase mutation later touches only `read`/`write` below.
 */
function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preview state only; ignore storage failures.
  }
}

/** Reads a stored value after mount so server and client markup match. */
function useStoredValue<T>(storageKey: string, fallback: T, parse: (raw: string) => T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const raw = read(storageKey);
      if (raw !== null) {
        try {
          setValue(parse(raw));
        } catch {
          // Corrupt entry: keep the seeded value.
        }
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageKey, parse]);

  return [value, setValue] as const;
}

const identity = (raw: string) => raw;
const parseList = (raw: string): string[] => {
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : [];
};

const inputClass =
  "w-full rounded-ts-md border border-ts-field bg-ts-surface px-3.5 py-2.5 text-sm leading-relaxed text-ts-ink outline-none transition-colors focus:border-ts-primary";
const saveClass = "inline-flex h-9 items-center gap-1.5 rounded-ts-md bg-ts-primary px-3.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90";
const cancelClass = "inline-flex h-9 items-center gap-1.5 rounded-ts-md border border-ts-line px-3.5 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-surface-2";
const editClass = "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-ts-md px-2.5 text-[13px] font-bold text-ts-primary transition-colors hover:bg-ts-primary-tint";

/** A labelled value that turns into an input (or textarea, or select) in place. */
export function EditableField({
  label,
  storageKey,
  defaultValue,
  multiline = false,
  options,
  valueClassName,
  layout = "stacked"
}: {
  label: string;
  storageKey: string;
  defaultValue: string;
  multiline?: boolean;
  options?: string[];
  valueClassName?: string;
  layout?: "stacked" | "inline";
}) {
  const [value, setValue] = useStoredValue(storageKey, defaultValue, identity);
  const [draft, setDraft] = useState(defaultValue);
  const [editing, setEditing] = useState(false);

  function start() {
    setDraft(value);
    setEditing(true);
  }

  function save() {
    const next = draft.trim() || defaultValue;
    write(storageKey, next);
    setValue(next);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold tracking-[0.06em] text-ts-muted uppercase" htmlFor={`${storageKey}-input`}>
          {label}
        </label>
        {options ? (
          <select id={`${storageKey}-input`} value={draft} onChange={(event) => setDraft(event.target.value)} className={cn(inputClass, "h-11 py-0")}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea id={`${storageKey}-input`} autoFocus rows={4} value={draft} onChange={(event) => setDraft(event.target.value)} className={inputClass} />
        ) : (
          <input id={`${storageKey}-input`} autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} className={inputClass} />
        )}
        <div className="flex gap-2">
          <button type="button" onClick={save} className={saveClass}>
            <Check size={15} aria-hidden="true" /> Save
          </button>
          <button type="button" onClick={() => setEditing(false)} className={cancelClass}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("group/field flex gap-3", layout === "inline" ? "items-center" : "flex-col")}>
      <div className="min-w-0 flex-1">
        <span className="block text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">{label}</span>
        <p className={cn("m-0 mt-1.5 text-sm leading-relaxed font-semibold text-ts-ink", valueClassName)}>{value}</p>
      </div>
      <button type="button" onClick={start} className={cn(editClass, layout === "stacked" && "self-start")} aria-label={`Edit ${label.toLowerCase()}`}>
        <Pencil size={14} aria-hidden="true" /> Edit
      </button>
    </div>
  );
}

/** A section header with its own edit affordance, used above editable blocks. */
export function EditableSection({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="m-0 text-sm font-bold text-ts-ink">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

/** An add/edit/remove list — experience, education, certifications, links. */
export function EditableList({
  storageKey,
  defaultItems,
  addLabel,
  placeholder
}: {
  storageKey: string;
  defaultItems: string[];
  addLabel: string;
  placeholder: string;
}) {
  const [items, setItems] = useStoredValue<string[]>(storageKey, defaultItems, parseList);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  function commit(next: string[]) {
    write(storageKey, JSON.stringify(next));
    setItems(next);
  }

  function saveEdit(index: number) {
    const text = draft.trim();
    if (!text) return;
    commit(items.map((item, position) => (position === index ? text : item)));
    setEditingIndex(null);
  }

  function add() {
    const text = draft.trim();
    if (!text) return;
    commit([...items, text]);
    setDraft("");
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="rounded-ts-md border border-ts-line bg-ts-surface-2/40 px-4 py-3">
            {editingIndex === index ? (
              <div className="flex flex-col gap-2.5">
                <input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} className={inputClass} />
                <div className="flex gap-2">
                  <button type="button" onClick={() => saveEdit(index)} className={saveClass}>
                    <Check size={15} aria-hidden="true" /> Save
                  </button>
                  <button type="button" onClick={() => setEditingIndex(null)} className={cancelClass}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="min-w-0 flex-1 text-sm font-semibold text-ts-ink">{item}</span>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(item);
                    setEditingIndex(index);
                    setAdding(false);
                  }}
                  className={editClass}
                  aria-label={`Edit ${item}`}
                >
                  <Pencil size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => commit(items.filter((_, position) => position !== index))}
                  className="inline-flex h-8 shrink-0 items-center rounded-ts-md px-2.5 text-[13px] font-bold text-ts-danger transition-colors hover:bg-ts-danger-tint"
                  aria-label={`Remove ${item}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="flex flex-col gap-2.5">
          <input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} className={inputClass} />
          <div className="flex gap-2">
            <button type="button" onClick={add} className={saveClass}>
              <Check size={15} aria-hidden="true" /> Add
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setDraft("");
              }}
              className={cancelClass}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft("");
            setAdding(true);
            setEditingIndex(null);
          }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-ts-md border border-dashed border-ts-line text-[13px] font-bold text-ts-muted transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
        >
          <Plus size={15} aria-hidden="true" /> {addLabel}
        </button>
      )}
    </div>
  );
}

/** Chip collection with inline add and per-chip remove — skills and languages. */
export function EditableChips({ storageKey, defaultItems, addLabel }: { storageKey: string; defaultItems: string[]; addLabel: string }) {
  const [items, setItems] = useStoredValue<string[]>(storageKey, defaultItems, parseList);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  function commit(next: string[]) {
    write(storageKey, JSON.stringify(next));
    setItems(next);
  }

  function add() {
    const text = draft.trim();
    if (!text || items.includes(text)) {
      setDraft("");
      setAdding(false);
      return;
    }
    commit([...items, text]);
    setDraft("");
    setAdding(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <span key={item} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ts-primary-tint ps-3.5 pe-1.5 text-[13px] font-semibold text-ts-primary-deep">
          {item}
          <button
            type="button"
            onClick={() => commit(items.filter((entry) => entry !== item))}
            aria-label={`Remove ${item}`}
            className="grid size-6 place-items-center rounded-full text-ts-primary-deep/70 transition-colors hover:bg-ts-surface hover:text-ts-danger"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </span>
      ))}
      {adding ? (
        <span className="inline-flex items-center gap-2">
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
              if (event.key === "Escape") setAdding(false);
            }}
            className="h-9 w-44 rounded-full border border-ts-field bg-ts-surface px-3.5 text-[13px] text-ts-ink outline-none focus:border-ts-primary"
          />
          <button type="button" onClick={add} className={saveClass}>
            <Check size={15} aria-hidden="true" /> Add
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-ts-line px-3.5 text-[13px] font-bold text-ts-muted transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
        >
          <Plus size={14} aria-hidden="true" /> {addLabel}
        </button>
      )}
    </div>
  );
}

/** A labelled on/off preference, persisted like the rest of the profile. */
export function EditableToggle({ label, description, storageKey, defaultOn = true }: { label: string; description: string; storageKey: string; defaultOn?: boolean }) {
  const [value, setValue] = useStoredValue(storageKey, defaultOn ? "on" : "off", identity);
  const on = value === "on";

  return (
    <div className="flex items-center gap-4 rounded-ts-md border border-ts-line bg-ts-surface p-4">
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-ts-ink">{label}</span>
        <span className="block text-[13px] text-ts-muted">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => {
          const next = on ? "off" : "on";
          write(storageKey, next);
          setValue(next);
        }}
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", on ? "bg-ts-primary" : "bg-ts-slate-tint")}
      >
        <span className={cn("absolute top-1 size-5 rounded-full bg-white transition-all", on ? "start-6" : "start-1")} />
      </button>
    </div>
  );
}
