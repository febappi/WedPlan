import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// Shown for a wrong link, a removed service or one that is not approved
const ServiceNotice = ({ title, text }: { title: string; text: string }) => {
  return (
    <div className="container flex flex-1 flex-col justify-center py-(--space-4xl)">
      <SearchX className="size-10 text-ink-3" aria-hidden="true" />
      <h1 className="mt-(--space-lg) text-(length:--text-display-s)">{title}</h1>
      <p className="lead mt-(--space-md) text-ink-2">{text}</p>
      <div className="mt-(--space-xl)">
        <Link href="/services" className={buttonVariants({ size: "lg" })}>
          Browse services
        </Link>
      </div>
    </div>
  );
};

export default ServiceNotice;
