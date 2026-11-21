import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  pending: "bg-pear text-pear-ink",
  approved: "bg-mint text-ink",
  accepted: "bg-mint text-ink",
  rejected: "bg-coral text-ink",
  cancelled: "bg-paper-3 text-ink-2",
  paid: "bg-mint text-ink",
  failed: "bg-coral text-ink",
};

// A status word on its colour: pear waits, mint is done, coral is a no
const StatusBadge = ({ status, className }: { status: string; className?: string }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-(--radius-pill) px-(--space-sm) py-(--space-3xs) text-xs font-semibold capitalize",
        styles[status] || "bg-paper-3 text-ink-2",
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
