"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, RotateCcw, Trash2, X } from "lucide-react";
import StatusBadge from "@/components/services/StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";
import { formatDate, formatPrice } from "@/lib/format";
import { Service, ServiceStatus } from "@/lib/types";

type PendingAction = { service: Service; kind: "status"; status: ServiceStatus } | { service: Service; kind: "delete" };

const ServiceReviewTable = ({ services }: { services: Service[] }) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [confirm, setConfirm] = useState<PendingAction | null>(null);

  const setStatus = async (service: Service, status: ServiceStatus) => {
    setBusyId(service._id);
    try {
      const data = await apiFetch(`/services/${service._id}/status`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      toast.add({ title: data.message, type: "success" });
      setConfirm(null);
      router.refresh();
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not update the service", type: "error" });
    } finally {
      setBusyId("");
    }
  };

  const remove = async (service: Service) => {
    setBusyId(service._id);
    try {
      const data = await apiFetch(`/services/${service._id}`, { method: "DELETE", headers: await getAuthHeaders() });
      toast.add({ title: data.message, type: "success" });
      setConfirm(null);
      router.refresh();
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not delete the service", type: "error" });
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <div className="stock overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-rule text-ink-3">
            <tr>
              <th scope="col" className="px-(--space-lg) py-(--space-sm) font-medium">Service</th>
              <th scope="col" className="px-(--space-sm) py-(--space-sm) font-medium">Vendor</th>
              <th scope="col" className="px-(--space-sm) py-(--space-sm) font-medium">Price</th>
              <th scope="col" className="px-(--space-sm) py-(--space-sm) font-medium">Status</th>
              <th scope="col" className="px-(--space-lg) py-(--space-sm) text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id} className="border-b border-rule last:border-b-0">
                <td className="px-(--space-lg) py-(--space-sm)">
                  <div className="flex items-center gap-(--space-sm)">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-(--radius-input) bg-paper-3">
                      <Image src={service.images[0]} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{service.serviceName}</p>
                      <p className="truncate text-ink-3">
                        {service.category}, {service.location}, sent {formatDate(service.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-(--space-sm) py-(--space-sm) text-ink">{service.vendor?.businessName || service.vendor?.name}</td>
                <td className="px-(--space-sm) py-(--space-sm) font-semibold whitespace-nowrap text-ink">{formatPrice(service.price)}</td>
                <td className="px-(--space-sm) py-(--space-sm)">
                  <div className="flex flex-col items-start gap-(--space-3xs)">
                    <StatusBadge status={service.status} />
                    {!service.isActive && <span className="text-xs text-ink-3">Hidden by vendor</span>}
                  </div>
                </td>
                <td className="px-(--space-lg) py-(--space-sm)">
                  <div className="flex justify-end gap-(--space-xs)">
                    <Link href={`/services/${service._id}`} className={buttonVariants({ variant: "ghost", size: "icon-sm" })} aria-label={`View ${service.serviceName}`}>
                      <Eye />
                    </Link>
                    {service.status !== "approved" && (
                      <Button type="button" size="sm" disabled={busyId === service._id} onClick={() => setStatus(service, "approved")}>
                        <Check />
                        Approve
                      </Button>
                    )}
                    {service.status !== "rejected" && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={busyId === service._id}
                        onClick={() => setConfirm({ service, kind: "status", status: "rejected" })}
                      >
                        <X />
                        Reject
                      </Button>
                    )}
                    {service.status !== "pending" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={busyId === service._id}
                        onClick={() => setStatus(service, "pending")}
                        aria-label={`Move ${service.serviceName} back to pending`}
                      >
                        <RotateCcw />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-error"
                      onClick={() => setConfirm({ service, kind: "delete" })}
                      aria-label={`Delete ${service.serviceName}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={confirm?.kind === "delete" ? "Delete this service?" : "Reject this service?"}
        description={
          confirm?.kind === "delete"
            ? `"${confirm.service.serviceName}" will be removed for good and its open booking requests cancelled. This cannot be undone.`
            : `"${confirm?.service.serviceName}" will be hidden from customers. The vendor can edit it and send it again.`
        }
        confirmLabel={confirm?.kind === "delete" ? "Delete service" : "Reject service"}
        destructive
        loading={Boolean(confirm) && busyId === confirm?.service._id}
        onConfirm={() => {
          if (!confirm) {
            return;
          }
          if (confirm.kind === "delete") {
            remove(confirm.service);
          } else {
            setStatus(confirm.service, confirm.status);
          }
        }}
      />
    </>
  );
};

export default ServiceReviewTable;
