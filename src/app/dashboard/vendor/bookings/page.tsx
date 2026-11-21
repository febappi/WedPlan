import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import StatusFilter from "@/components/bookings/StatusFilter";
import VendorBookingList from "@/components/bookings/VendorBookingList";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getStatusFilter } from "@/lib/bookings";
import { getServerToken } from "@/lib/session";
import { Booking } from "@/lib/types";

export const metadata: Metadata = {
  title: "Booking Requests",
};

const getVendorBookings = async (status: string): Promise<Booking[] | null> => {
  const token = await getServerToken();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/vendor${status ? `?status=${status}` : ""}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const BookingRequestsPage = async ({ searchParams }: PageProps<"/dashboard/vendor/bookings">) => {
  const status = getStatusFilter((await searchParams).status);
  const bookings = await getVendorBookings(status);

  return (
    <>
      <DashboardHeader title="Booking Requests" description="Requests from couples for your services. Pending ones wait for your answer." />
      <StatusFilter basePath="/dashboard/vendor/bookings" current={status} />

      {!bookings && <p className="stock p-(--space-xl) text-ink-2">Booking requests could not load. Please refresh the page.</p>}

      {bookings && bookings.length === 0 && (
        <div className="stock flex flex-col items-start gap-(--space-md) p-(--space-xl)">
          <Inbox className="size-8 text-ink-3" aria-hidden="true" />
          <div>
            <h2 className="text-(length:--text-title)">{status ? `No ${status} requests` : "No booking requests yet"}</h2>
            <p className="mt-(--space-xs) text-ink-2">Requests appear here when couples book one of your approved services.</p>
          </div>
        </div>
      )}

      {bookings && bookings.length > 0 && <VendorBookingList bookings={bookings} />}
    </>
  );
};

export default BookingRequestsPage;
