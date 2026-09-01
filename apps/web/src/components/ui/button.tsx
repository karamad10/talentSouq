import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full font-bold transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60",
  {
    variants: {
      tone: {
        primary: "bg-teal text-white hover:bg-teal-dark",
        secondary: "border border-line bg-surface text-ink hover:bg-surface-soft",
        coral: "bg-coral text-[#1d2525] hover:brightness-105",
        ghost: "border border-white/40 bg-white/10 text-white hover:bg-white/20",
        danger: "bg-danger text-white hover:brightness-95"
      },
      size: {
        sm: "min-h-[42px] px-[18px] text-sm",
        md: "min-h-[49px] px-[21px] text-sm",
        lg: "min-h-14 px-7 text-base"
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
