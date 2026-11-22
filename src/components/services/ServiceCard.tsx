import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import CategoryChip from "./CategoryChip";
import VendorLine from "./VendorLine";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { getServiceLink } from "@/lib/services";
import { Service } from "@/lib/types";

const ServiceCard = ({ service, priority = false }: { service: Service; priority?: boolean }) => {
  return (
    <article className="stock @container flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-(--radius-card) bg-paper-3">
        <Image
          src={service.images[0]}
          alt={service.serviceName}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-(--space-sm) p-(--space-md) @sm:p-(--space-lg)">
        {/* The price drops under the category when the card is too narrow for both */}
        <div className="flex flex-wrap items-center justify-between gap-x-(--space-sm) gap-y-(--space-2xs)">
          <CategoryChip category={service.category} />
          <p className="text-lg font-semibold whitespace-nowrap text-ink">{formatPrice(service.price)}</p>
        </div>

        <h3 className="text-(length:--text-title) leading-tight font-semibold">{service.serviceName}</h3>

        <p className="flex items-center gap-(--space-2xs) text-sm text-ink-2">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {service.location}
        </p>

        {/* Narrow cards stack the vendor over a full-width button so neither gets squeezed */}
        <div className="mt-auto flex flex-col gap-(--space-sm) border-t border-rule pt-(--space-md) @sm:flex-row @sm:items-center @sm:justify-between">
          <VendorLine vendor={service.vendor} />
          <Link href={getServiceLink(service._id)} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full shrink-0 @sm:w-auto")}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
