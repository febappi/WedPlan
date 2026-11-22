import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentList from "@/components/dashboard/RecentList";
import StatCard, { StatGrid } from "@/components/dashboard/StatCard";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatEventDate } from "@/lib/format";
import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { Booking, VendorStats } from "@/lib/types";

export const metadata: Metadata = {
  title: "Vendor Dashboard",
};

const VendorOverviewPage = async () => {
  const [user, stats, pending] = await Promise.all([
    getSessionUser(),
    serverFetch<VendorStats>("/stats/vendor"),
    serverFetch<Booking[]>("/bookings/vendor?status=pending"),
  ]);

  return (
    <>
      <DashboardHeader title="Overview" description={`Hello, ${user?.businessName || user?.name}. Here is how your services are doing.`}>
        <Link href="/dashboard/vendor/services/new" className={buttonVariants()}>
          <Plus />
          Add Service
        </Link>
      </DashboardHeader>

      {!stats ? (
        <p className="stock p-(--space-xl) text-ink-2">Your numbers could not load. Please refresh the page.</p>
      ) : (
        <StatGrid>
          <StatCard label="Total services" value={stats.totalServices} href="/dashboard/vendor/services" />
          <StatCard label="Active services" value={stats.activeServices} hint="Approved and available" href="/dashboard/vendor/services" />
          <StatCard
            label="Pending requests"
            value={stats.pendingBookings}
            href="/dashboard/vendor/bookings?status=pending"
            highlight={stats.pendingBookings > 0}
          />
          <StatCard label="Accepted bookings" value={stats.acceptedBookings} href="/dashboard/vendor/bookings?status=accepted" />
          <StatCard
            label="Current plan"
            value={stats.plan === "premium" ? "Premium" : "Free"}
            hint={stats.subscriptionExpiresAt ? `Until ${formatDate(stats.subscriptionExpiresAt)}` : "Up to 3 active services"}
            href="/dashboard/vendor/subscription"
          />
        </StatGrid>
      )}

      <RecentList
        title="Waiting for your answer"
        href="/dashboard/vendor/bookings?status=pending"
        linkLabel="All booking requests"
        empty="No pending requests right now."
        count={pending?.length || 0}
      >
        {pending?.slice(0, 4).map((booking) => (
          <li key={booking._id} className="flex flex-wrap items-baseline justify-between gap-(--space-xs) py-(--space-sm) text-sm">
            <span className="text-ink">
              <span className="font-semibold">{booking.customer?.name}</span> for {booking.service?.serviceName}
            </span>
            <span className="text-ink-2">{formatEventDate(booking.eventDate)}</span>
          </li>
        ))}
      </RecentList>
    </>
  );
};

export default VendorOverviewPage;
