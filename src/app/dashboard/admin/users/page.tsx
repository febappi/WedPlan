import type { Metadata } from "next";
import UserTable from "@/components/admin/UserTable";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ListFilters from "@/components/dashboard/ListFilters";
import ListPagination from "@/components/dashboard/ListPagination";
import { serverFetch } from "@/lib/server-api";
import { AdminUser, Paginated } from "@/lib/types";

export const metadata: Metadata = {
  title: "Manage Users",
};

const getText = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

const ManageUsersPage = async ({ searchParams }: PageProps<"/dashboard/admin/users">) => {
  const params = await searchParams;
  const values = { search: getText(params.search), role: getText(params.role), page: getText(params.page) };
  const query = new URLSearchParams(Object.entries(values).filter(([, value]) => value));
  const data = await serverFetch<Paginated<"users", AdminUser>>(`/users?${query.toString()}`);

  return (
    <>
      <DashboardHeader title="Manage Users" description="Everyone with a WedPlan account. Blocked users cannot sign in or use the platform." />
      <ListFilters
        basePath="/dashboard/admin/users"
        values={values}
        searchPlaceholder="Search by name or email"
        selects={[
          {
            name: "role",
            label: "Role",
            options: [
              { value: "", label: "All roles" },
              { value: "customer", label: "Customers" },
              { value: "vendor", label: "Vendors" },
              { value: "admin", label: "Admins" },
            ],
          },
        ]}
      />

      {!data && <p className="stock p-(--space-xl) text-ink-2">Users could not load. Please refresh the page.</p>}
      {data && data.users.length === 0 && <p className="stock p-(--space-xl) text-ink-2">No users match these filters.</p>}
      {data && data.users.length > 0 && (
        <>
          <UserTable users={data.users} />
          <ListPagination basePath="/dashboard/admin/users" values={values} page={data.page} totalPages={data.totalPages} total={data.total} />
        </>
      )}
    </>
  );
};

export default ManageUsersPage;
