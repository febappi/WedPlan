import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Placeholders shaped like the pages they stand in for, so nothing jumps when the data arrives

const Bone = ({ className }: { className?: string }) => <Skeleton className={cn("bg-paper-3", className)} />;

// Wraps a skeleton so screen readers hear one short loading message
export const LoadingRegion = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div role="status" aria-label={label}>
    {children}
    <span className="sr-only">Loading…</span>
  </div>
);

export const HeaderSkeleton = ({ action = false }: { action?: boolean }) => (
  <div className="mb-(--space-xl) flex flex-col gap-(--space-md) sm:flex-row sm:items-end sm:justify-between">
    <div>
      <Bone className="h-9 w-56" />
      <Bone className="mt-(--space-xs) h-4 w-80 max-w-full" />
    </div>
    {action && <Bone className="h-10 w-40" />}
  </div>
);

export const StatsSkeleton = () => (
  <>
    <div className="grid grid-cols-2 gap-(--space-md) lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Bone key={index} className="h-28 rounded-(--radius-card)" />
      ))}
    </div>
    <Bone className="mt-(--space-xl) h-48 rounded-(--radius-card)" />
  </>
);

// Status chips (bookings) or a search box with selects (admin lists)
export const FilterSkeleton = ({ variant = "search" }: { variant?: "chips" | "search" }) =>
  variant === "chips" ? (
    <div className="mb-(--space-md) flex gap-(--space-xs) overflow-hidden sm:mb-(--space-lg)">
      {["w-16", "w-20", "w-20", "w-20", "w-24"].map((width, index) => (
        <Bone key={index} className={cn("h-9 shrink-0 rounded-full", width)} />
      ))}
    </div>
  ) : (
    <div className="mb-(--space-lg) grid grid-cols-1 gap-(--space-sm) sm:grid-cols-[minmax(0,1fr)_12rem_12rem]">
      <Bone className="h-10" />
      <Bone className="h-10" />
      <Bone className="hidden h-10 sm:block" />
    </div>
  );

// Rows of a list or table: a title line, a detail line and a status on the right
export const ListSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="stock overflow-hidden">
    {Array.from({ length: rows }, (_, index) => (
      <div key={index} className="flex items-center gap-(--space-md) border-b border-rule p-(--space-md) last:border-b-0 sm:p-(--space-lg)">
        <Bone className="hidden size-12 shrink-0 rounded-(--radius-input) sm:block" />
        <div className="min-w-0 flex-1 space-y-(--space-xs)">
          <Bone className="h-5 w-2/3 max-w-72" />
          <Bone className="h-4 w-1/2 max-w-56" />
        </div>
        <Bone className="h-7 w-20 shrink-0 rounded-full" />
      </div>
    ))}
  </div>
);

export const FormSkeleton = ({ fields = 5 }: { fields?: number }) => (
  <div className="stock max-w-3xl space-y-(--space-lg) p-(--space-lg) sm:p-(--space-xl)">
    {Array.from({ length: fields }, (_, index) => (
      <div key={index} className="space-y-(--space-xs)">
        <Bone className="h-4 w-28" />
        <Bone className={cn("w-full", index === fields - 1 ? "h-28" : "h-10")} />
      </div>
    ))}
    <Bone className="h-11 w-40" />
  </div>
);

export const PlanCardsSkeleton = () => (
  <div className="grid max-w-4xl grid-cols-1 gap-(--gap-columns) md:grid-cols-2">
    {[0, 1].map((card) => (
      <div key={card} className="stock space-y-(--space-md) p-(--space-xl)">
        <Bone className="h-6 w-24" />
        <Bone className="h-10 w-32" />
        {Array.from({ length: 4 }, (_, index) => (
          <Bone key={index} className="h-4 w-full max-w-64" />
        ))}
        <Bone className="mt-(--space-md) h-11 w-full" />
      </div>
    ))}
  </div>
);

// Gallery on the left, name, price, vendor and booking on the right
export const ServiceDetailsSkeleton = () => (
  <div className="container py-(--space-2xl)">
    <Bone className="h-5 w-32" />
    <div className="mt-(--space-lg) grid grid-cols-1 gap-(--space-xl) lg:grid-cols-12 lg:gap-x-(--gap-columns)">
      <div className="lg:col-span-7">
        <Bone className="aspect-[4/3] w-full rounded-(--radius-stock)" />
        <div className="mt-(--space-md) grid grid-cols-5 gap-(--space-sm)">
          {Array.from({ length: 5 }, (_, index) => (
            <Bone key={index} className="aspect-square rounded-(--radius-input)" />
          ))}
        </div>
      </div>
      <div className="space-y-(--space-md) lg:col-span-5">
        <Bone className="h-7 w-36 rounded-full" />
        <Bone className="h-10 w-4/5" />
        <Bone className="h-9 w-32" />
        <Bone className="h-4 w-40" />
        <Bone className="h-4 w-44" />
        <Bone className="h-24 w-full rounded-(--radius-stock)" />
        <Bone className="h-12 w-full" />
      </div>
    </div>
  </div>
);
