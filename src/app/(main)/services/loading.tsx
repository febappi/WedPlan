import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Browse Services: the page title, the filter bar and the service grid
const Loading = () => (
  <div className="container py-(--space-3xl)">
    <Skeleton className="h-11 w-80 max-w-full bg-paper-3" />
    <Skeleton className="mt-(--space-sm) h-5 w-96 max-w-full bg-paper-3" />
    <Skeleton className="mt-(--space-xl) h-32 w-full rounded-(--radius-stock) bg-paper-3 sm:h-20" />
    <div className="mt-(--space-xl)">
      <ServiceGridSkeleton count={6} />
    </div>
  </div>
);

export default Loading;
