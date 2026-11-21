import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import BookingPanel from "@/components/bookings/BookingPanel";
import CategoryChip from "@/components/services/CategoryChip";
import ServiceGallery from "@/components/services/ServiceGallery";
import ServiceNotice from "@/components/services/ServiceNotice";
import VendorLine from "@/components/services/VendorLine";
import { formatDate, formatPrice } from "@/lib/format";
import { getServerToken, requireUser } from "@/lib/session";
import { Service } from "@/lib/types";

type ServiceResult = { service: Service | null; status: number };

const getService = async (id: string): Promise<ServiceResult> => {
  const token = await getServerToken();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    return { service: res.ok ? await res.json() : null, status: res.status };
  } catch {
    return { service: null, status: 500 };
  }
};

export const generateMetadata = async ({ params }: PageProps<"/services/[id]">): Promise<Metadata> => {
  const { id } = await params;
  const { service } = await getService(id);
  return { title: service ? service.serviceName : "Service" };
};

const statusNotes = {
  pending: "This service is waiting for admin approval. Customers cannot see it yet.",
  rejected: "An admin rejected this service. Customers cannot see it. Edit it to send it for review again.",
  approved: "",
};

const ServiceDetailsPage = async ({ params }: PageProps<"/services/[id]">) => {
  const { id } = await params;
  const user = await requireUser(`/services/${id}`);
  const { service, status } = await getService(id);

  if (status === 400) {
    return <ServiceNotice title="This link is not right" text="The service link is broken or incomplete. Find the service again from the list." />;
  }
  if (!service) {
    return status === 404 ? (
      <ServiceNotice title="This service is not available" text="It may have been removed, or the vendor is not taking bookings for it right now." />
    ) : (
      <ServiceNotice title="This service did not load" text="The server did not answer. Please try again in a moment." />
    );
  }

  const isOwner = user.id === String(service.vendorId);
  const ownerNote = isOwner ? (!service.isActive ? "You have marked this service as unavailable, so customers cannot see it." : statusNotes[service.status]) : "";

  return (
    <div className="container py-(--space-2xl)">
      <Link href="/services" className="text-link inline-flex items-center gap-(--space-2xs) text-sm">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to services
      </Link>

      {ownerNote && <p className="stock mt-(--space-lg) px-(--space-lg) py-(--space-md) text-sm text-ink">{ownerNote}</p>}

      <div className="mt-(--space-lg) grid grid-cols-1 gap-(--space-2xl) lg:grid-cols-12 lg:gap-(--gap-columns)">
        <div className="lg:col-span-7">
          <ServiceGallery images={service.images} name={service.serviceName} />
          <section aria-labelledby="about-title" className="mt-(--space-2xl)">
            <h2 id="about-title" className="text-(length:--text-title)">About this service</h2>
            <p className="mt-(--space-md) whitespace-pre-line text-ink-2">{service.description}</p>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+var(--space-lg))]">
            <CategoryChip category={service.category} />
            <h1 className="mt-(--space-md) text-(length:--text-display-s)">{service.serviceName}</h1>
            <p className="mt-(--space-md) text-(length:--text-3xl) font-semibold text-ink">{formatPrice(service.price)}</p>

            <dl className="mt-(--space-lg) space-y-(--space-sm) text-ink-2">
              <div className="flex items-center gap-(--space-xs)">
                <dt className="sr-only">Location</dt>
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                <dd className="m-0">{service.location}</dd>
              </div>
              <div className="flex items-center gap-(--space-xs)">
                <dt className="sr-only">Listed</dt>
                <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                <dd className="m-0">Listed {formatDate(service.createdAt)}</dd>
              </div>
            </dl>

            <div className="stock mt-(--space-xl) p-(--space-lg)">
              <p className="text-sm text-ink-3">Offered by</p>
              <VendorLine vendor={service.vendor} className="mt-(--space-xs)" />
            </div>

            <BookingPanel service={service} user={user} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
