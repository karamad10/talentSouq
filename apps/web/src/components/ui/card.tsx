import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const cardVariants = cva("rounded-[var(--radius-md)] border", {
  variants: {
    tone: {
      surface: "border-line bg-surface text-ink",
      soft: "border-line bg-surface-soft text-ink",
      strong: "border-transparent bg-surface-strong text-on-surface-strong"
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    },
    elevated: {
      true: "shadow-sm"
    }
  },
  defaultVariants: { tone: "surface", padding: "md" }
});

export type CardVariants = VariantProps<typeof cardVariants>;

type CardProps = CardVariants & HTMLAttributes<HTMLDivElement>;

export function Card({ tone, padding, elevated, className, ...props }: CardProps) {
  return <div className={cn(cardVariants({ tone, padding, elevated }), className)} {...props} />;
}
