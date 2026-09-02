import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  label: string;
  size?: "sm" | "md";
};

export function IconButton({ label, size = "md", className, type = "button", children, ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-ts-sm text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "size-7" : "size-8",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
