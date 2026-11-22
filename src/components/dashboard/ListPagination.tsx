import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type ListPaginationProps = {
  basePath: string;
  values: Record<string, string>;
  page: number;
  totalPages: number;
  total: number;
};

// Previous and next links that keep the current filters
const ListPagination = ({ basePath, values, page, totalPages, total }: ListPaginationProps) => {
  const linkTo = (target: number) => {
    const query = new URLSearchParams();
    Object.entries({ ...values, page: target > 1 ? String(target) : "" }).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });
    const queryString = query.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <div className="mt-(--space-md) flex flex-wrap items-center justify-between gap-(--space-sm) text-sm text-ink-2">
      <p>
        {total} {total === 1 ? "result" : "results"}
        {totalPages > 1 && `, page ${page} of ${totalPages}`}
      </p>
      {totalPages > 1 && (
        <div className="flex gap-(--space-xs)">
          {page > 1 && (
            <Link href={linkTo(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link href={linkTo(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ListPagination;
