import type { Metadata } from "next";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentList from "@/components/dashboard/RecentList";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/services/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { formatEventDate } from "@/lib/format";
import { serverFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { Booking, CustomerStats } from "@/lib/types";

export const metadata: Metadata = {
  title: "Customer Dashboard",
};

const CustomerOverviewPage = async () => {
  const [user, stats, bookings] = await Promise.all([
    getSessionUser(),
    serverFetch<CustomerStats>("/stats/customer"),
    serverFetch<Booking[]>("/bookings/mine"),
  ]);

  return (
    <>
      <DashboardHeader title="Overview" description={`Hello, ${user?.name}. Here is where your booking requests stand.`}>
        <Link href="/services" className={buttonVariants()}>
          Browse services
        </Link>
      </DashboardHeader>

      {!stats ? (
        <p className="stock p-(--space-xl) text-ink-2">Your numbers could not load. Please refresh the page.</p>
      ) : (
        <div className="grid grid-cols-2 gap-(--space-md) lg:grid-cols-4">
          <StatCard
            label="Total requests"
            value={stats.totalBookings}
            hint={`${stats.cancelledBookings} cancelled`}
            href="/dashboard/customer/bookings"
          />
          <StatCard
            label="Pending"
            value={stats.pendingBookings}
            href="/dashboard/customer/bookings?status=pending"
            highlight={stats.pendingBookings > 0}
          />
          <StatCard label="Accepted" value={stats.acceptedBookings} href="/dashboard/customer/bookings?status=accepted" />
          <StatCard label="Rejected" value={stats.rejectedBookings} href="/dashboard/customer/bookings?status=rejected" />
        </div>
      )}

      <RecentList
        title="Latest requests"
        href="/dashboard/customer/bookings"
        linkLabel="All my bookings"
        empty="You have not sent any booking requests yet."
        count={bookings?.length || 0}
      >
        {bookings?.slice(0, 4).map((booking) => (
          <li key={booking._id} className="flex flex-wrap items-center justify-between gap-(--space-xs) py-(--space-sm) text-sm">
            <span className="text-ink">
              <span className="font-semibold">{booking.service?.serviceName || "Removed service"}</span>, {formatEventDate(booking.eventDate)}
            </span>
            <StatusBadge status={booking.status} />
          </li>
        ))}
      </RecentList>
    </>
  );
};

export default CustomerOverviewPage;
