import type { Metadata } from "next";
import Link from "next/link";
import { PackagePlus, Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MyServiceList from "@/components/services/MyServiceList";
import { buttonVariants } from "@/components/ui/button";
import { getServerToken } from "@/lib/session";
import { MyServicesResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Services",
};

const getMyServices = async (): Promise<MyServicesResponse | null> => {
  const token = await getServerToken();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/mine`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const MyServicesPage = async () => {
  const data = await getMyServices();

  return (
    <>
      <DashboardHeader
        title="My Services"
        description={
          data
            ? data.activeLimit
              ? `${data.activeCount} of ${data.activeLimit} active services used on the free plan.`
              : `${data.activeCount} active services. Premium has no limit.`
            : undefined
        }
      >
        <Link href="/dashboard/vendor/services/new" className={buttonVariants()}>
          <Plus />
          Add Service
        </Link>
      </DashboardHeader>

      {!data && <p className="stock p-(--space-xl) text-ink-2">Your services could not load. Please refresh the page.</p>}

      {data && data.services.length === 0 && (
        <div className="stock flex flex-col items-start gap-(--space-md) p-(--space-xl)">
          <PackagePlus className="size-8 text-ink-3" aria-hidden="true" />
          <div>
            <h2 className="text-(length:--text-title)">No services yet</h2>
            <p className="mt-(--space-xs) text-ink-2">Add your first service. It goes live once an admin approves it.</p>
          </div>
          <Link href="/dashboard/vendor/services/new" className={buttonVariants()}>
            Add Service
          </Link>
        </div>
      )}

      {data && data.services.length > 0 && <MyServiceList services={data.services} />}
    </>
  );
};

export default MyServicesPage;
