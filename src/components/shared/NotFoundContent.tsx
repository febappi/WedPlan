import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const NotFoundContent = () => {
  return (
    <div className="container flex flex-1 flex-col justify-center py-(--space-4xl)">
      <p className="font-display text-[clamp(6rem,16vw,14rem)] leading-none font-semibold text-ink-3">404</p>
      <h1 className="mt-(--space-lg) text-(length:--text-display-s)">This page is not here</h1>
      <p className="lead mt-(--space-md) text-ink-2">The link may be old, or the page was moved. Browse the services instead.</p>
      <div className="mt-(--space-xl) flex flex-wrap gap-(--space-sm)">
        <Link href="/services" className={buttonVariants({ size: "lg" })}>
          Browse services
        </Link>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundContent;
