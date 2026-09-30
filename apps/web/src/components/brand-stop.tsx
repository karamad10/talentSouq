/**
 * "The dot": the orange full stop that ends a headline. It is the one visual
 * element TalentSouq shares with Triovate — the dot over both logos, in the
 * same orange (report RPT-2026-014 §4, §10) — and the app ends its screen
 * titles the same way (apps/mobile/src/ui/PageTitle.tsx).
 *
 * Decorative only: hidden from screen readers, and never on names or data
 * (a company or a person's name gets no full stop).
 */
export function BrandStop() {
  return (
    <span aria-hidden="true" className="text-ts-accent">
      .
    </span>
  );
}

/** A headline ending in the brand stop; a trailing "." in the copy is replaced, not doubled. */
export function Stopped({ children }: { children: string }) {
  return (
    <>
      {children.replace(/[.。]\s*$/u, "")}
      <BrandStop />
    </>
  );
}

/**
 * A page eyebrow, as the app writes them (PageTitle): sentence case, muted,
 * not spaced capitals — led by the same orange dot.
 */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`m-0 inline-flex items-center gap-2 text-[13px] font-medium text-ts-muted ${className}`}>
      <span aria-hidden="true" className="inline-block size-1.5 shrink-0 rounded-full bg-ts-accent" />
      {children}
    </p>
  );
}
