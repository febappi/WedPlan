"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";
import { AdminUser } from "@/lib/types";
import { cn } from "@/lib/utils";

// "pending" is a Google account that has not picked customer or vendor yet
const roleLabels = { admin: "Admin", vendor: "Vendor", customer: "Customer", pending: "Role not chosen" };

const UserTable = ({ users }: { users: AdminUser[] }) => {
  const router = useRouter();
  const [details, setDetails] = useState<AdminUser | null>(null);
  const [loadingId, setLoadingId] = useState("");
  const [toToggle, setToToggle] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const openDetails = async (user: AdminUser) => {
    setLoadingId(user._id);
    try {
      const data: AdminUser = await apiFetch(`/users/${user._id}`, { headers: await getAuthHeaders() });
      setDetails(data);
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not load the user", type: "error" });
    } finally {
      setLoadingId("");
    }
  };

  const handleToggle = async () => {
    if (!toToggle) {
      return;
    }
    setSaving(true);
    try {
      const data = await apiFetch(`/users/${toToggle._id}/block`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ isBlocked: !toToggle.isBlocked }),
      });
      toast.add({ title: data.message, type: "success" });
      setToToggle(null);
      router.refresh();
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not change the user", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="stock overflow-hidden xl:overflow-x-auto">
        <table className="block w-full text-left text-sm xl:table xl:min-w-[680px]">
          <thead className="hidden border-b border-rule text-ink-3 xl:table-header-group">
            <tr>
              <th scope="col" className="px-(--space-lg) py-(--space-sm) font-medium">User</th>
              <th scope="col" className="px-(--space-sm) py-(--space-sm) font-medium">Role</th>
              <th scope="col" className="px-(--space-sm) py-(--space-sm) font-medium">Status</th>
              <th scope="col" className="px-(--space-sm) py-(--space-sm) font-medium">Joined</th>
              <th scope="col" className="px-(--space-lg) py-(--space-sm) text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="block xl:table-row-group">
            {users.map((user) => (
              <tr
                key={user._id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-(--space-md) gap-y-(--space-xs) border-b border-rule p-(--space-md) last:border-b-0 xl:table-row xl:p-0"
              >
                <td className="col-span-2 xl:px-(--space-lg) xl:py-(--space-sm)">
                  <div className="flex items-center gap-(--space-sm)">
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage src={user.image || undefined} alt="" />
                      <AvatarFallback className="bg-ink text-xs text-paper">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 xl:max-w-[16rem]">
                      <p className="truncate font-semibold text-ink">{user.name}</p>
                      <p className="truncate text-ink-3" title={user.email}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-ink xl:px-(--space-sm) xl:py-(--space-sm)">
                  <span className="text-ink-3 xl:hidden">Role: </span>
                  {roleLabels[user.role]}
                  {user.role === "vendor" && user.isPremium && <span className="text-blue">, Premium</span>}
                </td>
                <td className="justify-self-end xl:px-(--space-sm) xl:py-(--space-sm)">
                  <span
                    className={cn(
                      "inline-flex rounded-(--radius-pill) px-(--space-sm) py-(--space-3xs) text-xs font-semibold",
                      user.isBlocked ? "bg-coral text-ink" : "bg-mint text-ink"
                    )}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="whitespace-nowrap text-ink-2 xl:px-(--space-sm) xl:py-(--space-sm)">
                  <span className="text-ink-3 xl:hidden">Joined </span>
                  {user.createdAt ? formatDate(user.createdAt) : ""}
                </td>
                <td className="xl:px-(--space-lg) xl:py-(--space-sm)">
                  <div className="flex justify-end gap-(--space-xs)">
                    <Button type="button" variant="outline" size="sm" onClick={() => openDetails(user)} disabled={loadingId === user._id}>
                      {loadingId === user._id && <Spinner />}
                      Details
                    </Button>
                    {user.role !== "admin" && (
                      <Button type="button" variant={user.isBlocked ? "outline" : "destructive"} size="sm" onClick={() => setToToggle(user)}>
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(details)} onOpenChange={(open) => !open && setDetails(null)}>
        <DialogContent className="sm:max-w-md">
          {details && (
            <>
              <DialogHeader>
                <DialogTitle>{details.name}</DialogTitle>
                <DialogDescription>{details.email}</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-[auto_1fr] gap-x-(--space-lg) gap-y-(--space-sm) text-sm">
                <dt className="text-ink-3">Role</dt>
                <dd className="m-0 text-ink">{roleLabels[details.role]}</dd>
                <dt className="text-ink-3">Status</dt>
                <dd className="m-0 text-ink">{details.isBlocked ? "Blocked" : "Active"}</dd>
                <dt className="text-ink-3">Phone</dt>
                <dd className="m-0 text-ink">{details.phone || "Not given"}</dd>
                {details.role === "vendor" && (
                  <>
                    <dt className="text-ink-3">Business</dt>
                    <dd className="m-0 text-ink">{details.businessName || "Not set"}</dd>
                    <dt className="text-ink-3">Plan</dt>
                    <dd className="m-0 text-ink">
                      {details.isPremium ? `Premium until ${details.subscriptionExpiresAt ? formatDate(details.subscriptionExpiresAt) : "renewal"}` : "Free"}
                    </dd>
                    <dt className="text-ink-3">Services</dt>
                    <dd className="m-0 text-ink">{details.counts?.services ?? 0}</dd>
                    <dt className="text-ink-3">Requests received</dt>
                    <dd className="m-0 text-ink">{details.counts?.bookingsAsVendor ?? 0}</dd>
                  </>
                )}
                {details.role === "customer" && (
                  <>
                    <dt className="text-ink-3">Requests sent</dt>
                    <dd className="m-0 text-ink">{details.counts?.bookingsAsCustomer ?? 0}</dd>
                  </>
                )}
                <dt className="text-ink-3">Joined</dt>
                <dd className="m-0 text-ink">{details.createdAt ? formatDate(details.createdAt) : ""}</dd>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(toToggle)}
        onOpenChange={(open) => !open && setToToggle(null)}
        title={toToggle?.isBlocked ? `Unblock ${toToggle?.name}?` : `Block ${toToggle?.name}?`}
        description={
          toToggle?.isBlocked
            ? "They will be able to sign in and use their dashboard again."
            : "They will be signed out at once and cannot sign in, book or manage services until you unblock them."
        }
        confirmLabel={toToggle?.isBlocked ? "Unblock user" : "Block user"}
        destructive={!toToggle?.isBlocked}
        loading={saving}
        onConfirm={handleToggle}
      />
    </>
  );
};

export default UserTable;
