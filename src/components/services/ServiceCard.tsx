import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import CategoryChip from "./CategoryChip";
import VendorLine from "./VendorLine";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getServiceLink } from "@/lib/services";
import { Service } from "@/lib/types";

const ServiceCard = ({ service, priority = false }: { service: Service; priority?: boolean }) => {
  return (
    <article className="stock flex h-full flex-col overflow-hidden">
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

      <div className="flex flex-1 flex-col gap-(--space-sm) p-(--space-lg)">
        <div className="flex items-start justify-between gap-(--space-sm)">
          <CategoryChip category={service.category} />
          <p className="text-lg font-semibold whitespace-nowrap text-ink">{formatPrice(service.price)}</p>
        </div>

        <h3 className="text-(length:--text-title) leading-tight font-semibold">{service.serviceName}</h3>

        <p className="flex items-center gap-(--space-2xs) text-sm text-ink-2">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {service.location}
        </p>

        <div className="mt-auto flex items-center justify-between gap-(--space-sm) border-t border-rule pt-(--space-md)">
          <VendorLine vendor={service.vendor} />
          <Link href={getServiceLink(service._id)} className={buttonVariants({ variant: "outline", size: "sm" })}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
