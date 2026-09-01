import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const trackVariants = cva("overflow-hidden rounded-full bg-surface-soft", {
  variants: {
    size: {
      sm: "h-[5px]",
      md: "h-2",
      lg: "h-2.5"
    }
  },
  defaultVariants: { size: "md" }
});

const fillVariants = cva("block h-full rounded-full", {
  variants: {
    tone: {
      teal: "bg-teal",
      coral: "bg-coral",
      success: "bg-success",
      attention: "bg-orange"
    }
  },
  defaultVariants: { tone: "teal" }
});

type ProgressBarProps = VariantProps<typeof trackVariants> &
  VariantProps<typeof fillVariants> & {
    value: number;
    label: string;
    className?: string;
  };

export function ProgressBar({ value, label, size, tone, className }: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(trackVariants({ size }), className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedValue}
    >
      <span className={fillVariants({ tone })} style={{ width: `${normalizedValue}%` }} />
    </div>
  );
}
