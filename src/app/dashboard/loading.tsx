import { Skeleton } from "@/components/ui/skeleton";

// Shown inside the dashboard shell while a page loads its data
const DashboardLoading = () => {
  return (
    <div role="status" aria-label="Loading dashboard">
      <Skeleton className="h-9 w-56 bg-paper-3" />
      <Skeleton className="mt-(--space-xs) h-4 w-80 max-w-full bg-paper-3" />
      <div className="mt-(--space-xl) grid grid-cols-2 gap-(--space-md) lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-(--radius-card) bg-paper-3" />
        ))}
      </div>
      <Skeleton className="mt-(--space-xl) h-48 rounded-(--radius-card) bg-paper-3" />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default DashboardLoading;
