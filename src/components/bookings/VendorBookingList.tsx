"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, MapPin, X } from "lucide-react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import StatusBadge from "@/components/services/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";
import { formatDate, formatEventDate } from "@/lib/format";
import { Booking } from "@/lib/types";

type Decision = { booking: Booking; status: "accepted" | "rejected" };

const VendorBookingList = ({ bookings }: { bookings: Booking[] }) => {
  const router = useRouter();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [saving, setSaving] = useState(false);

  const handleDecision = async () => {
    if (!decision) {
      return;
    }
    setSaving(true);
    try {
      const data = await apiFetch(`/bookings/${decision.booking._id}/status`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ status: decision.status }),
      });
      toast.add({ title: data.message, type: "success" });
      setDecision(null);
      router.refresh();
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not update the request", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ul className="space-y-(--space-md)">
        {bookings.map((booking) => {
          const customerName = booking.customer?.name || "Customer";
          return (
            <li key={booking._id} className="stock p-(--space-lg)">
              <div className="flex flex-col gap-(--space-md) lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-(--space-md)">
                  <Avatar className="size-11 shrink-0">
                    <AvatarImage src={booking.customer?.image || undefined} alt="" />
                    <AvatarFallback className="bg-ink text-paper">{customerName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-(--space-2xs)">
                    <div className="flex flex-wrap items-center gap-(--space-xs)">
                      <p className="font-semibold text-ink">{customerName}</p>
                      <StatusBadge status={booking.status} />
                    </div>
                    {booking.customer?.email && <p className="truncate text-sm text-ink-2">{booking.customer.email}</p>}
                    <p className="text-sm text-ink">
                      For <span className="font-semibold">{booking.service?.serviceName || "a removed service"}</span>
                    </p>
                  </div>
                </div>

                {booking.status === "pending" && (
                  <div className="flex shrink-0 flex-wrap gap-(--space-xs)">
                    <Button type="button" size="sm" onClick={() => setDecision({ booking, status: "accepted" })}>
                      <Check />
                      Accept
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => setDecision({ booking, status: "rejected" })}>
                      <X />
                      Reject
                    </Button>
                  </div>
                )}
              </div>

              <dl className="mt-(--space-md) grid grid-cols-1 gap-(--space-sm) border-t border-rule pt-(--space-md) text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-ink-3">Event date</dt>
                  <dd className="m-0 mt-(--space-3xs) flex items-center gap-(--space-2xs) text-ink">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {formatEventDate(booking.eventDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-3">Event location</dt>
                  <dd className="m-0 mt-(--space-3xs) flex items-center gap-(--space-2xs) text-ink">
                    <MapPin className="size-4 shrink-0" aria-hidden="true" />
                    {booking.eventLocation}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-3">Requested</dt>
                  <dd className="m-0 mt-(--space-3xs) text-ink">{formatDate(booking.createdAt)}</dd>
                </div>
                <div className="sm:col-span-3">
                  <dt className="text-ink-3">Message</dt>
                  <dd className="m-0 mt-(--space-3xs) whitespace-pre-line text-ink">{booking.message || "No message"}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={Boolean(decision)}
        onOpenChange={(open) => !open && setDecision(null)}
        title={decision?.status === "accepted" ? "Accept this booking?" : "Reject this booking?"}
        description={`${decision?.booking.customer?.name || "The customer"} asked for ${decision?.booking.service?.serviceName || "your service"} on ${
          decision ? formatEventDate(decision.booking.eventDate) : ""
        }. Once you answer, the request cannot be changed again.`}
        confirmLabel={decision?.status === "accepted" ? "Accept booking" : "Reject booking"}
        destructive={decision?.status === "rejected"}
        loading={saving}
        onConfirm={handleDecision}
      />
    </>
  );
};

export default VendorBookingList;
