import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentList from "@/components/dashboard/RecentList";
import StatCard from "@/components/dashboard/StatCard";
import { formatDate, formatMoney } from "@/lib/format";
import { serverFetch } from "@/lib/server-api";
import { AdminStats, ServicesResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminOverviewPage = async () => {
  const [stats, pending] = await Promise.all([
    serverFetch<AdminStats>("/stats/admin"),
    serverFetch<ServicesResponse>("/services/admin/all?status=pending&limit=5"),
  ]);
  const revenue = stats?.revenue.map((row) => formatMoney(row.amount, row.currency)).join(" and ") || "";

  return (
    <>
      <DashboardHeader title="Overview" description="The whole platform at a glance." />

      {!stats ? (
        <p className="stock p-(--space-xl) text-ink-2">Platform numbers could not load. Please refresh the page.</p>
      ) : (
        <div className="grid grid-cols-2 gap-(--space-md) lg:grid-cols-3">
          <StatCard label="Registered users" value={stats.totalUsers} href="/dashboard/admin/users" />
          <StatCard label="Vendors" value={stats.totalVendors} href="/dashboard/admin/users?role=vendor" />
          <StatCard label="Customers" value={stats.totalCustomers} href="/dashboard/admin/users?role=customer" />
          <StatCard label="Services" value={stats.totalServices} href="/dashboard/admin/services" />
          <StatCard
            label="Waiting for review"
            value={stats.pendingServices}
            href="/dashboard/admin/services?status=pending"
            highlight={stats.pendingServices > 0}
          />
          <StatCard
            label="Transactions"
            value={stats.totalTransactions}
            hint={stats.paidTransactions ? `${stats.paidTransactions} paid, ${revenue}` : "No paid transactions yet"}
            href="/dashboard/admin/transactions"
          />
        </div>
      )}

      <RecentList
        title="Services waiting for review"
        href="/dashboard/admin/services?status=pending"
        linkLabel="Review services"
        empty="Nothing is waiting for review."
        count={pending?.services.length || 0}
      >
        {pending?.services.map((service) => (
          <li key={service._id} className="flex flex-wrap items-baseline justify-between gap-(--space-xs) py-(--space-sm) text-sm">
            <span className="text-ink">
              <span className="font-semibold">{service.serviceName}</span> by {service.vendor?.businessName || service.vendor?.name}
            </span>
            <span className="text-ink-2">Sent {formatDate(service.createdAt)}</span>
          </li>
        ))}
      </RecentList>
    </>
  );
};

export default AdminOverviewPage;
