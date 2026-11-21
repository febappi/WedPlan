import type { Metadata } from "next";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ServiceForm from "@/components/services/ServiceForm";
import { buttonVariants } from "@/components/ui/button";
import { getServerToken, getSessionUser } from "@/lib/session";
import { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Edit Service",
};

const EditServicePage = async ({ params }: PageProps<"/dashboard/vendor/services/[id]/edit">) => {
  const { id } = await params;
  const [user, token] = await Promise.all([getSessionUser(), getServerToken()]);

  let service: Service | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    service = res.ok ? await res.json() : null;
  } catch {
    service = null;
  }

  // Vendors can only edit their own services; the server checks this again on save
  if (!service || String(service.vendorId) !== user?.id) {
    return (
      <>
        <DashboardHeader title="Service not found" description="This service does not exist or belongs to another vendor." />
        <Link href="/dashboard/vendor/services" className={buttonVariants({ variant: "outline" })}>
          Back to My Services
        </Link>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Edit Service" description={service.serviceName} />
      <ServiceForm service={service} />
    </>
  );
};

export default EditServicePage;
