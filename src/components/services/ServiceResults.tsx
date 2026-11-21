import Link from "next/link";
import { SearchX, TriangleAlert } from "lucide-react";
import ServiceCard from "./ServiceCard";
import ServicePagination from "./ServicePagination";
import { buttonVariants } from "@/components/ui/button";
import { getFilterQuery } from "@/lib/services";
import { ServiceFilterValues, ServicesResponse } from "@/lib/types";

const getServices = async (filters: ServiceFilterValues): Promise<ServicesResponse | null> => {
  const query = getFilterQuery(filters);
  query.set("limit", "9");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?${query.toString()}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const ServiceResults = async ({ filters }: { filters: ServiceFilterValues }) => {
  const data = await getServices(filters);

  if (!data) {
    return (
      <div className="stock mt-(--space-xl) flex flex-col items-start gap-(--space-md) p-(--space-xl)">
        <TriangleAlert className="size-8 text-coral" aria-hidden="true" />
        <div>
          <h2 className="text-(length:--text-title)">Services did not load</h2>
          <p className="mt-(--space-xs) text-ink-2">The server did not answer. Check your connection and try again.</p>
        </div>
        <Link href="/services" className={buttonVariants({ variant: "outline" })}>
          Try again
        </Link>
      </div>
    );
  }

  if (data.services.length === 0) {
    return (
      <div className="stock mt-(--space-xl) flex flex-col items-start gap-(--space-md) p-(--space-xl)">
        <SearchX className="size-8 text-ink-3" aria-hidden="true" />
        <div>
          <h2 className="text-(length:--text-title)">No services match</h2>
          <p className="mt-(--space-xs) text-ink-2">Try another word, a different city or a wider category.</p>
        </div>
        <Link href="/services" className={buttonVariants({ variant: "outline" })}>
          See all services
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-(--space-xl)">
      <p className="mb-(--space-md) text-sm text-ink-2" aria-live="polite">
        {data.total} {data.total === 1 ? "service" : "services"} found
      </p>
      <div className="grid grid-cols-1 gap-(--gap-columns) sm:grid-cols-2 xl:grid-cols-3">
        {data.services.map((service, index) => (
          <ServiceCard key={service._id} service={service} priority={index < 3} />
        ))}
      </div>
      <ServicePagination filters={filters} page={data.page} totalPages={data.totalPages} />
    </div>
  );
};

export default ServiceResults;
