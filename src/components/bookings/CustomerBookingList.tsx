"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import StatusBadge from "@/components/services/StatusBadge";
import VendorLine from "@/components/services/VendorLine";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";
import { formatDate, formatEventDate, formatPrice } from "@/lib/format";
import { Booking } from "@/lib/types";

const CustomerBookingList = ({ bookings }: { bookings: Booking[] }) => {
  const router = useRouter();
  const [details, setDetails] = useState<Booking | null>(null);
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!toCancel) {
      return;
    }
    setCancelling(true);
    try {
      const data = await apiFetch(`/bookings/${toCancel._id}/cancel`, { method: "PATCH", headers: await getAuthHeaders() });
      toast.add({ title: data.message, type: "success" });
      setToCancel(null);
      router.refresh();
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not cancel the request", type: "error" });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <ul className="space-y-(--space-md)">
        {bookings.map((booking) => (
          <li
            key={booking._id}
            className="stock grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-(--space-md) p-(--space-md) sm:grid-cols-[6rem_minmax(0,1fr)] sm:p-(--space-lg) md:flex md:flex-row md:items-center"
          >
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-(--radius-input) bg-paper-3 md:aspect-[4/3] md:w-36 md:rounded-(--radius-stock)">
              {booking.service?.images?.[0] && (
                <Image src={booking.service.images[0]} alt="" fill sizes="(min-width: 768px) 144px, 96px" className="object-cover" />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-(--space-xs)">
              <div className="flex flex-wrap items-center gap-(--space-xs)">
                <StatusBadge status={booking.status} />
                <span className="text-xs text-ink-3">Requested {formatDate(booking.createdAt)}</span>
              </div>
              <p className="leading-tight font-semibold text-ink sm:text-lg">{booking.service?.serviceName || "Removed service"}</p>
              <div className="flex flex-wrap gap-x-(--space-lg) gap-y-(--space-2xs) text-sm text-ink-2">
                <span className="flex items-center gap-(--space-2xs)">
                  <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                  {formatEventDate(booking.eventDate)}
                </span>
                <span className="flex min-w-0 items-start gap-(--space-2xs)">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {booking.eventLocation}
                </span>
              </div>
              <VendorLine vendor={booking.vendor} />
            </div>

            <div className="col-span-2 flex shrink-0 flex-wrap gap-(--space-xs) md:flex-col md:items-stretch">
              <Button type="button" variant="outline" size="sm" onClick={() => setDetails(booking)}>
                View details
              </Button>
              {booking.status === "pending" && (
                <Button type="button" variant="destructive" size="sm" onClick={() => setToCancel(booking)}>
                  Cancel request
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={Boolean(details)} onOpenChange={(open) => !open && setDetails(null)}>
        <DialogContent className="sm:max-w-lg">
          {details && (
            <>
              <DialogHeader>
                <DialogTitle>{details.service?.serviceName || "Removed service"}</DialogTitle>
                <DialogDescription>Booking request details</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-[auto_1fr] gap-x-(--space-lg) gap-y-(--space-sm) text-sm">
                <dt className="text-ink-3">Status</dt>
                <dd className="m-0">
                  <StatusBadge status={details.status} />
                </dd>
                <dt className="text-ink-3">Vendor</dt>
                <dd className="m-0 text-ink">
                  {details.vendor?.businessName || details.vendor?.name}
                  {details.vendor?.email && <span className="block text-ink-2">{details.vendor.email}</span>}
                </dd>
                <dt className="text-ink-3">Event date</dt>
                <dd className="m-0 text-ink">{formatEventDate(details.eventDate)}</dd>
                <dt className="text-ink-3">Location</dt>
                <dd className="m-0 text-ink">{details.eventLocation}</dd>
                {details.service && (
                  <>
                    <dt className="text-ink-3">Price</dt>
                    <dd className="m-0 text-ink">{formatPrice(details.service.price)}</dd>
                  </>
                )}
                <dt className="text-ink-3">Requested</dt>
                <dd className="m-0 text-ink">{formatDate(details.createdAt)}</dd>
                <dt className="text-ink-3">Your message</dt>
                <dd className="m-0 whitespace-pre-line text-ink">{details.message || "No message"}</dd>
                {details.cancelReason && (
                  <>
                    <dt className="text-ink-3">Note</dt>
                    <dd className="m-0 text-ink">{details.cancelReason}</dd>
                  </>
                )}
              </dl>
              {details.service && (
                <Link href={`/services/${details.service._id}`} className="text-link text-sm">
                  Open the service page
                </Link>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(toCancel)}
        onOpenChange={(open) => !open && setToCancel(null)}
        title="Cancel this booking request?"
        description={`Your request for ${toCancel?.service?.serviceName || "this service"} on ${toCancel ? formatEventDate(toCancel.eventDate) : ""} will be withdrawn. The vendor will see it as cancelled.`}
        confirmLabel="Cancel request"
        destructive
        loading={cancelling}
        onConfirm={handleCancel}
      />
    </>
  );
};

export default CustomerBookingList;
