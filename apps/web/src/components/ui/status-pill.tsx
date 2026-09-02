import { statusTone } from "@/lib/status";
import { Badge } from "@/components/ui/badge";

export function StatusPill({ status, className }: { status: string; className?: string }) {
  return (
    <Badge tone={statusTone(status)} size="sm" className={className}>
      {status}
    </Badge>
  );
}
