import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getServicesLink } from "@/lib/services";
import { ServiceFilterValues } from "@/lib/types";
import { cn } from "@/lib/utils";

type ServicePaginationProps = {
  filters: ServiceFilterValues;
  page: number;
  totalPages: number;
};

const ServicePagination = ({ filters, page, totalPages }: ServicePaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const linkTo = (target: number) => getServicesLink({ ...filters, page: target > 1 ? String(target) : "" });

  return (
    <nav aria-label="Pages" className="mt-(--space-2xl) flex flex-wrap items-center justify-center gap-(--space-xs)">
      {page > 1 && (
        <Link href={linkTo(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <ChevronLeft />
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <Link
          key={number}
          href={linkTo(number)}
          aria-current={number === page ? "page" : undefined}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-(--radius-pill) text-sm font-semibold transition-colors duration-(--dur-short)",
            number === page ? "bg-ink text-paper" : "text-ink hover:bg-paper-3"
          )}
        >
          {number}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={linkTo(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Next
          <ChevronRight />
        </Link>
      )}
    </nav>
  );
};

export default ServicePagination;
