import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";
import ServiceResults from "@/components/services/ServiceResults";
import { ServiceFilterValues } from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse Services",
};

const getText = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

const getLocations = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/locations`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
};

const BrowseServicesPage = async ({ searchParams }: PageProps<"/services">) => {
  const params = await searchParams;
  const filters: ServiceFilterValues = {
    search: getText(params.search),
    category: getText(params.category),
    location: getText(params.location),
    sort: getText(params.sort),
    page: getText(params.page),
  };
  const locations = await getLocations();

  return (
    <div className="container py-(--space-3xl)">
      <PageHeader
        title="Browse wedding services"
        description="Approved vendors only. Search, filter by category or city, and sort by price."
      />
      <div className="mt-(--space-xl)">
        <ServiceFilters key={JSON.stringify(filters)} filters={filters} locations={locations} />
      </div>
      <Suspense key={JSON.stringify(filters)} fallback={<div className="mt-(--space-xl)"><ServiceGridSkeleton count={6} /></div>}>
        <ServiceResults filters={filters} />
      </Suspense>
    </div>
  );
};

export default BrowseServicesPage;
