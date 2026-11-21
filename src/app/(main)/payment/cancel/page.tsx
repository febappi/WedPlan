import type { Metadata } from "next";
import Link from "next/link";
import { CircleSlash } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Payment Cancelled",
};

const PaymentCancelPage = async () => {
  await requireRole("vendor", "/payment/cancel");

  return (
    <div className="container flex flex-1 flex-col justify-center py-(--space-4xl)">
      <div className="flex max-w-2xl flex-col items-start gap-(--space-md)">
        <CircleSlash className="size-10 text-ink-3" aria-hidden="true" />
        <h1 className="text-(length:--text-display-s)">Checkout cancelled</h1>
        <p className="lead text-ink-2">You left Stripe Checkout before paying, so nothing was charged and your plan has not changed.</p>
        <div className="flex flex-wrap gap-(--space-sm)">
          <Link href="/dashboard/vendor/subscription" className={buttonVariants({ size: "lg" })}>
            Back to subscription
          </Link>
          <Link href="/dashboard/vendor" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
