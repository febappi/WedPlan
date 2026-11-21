import type { Metadata } from "next";
import PaymentStatus from "@/components/subscription/PaymentStatus";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = {
  title: "Payment Success",
};

const PaymentSuccessPage = async ({ searchParams }: PageProps<"/payment/success">) => {
  await requireRole("vendor", "/payment/success");
  const sessionId = (await searchParams).session_id;

  return (
    <div className="container flex flex-1 flex-col justify-center py-(--space-4xl)">
      <div className="max-w-2xl">
        <PaymentStatus sessionId={typeof sessionId === "string" ? sessionId : ""} />
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
