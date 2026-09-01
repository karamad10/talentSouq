import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const badgeVariants = cva("inline-flex items-center gap-1 rounded-full font-extrabold", {
  variants: {
    tone: {
      neutral: "bg-surface-soft text-ink-soft",
      teal: "bg-teal-pale text-teal",
      success: "bg-success-pale text-success",
      attention: "bg-attention-pale text-attention",
      danger: "bg-danger-pale text-danger"
    },
    size: {
      sm: "px-2 py-0.5 text-[11px]",
      md: "px-2.5 py-1 text-xs"
    }
  },
  defaultVariants: { tone: "teal", size: "md" }
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

type BadgeProps = BadgeVariants & HTMLAttributes<HTMLSpanElement>;

export function Badge({ tone, size, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}
