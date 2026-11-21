"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";

// Sends the vendor to Stripe Checkout; the server creates the session for the signed-in vendor only
export const UpgradeButton = () => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/payments/checkout-session", { method: "POST", headers: await getAuthHeaders() });
      window.location.assign(data.url);
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not start the payment", type: "error" });
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleUpgrade} disabled={loading}>
      {loading ? <Spinner /> : <Sparkles />}
      {loading ? "Opening Stripe Checkout" : "Upgrade to Premium"}
    </Button>
  );
};

export const CancelSubscriptionButton = ({ endsOn }: { endsOn: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/payments/cancel-subscription", { method: "POST", headers: await getAuthHeaders() });
      toast.add({ title: data.message, type: "success" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.add({ title: error instanceof Error ? error.message : "Could not cancel the subscription", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(true)}>
        Cancel subscription
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel Premium?"
        description={`Premium stays on until ${endsOn}. After that you move to the free plan, and only your three newest active services stay available.`}
        confirmLabel="Cancel Premium"
        destructive
        loading={loading}
        onConfirm={handleCancel}
      />
    </>
  );
};
