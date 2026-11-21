import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart } from "lucide-react";
import CustomerBookingList from "@/components/bookings/CustomerBookingList";
import StatusFilter from "@/components/bookings/StatusFilter";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { buttonVariants } from "@/components/ui/button";
import { getStatusFilter } from "@/lib/bookings";
import { getServerToken } from "@/lib/session";
import { Booking } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Bookings",
};

const getMyBookings = async (status: string): Promise<Booking[] | null> => {
  const token = await getServerToken();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/mine${status ? `?status=${status}` : ""}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const MyBookingsPage = async ({ searchParams }: PageProps<"/dashboard/customer/bookings">) => {
  const status = getStatusFilter((await searchParams).status);
  const bookings = await getMyBookings(status);

  return (
    <>
      <DashboardHeader title="My Bookings" description="Every booking request you have sent, newest first." />
      <StatusFilter basePath="/dashboard/customer/bookings" current={status} />

      {!bookings && <p className="stock p-(--space-xl) text-ink-2">Your bookings could not load. Please refresh the page.</p>}

      {bookings && bookings.length === 0 && (
        <div className="stock flex flex-col items-start gap-(--space-md) p-(--space-xl)">
          <CalendarHeart className="size-8 text-ink-3" aria-hidden="true" />
          <div>
            <h2 className="text-(length:--text-title)">{status ? `No ${status} requests` : "No booking requests yet"}</h2>
            <p className="mt-(--space-xs) text-ink-2">Find a service you like and send the vendor a request.</p>
          </div>
          <Link href="/services" className={buttonVariants()}>
            Browse services
          </Link>
        </div>
      )}

      {bookings && bookings.length > 0 && <CustomerBookingList bookings={bookings} />}
    </>
  );
};

export default MyBookingsPage;
