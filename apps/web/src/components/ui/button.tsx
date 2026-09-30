import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-ts-md font-semibold transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ts-focus disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      tone: {
        primary: "bg-ts-primary text-ts-on-primary hover:bg-ts-primary-deep",
        secondary: "border-[1.5px] border-ts-field bg-ts-surface text-ts-ink hover:bg-ts-surface-2",
        coral: "bg-coral text-[#1d2525] hover:brightness-105",
        ghost: "border border-white/40 bg-white/10 text-white hover:bg-white/20",
        danger: "bg-danger text-white hover:brightness-95"
      },
      size: {
        sm: "min-h-11 px-4 text-[13px]",
        md: "min-h-12 px-6 text-[15px]",
        lg: "min-h-13 px-7 text-base"
      },
      iconOnly: {
        true: "aspect-square px-0"
      },
      fullWidth: {
        true: "w-full"
      }
    },
    defaultVariants: { tone: "primary", size: "md" }
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = ButtonVariants &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
    pending?: boolean;
    pendingLabel?: string;
  };

export function Button({ tone, size, iconOnly, fullWidth, pending, pendingLabel = "Working…", className, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ tone, size, iconOnly, fullWidth }), className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      <span className={cn(pending && "invisible")}>{children}</span>
      {pending ? (
        <span className="absolute inset-0 grid place-items-center text-current">
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          <span className="sr-only">{pendingLabel}</span>
        </span>
      ) : null}
    </button>
  );
}
