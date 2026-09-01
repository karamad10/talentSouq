import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const avatarVariants = cva("grid shrink-0 place-items-center rounded-full font-extrabold", {
  variants: {
    size: {
      sm: "size-9 text-[11px]",
      md: "size-13 text-sm",
      lg: "size-17 text-lg"
    },
    tone: {
      teal: "bg-teal-pale text-teal",
      coral: "bg-[#fbe4df] text-[#b23c1f]",
      blue: "bg-[#e3eeff] text-[#2952a3]",
      purple: "bg-[#e8e4fb] text-[#5c4aa8]",
      photo: "bg-[#bb7568] text-white"
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
