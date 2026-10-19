import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const avatarVariants = cva("grid shrink-0 place-items-center rounded-ts-md font-semibold", {
  variants: {
    size: {
      sm: "size-9 text-[11px]",
      md: "size-13 text-sm",
      lg: "size-17 rounded-ts-lg text-lg"
    },
    tone: {
      teal: "bg-ts-primary-tint text-ts-primary-deep",
      coral: "bg-ts-accent-tint text-ts-accent-deep",
      blue: "bg-ts-slate-tint text-ts-ink",
      purple: "bg-ts-surface-2 text-ts-muted",
      photo: "bg-ts-primary text-ts-on-primary"
    }
  },
  defaultVariants: { size: "md", tone: "teal" }
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;

type AvatarProps = AvatarVariants &
  HTMLAttributes<HTMLDivElement> & {
    initials?: string;
    src?: string;
    alt?: string;
  };

export function Avatar({ size, tone, initials, src, alt = "", className, ...props }: AvatarProps) {
  return (
    <div className={cn(avatarVariants({ size, tone }), "overflow-hidden", className)} {...props}>
      {src ? <Image src={src} alt={alt} width={64} height={64} className="size-full object-cover" /> : initials}
    </div>
  );
}
