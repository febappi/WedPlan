import Link from "next/link";
import { bookingStatuses } from "@/lib/bookings";
import { cn } from "@/lib/utils";

// Status tabs kept in the URL, so a refresh keeps the filter
const StatusFilter = ({ basePath, current }: { basePath: string; current: string }) => {
  const options = [{ value: "", label: "All" }, ...bookingStatuses.map((status) => ({ value: status, label: status }))];

  return (
    <nav aria-label="Filter by status" className="mb-(--space-lg) flex flex-wrap gap-(--space-xs)">
      {options.map((option) => (
        <Link
          key={option.value || "all"}
          href={option.value ? `${basePath}?status=${option.value}` : basePath}
          aria-current={current === option.value ? "page" : undefined}
          className={cn(
            "inline-flex h-9 items-center rounded-(--radius-pill) px-4 text-sm font-semibold capitalize transition-colors duration-(--dur-short)",
            current === option.value ? "bg-ink text-paper" : "bg-stock text-ink shadow-[inset_0_0_0_1px_var(--color-rule)] hover:bg-paper-3"
          )}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
};

export default StatusFilter;
