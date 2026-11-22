"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { buttonVariants, Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";
import { formatPrice } from "@/lib/format";
import { Service } from "@/lib/types";

const MyServiceList = ({ services }: { services: Service[] }) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [toDelete, setToDelete] = useState<Service | null>(null);

  const handleAvailability = async (service: Service, isActive: boolean) => {
    setBusyId(service._id);
    try {
      const data = await apiFetch(`/services/${service._id}/availability`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      });
      toast.add({ title: data.message, type: "success" });
      router.refresh();
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not change availability", type: "error" });
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async () => {
    if (!toDelete) {
      return;
    }
    setBusyId(toDelete._id);
    try {
      const data = await apiFetch(`/services/${toDelete._id}`, { method: "DELETE", headers: await getAuthHeaders() });
      toast.add({ title: data.message, type: "success" });
      setToDelete(null);
      router.refresh();
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not delete the service", type: "error" });
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <div className="stock overflow-hidden">
        <table className="block w-full text-left text-sm md:table md:table-fixed">
          <thead className="hidden border-b border-rule text-ink-3 md:table-header-group">
            <tr>
              <th scope="col" className="px-(--space-lg) py-(--space-sm) font-medium">Service</th>
              <th scope="col" className="w-28 px-(--space-sm) py-(--space-sm) font-medium">Price</th>
              <th scope="col" className="w-28 px-(--space-sm) py-(--space-sm) font-medium">Approval</th>
              <th scope="col" className="w-24 px-(--space-sm) py-(--space-sm) font-medium">Available</th>
              <th scope="col" className="w-36 py-(--space-sm) pr-(--space-lg) pl-(--space-sm) text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {services.map((service) => (
              <tr key={service._id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-(--space-md) gap-y-(--space-sm) border-b border-rule p-(--space-md) sm:p-(--space-lg) last:border-b-0 md:table-row md:p-0">
                <td className="col-span-2 md:px-(--space-lg) md:py-(--space-md)">
                  <div className="flex items-center gap-(--space-md)">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-(--radius-input) bg-paper-3">
                      <Image src={service.images[0]} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-semibold text-ink md:line-clamp-none md:truncate">{service.serviceName}</p>
                      <p className="text-ink-3 md:truncate">
                        {service.category}, {service.location}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="md:px-(--space-sm) md:py-(--space-md)">
                  <span className="text-ink-3 max-[359px]:hidden md:hidden">Price </span>
                  <span className="font-semibold whitespace-nowrap text-ink">{formatPrice(service.price)}</span>
                </td>
                <td className="md:px-(--space-sm) md:py-(--space-md)">
                  <StatusBadge status={service.status} />
                </td>
                <td className="flex items-center gap-(--space-xs) md:table-cell md:px-(--space-sm) md:py-(--space-md)">
                  <Switch
                    checked={service.isActive}
                    disabled={busyId === service._id}
                    onCheckedChange={(checked) => handleAvailability(service, checked)}
                    aria-label={`${service.serviceName} is available`}
                  />
                  <span className="text-ink-3 md:hidden">{service.isActive ? "Available" : "Unavailable"}</span>
                </td>
                <td className="max-[359px]:col-span-2 md:py-(--space-md) md:pr-(--space-lg) md:pl-(--space-sm)">
                  <div className="flex justify-end gap-(--space-xs) md:flex-nowrap">
                    <Link href={`/services/${service._id}`} className={buttonVariants({ variant: "ghost", size: "icon-sm" })} aria-label={`View ${service.serviceName}`}>
                      <Eye />
                    </Link>
                    <Link
                      href={`/dashboard/vendor/services/${service._id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                      aria-label={`Edit ${service.serviceName}`}
                    >
                      <Pencil />
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setToDelete(service)}
                      aria-label={`Delete ${service.serviceName}`}
                      className="text-error"
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
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete this service?"
        description={`"${toDelete?.serviceName}" will be removed for good. This cannot be undone.`}
        confirmLabel="Delete service"
        destructive
        loading={Boolean(toDelete) && busyId === toDelete?._id}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default MyServiceList;
