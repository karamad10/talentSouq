import { cva, type VariantProps } from "class-variance-authority";
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputVariants = cva(
  "w-full min-w-0 border-[1.5px] border-ts-field bg-ts-surface-2 text-ts-ink outline-none transition-colors placeholder:text-ts-subtle focus:border-ts-focus focus:bg-ts-surface focus:ring-3 focus:ring-ts-focus-ring",
  {
    variants: {
      size: {
        sm: "h-10 rounded-ts-md px-3 text-[13px]",
        md: "h-12 rounded-ts-md px-4 text-[15px]"
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
