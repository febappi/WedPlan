import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const HomeBanner = () => {
  return (
    <section className="air border-b border-rule">
      <div className="container grid min-h-[calc(100dvh-var(--nav-height)-var(--space-lg))] grid-cols-1 items-center gap-(--space-xl) py-(--space-2xl) lg:grid-cols-[minmax(0,6fr)_minmax(0,7fr)] lg:gap-(--space-3xl)">
        <div className="settle flex flex-col items-start">
          <h1 className="max-w-[14ch]">Your wedding vendors, side by side</h1>
          <p className="lead mt-(--space-lg) text-ink-2">
            Compare services by price and city, then send a booking request.
          </p>
          <div className="mt-(--space-xl) flex flex-wrap items-center gap-x-(--space-lg) gap-y-(--space-md)">
            <Link href="/services" className={buttonVariants({ size: "lg" })}>
              Explore Wedding Services
            </Link>
            <Link href="/signup?role=vendor" className="text-link">
              List your services
            </Link>
          </div>
        </div>

        <figure className="settle settle-late stock m-0 p-(--space-md) sm:p-(--space-lg)">
          <div
            data-slot="hero"
            data-alt="a wedding photograph from a real vendor: a couple, a decorated stage or bridal flowers"
            className="h-[min(62dvh,600px)] min-h-80 outline-1 -outline-offset-1 outline-ink/10"
          >
            <Image
              src="/images/florist-working-on-a-bouquet-of-flowers-1920.jpg"
              alt="A florist holding a wrapped bouquet of lilies and orchids"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-[40%_50%]"
            />
          </div>
          <figcaption className="mt-(--space-md) flex flex-wrap items-baseline justify-between gap-x-(--space-md) gap-y-(--space-2xs) text-sm">
            <span className="text-ink">Decoration &amp; Florist</span>
            <span className="text-ink-3">Bouquets, stage flowers and table pieces</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default HomeBanner;
