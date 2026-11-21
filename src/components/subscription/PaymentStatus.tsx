"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Clock, TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-client";
import { formatDate, formatMoney } from "@/lib/format";

type SessionStatus = {
  status: "pending" | "paid" | "failed" | "cancelled";
  amount: number;
  currency: string;
  subscriptionExpiresAt: string | null;
  isPremium: boolean;
};

type ViewState = "checking" | "paid" | "waiting" | "failed" | "missing";

const MAX_TRIES = 15;

// The redirect alone proves nothing: this waits for the server, which only marks a payment paid after Stripe's signed webhook
const PaymentStatus = ({ sessionId }: { sessionId: string }) => {
  const router = useRouter();
  const [view, setView] = useState<ViewState>(sessionId ? "checking" : "missing");
  const [details, setDetails] = useState<SessionStatus | null>(null);
  const tries = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    const check = async () => {
      tries.current += 1;
      try {
        const data: SessionStatus = await apiFetch(`/payments/session/${encodeURIComponent(sessionId)}`, { headers: await getAuthHeaders() });
        if (stopped) {
          return;
        }
        setDetails(data);
        if (data.status === "paid") {
          setView("paid");
          router.refresh();
          return;
        }
        if (data.status === "failed" || data.status === "cancelled") {
          setView("failed");
          return;
        }
      } catch {
        if (stopped) {
          return;
        }
        if (tries.current >= 3) {
          setView("missing");
          return;
        }
      }
      if (tries.current >= MAX_TRIES) {
        setView("waiting");
        return;
      }
      timer = setTimeout(check, 2000);
    };

    check();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [sessionId, router]);

  if (view === "checking") {
    return (
      <div role="status" className="flex flex-col items-start gap-(--space-md)">
        <Spinner className="size-8 text-ink" />
        <h1 className="text-(length:--text-display-s)">Confirming your payment</h1>
        <p className="lead text-ink-2">Waiting for Stripe to confirm it to WedPlan. This usually takes a few seconds.</p>
      </div>
    );
  }

  if (view === "paid" && details) {
    return (
      <div className="flex flex-col items-start gap-(--space-md)">
        <BadgeCheck className="size-10 text-mint-deep" aria-hidden="true" />
        <h1 className="text-(length:--text-display-s)">You are on Premium</h1>
        <p className="lead text-ink-2">
          Payment of {formatMoney(details.amount, details.currency)} received.
          {details.subscriptionExpiresAt && ` Premium renews on ${formatDate(details.subscriptionExpiresAt)}.`} You can now keep unlimited
          services active.
        </p>
        <div className="flex flex-wrap gap-(--space-sm)">
          <Link href="/dashboard/vendor/services/new" className={buttonVariants({ size: "lg" })}>
            Add a service
          </Link>
          <Link href="/dashboard/vendor/subscription" className={buttonVariants({ variant: "outline", size: "lg" })}>
            See subscription
          </Link>
        </div>
      </div>
    );
  }

  if (view === "waiting") {
    return (
      <div className="flex flex-col items-start gap-(--space-md)">
        <Clock className="size-10 text-ink-3" aria-hidden="true" />
        <h1 className="text-(length:--text-display-s)">Payment received, confirmation on its way</h1>
        <p className="lead text-ink-2">Stripe has not confirmed it to WedPlan yet. Premium turns on as soon as it does. Check your subscription in a minute.</p>
        <Link href="/dashboard/vendor/subscription" className={buttonVariants({ size: "lg" })}>
          See subscription
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-(--space-md)">
      <TriangleAlert className="size-10 text-coral" aria-hidden="true" />
      <h1 className="text-(length:--text-display-s)">{view === "failed" ? "The payment did not go through" : "We could not find this payment"}</h1>
      <p className="lead text-ink-2">
        {view === "failed"
          ? "Stripe reported this checkout as not completed, so Premium was not turned on. You can try again."
          : "This link has no payment we can match to your account. Your Subscription page shows your current plan."}
      </p>
      <Link href="/dashboard/vendor/subscription" className={buttonVariants({ size: "lg" })}>
        Back to subscription
      </Link>
    </div>
  );
};

export default PaymentStatus;
