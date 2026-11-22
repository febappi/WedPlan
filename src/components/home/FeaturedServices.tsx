import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import { buttonVariants } from "@/components/ui/button";
import { ServicesResponse } from "@/lib/types";

// The home page shows this many of the newest services; the rest are one click away
const FEATURED_COUNT = 6;

const getFeaturedServices = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?limit=${FEATURED_COUNT}`, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    const data: ServicesResponse = await res.json();
    return { services: data.services, total: data.total };
  } catch {
    return null;
  }
};

// The six newest approved and available services, with a link to the full list when there are more
const FeaturedServices = async () => {
  const data = await getFeaturedServices();
  const services = data?.services;
  const total = data?.total ?? 0;

  return (
    <section aria-labelledby="featured-title" className="pt-(--section-gap-s)">
      <div className="container">
        <SectionHeading id="featured-title" title="Featured wedding services" description="The newest approved listings from WedPlan vendors." />

        {!services && (
          <p className="stock mt-(--space-2xl) p-(--space-xl) text-ink-2">Featured services could not load right now. Please refresh the page.</p>
        )}

        {services && services.length === 0 && (
          <p className="stock mt-(--space-2xl) p-(--space-xl) text-ink-2">
            No services are live yet. Vendors can list theirs from the vendor dashboard.
          </p>
        )}

        {services && services.length > 0 && (
          <>
            <Reveal className="mt-(--space-2xl)">
              <div className="grid grid-cols-1 gap-(--gap-columns) sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            </Reveal>

            <div className="mt-(--space-xl) flex flex-col items-center gap-(--space-sm) text-center">
              {total > services.length ? (
                <>
                  <p className="text-sm text-ink-3">
                    Showing {services.length} of {total} services
                  </p>
                  <Link href="/services" className={buttonVariants({ size: "lg" })}>
                    View all {total} services
                    <ArrowRight />
                  </Link>
                </>
              ) : (
                <Link href="/services" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Search and filter services
                  <ArrowRight />
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;
