import Link from "next/link";
import HeroSlider from "./HeroSlider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Under 360px the two calls to action stack at full width with a little less padding
const tinyFull = "max-[359px]:w-full max-[359px]:px-4 max-[359px]:text-sm";

const HomeBanner = () => {
  return (
    <section className="relative overflow-x-clip">
      <div className="container grid grid-cols-1 lg:min-h-[calc(100dvh-var(--nav-height)-var(--space-2xl))] items-center gap-(--space-xl) py-(--space-2xl) lg:grid-cols-[minmax(0,6fr)_minmax(0,7fr)] lg:gap-(--space-3xl)">
        <div className="settle flex flex-col items-start">
          <h1 className="max-w-[15ch] lg:text-[length:clamp(2.75rem,3.4vw+0.75rem,4.25rem)]">Your wedding vendors, side by side</h1>
          <p className="lead mt-(--space-lg) text-ink-2">
            Compare services by price and city, then send a <mark>booking request</mark>.
          </p>
          <div className="mt-(--space-xl) flex flex-wrap items-center gap-x-(--space-lg) gap-y-(--space-md)">
            <Link href="/services" className={cn(buttonVariants({ size: "lg" }), tinyFull)}>
              Explore Wedding Services
            </Link>
            <Link href="/signup?role=vendor" className={cn(buttonVariants({ variant: "outline", size: "lg" }), tinyFull)}>
              List your services
            </Link>
          </div>
        </div>

        <div className="settle settle-late relative">
          {/* a blue sugar-paper mat behind the print, cut a little crooked */}
          <div aria-hidden="true" className="absolute inset-x-6 -inset-y-3 -rotate-2 rounded-(--radius-card) bg-sugar bg-[image:var(--grain),var(--fibre)]" />
          <div className="sheet relative">
            <div className="torn-b rounded-t-(--radius-card)">
              <div className="torn-face rounded-t-(--radius-card) bg-stock bg-[image:var(--grain),var(--fibre)] p-(--space-md) pb-(--space-lg) sm:p-(--space-lg)">
                <HeroSlider />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* two torn hills along the foot of the hero */}
      <div aria-hidden="true" className="relative h-(--space-2xl)">
        <div className="absolute inset-x-0 bottom-0 h-12 bg-hill-1 [clip-path:var(--torn-top)]" />
        <div className="absolute inset-x-0 bottom-0 h-7 -scale-x-100 bg-hill-2 [clip-path:var(--torn-top)]" />
      </div>
    </section>
  );
};

export default HomeBanner;
