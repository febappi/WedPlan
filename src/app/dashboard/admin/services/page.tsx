import type { Metadata } from "next";
import ServiceReviewTable from "@/components/admin/ServiceReviewTable";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ListFilters from "@/components/dashboard/ListFilters";
import ListPagination from "@/components/dashboard/ListPagination";
import { categories } from "@/lib/categories";
import { serverFetch } from "@/lib/server-api";
import { ServicesResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "Manage Services",
};

const getText = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

const ManageServicesPage = async ({ searchParams }: PageProps<"/dashboard/admin/services">) => {
  const params = await searchParams;
  const values = {
    search: getText(params.search),
    status: getText(params.status),
    category: getText(params.category),
    page: getText(params.page),
  };
  const query = new URLSearchParams(Object.entries(values).filter(([, value]) => value));
  const data = await serverFetch<ServicesResponse>(`/services/admin/all?${query.toString()}`);

  return (
    <>
      <DashboardHeader
        title="Manage Services"
        description="Approve new listings, reject ones that break the rules, and remove anything inappropriate. Only approved and available services are public."
      />
      <ListFilters
        basePath="/dashboard/admin/services"
        values={values}
        searchPlaceholder="Search services or vendors"
        selects={[
          {
            name: "status",
            label: "Status",
            options: [
              { value: "", label: "All statuses" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ],
          },
          {
            name: "category",
            label: "Category",
            options: [{ value: "", label: "All categories" }, ...categories.map((category) => ({ value: category, label: category }))],
          },
        ]}
      />

      {!data && <p className="stock p-(--space-xl) text-ink-2">Services could not load. Please refresh the page.</p>}
      {data && data.services.length === 0 && <p className="stock p-(--space-xl) text-ink-2">No services match these filters.</p>}
      {data && data.services.length > 0 && (
        <>
          <ServiceReviewTable services={data.services} />
          <ListPagination basePath="/dashboard/admin/services" values={values} page={data.page} totalPages={data.totalPages} total={data.total} />
        </>
      )}
    </>
  );
};

export default ManageServicesPage;
