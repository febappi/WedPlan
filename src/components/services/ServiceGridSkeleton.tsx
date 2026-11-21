import { Skeleton } from "@/components/ui/skeleton";

// The shape of the service grid while it loads
const ServiceGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div role="status" aria-label="Loading services" className="grid grid-cols-1 gap-(--gap-columns) sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="stock overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full rounded-none bg-paper-3" />
          <div className="space-y-(--space-sm) p-(--space-lg)">
            <Skeleton className="h-5 w-32 bg-paper-3" />
            <Skeleton className="h-6 w-3/4 bg-paper-3" />
            <Skeleton className="h-4 w-24 bg-paper-3" />
            <Skeleton className="mt-(--space-md) h-9 w-full bg-paper-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceGridSkeleton;
