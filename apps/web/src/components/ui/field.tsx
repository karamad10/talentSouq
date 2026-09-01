import { cva, type VariantProps } from "class-variance-authority";
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputVariants = cva(
  "w-full min-w-0 border border-line bg-surface text-ink outline-none transition-colors focus:border-teal focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--teal)_16%,transparent)]",
  {
    variants: {
      size: {
        sm: "h-9 rounded-[11px] px-2.5 text-xs",
        md: "h-13 rounded-[var(--radius-sm)] px-4 text-sm"
      }
    },
    defaultVariants: { size: "md" }
  }
);

export type InputVariants = VariantProps<typeof inputVariants>;

type InputProps = InputVariants & InputHTMLAttributes<HTMLInputElement>;

export function Input({ size, className, ...props }: InputProps) {
  return <input className={cn(inputVariants({ size }), className)} {...props} />;
}

type FieldProps = InputVariants &
  InputHTMLAttributes<HTMLInputElement> & {
    label: ReactNode;
    error?: string;
    labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  };

export function Field({ label, error, size, className, id, labelProps, ...props }: FieldProps) {
  const inputId = id ?? props.name;
  return (
    <div className="mb-4.5 grid gap-1.5 text-sm font-semibold">
      <label htmlFor={inputId} {...labelProps}>
        {label}
      </label>
      <Input id={inputId} size={size} aria-invalid={Boolean(error)} className={className} {...props} />
      {error ? <p className="text-xs font-semibold text-danger">{error}</p> : null}
    </div>
  );
}
