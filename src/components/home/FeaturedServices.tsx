import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import { buttonVariants } from "@/components/ui/button";
import { ServicesResponse } from "@/lib/types";

const getFeaturedServices = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services?limit=6`, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    const data: ServicesResponse = await res.json();
    return data.services;
  } catch {
    return null;
  }
};

// The six newest approved and available services
const FeaturedServices = async () => {
  const services = await getFeaturedServices();

  return (
    <section aria-labelledby="featured-title" className="pt-(--section-gap-s)">
      <div className="container">
        <SectionHeading id="featured-title" title="Featured wedding services" description="The newest approved listings from WedPlan vendors.">
          <Link href="/services" className={buttonVariants({ variant: "outline" })}>
            Browse all services
          </Link>
        </SectionHeading>

        {!services && (
          <p className="stock mt-(--space-2xl) p-(--space-xl) text-ink-2">Featured services could not load right now. Please refresh the page.</p>
        )}

        {services && services.length === 0 && (
          <p className="stock mt-(--space-2xl) p-(--space-xl) text-ink-2">
            No services are live yet. Vendors can list theirs from the vendor dashboard.
          </p>
        )}

        {services && services.length > 0 && (
          <Reveal className="mt-(--space-2xl)">
            <div className="grid grid-cols-1 gap-(--gap-columns) sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;
