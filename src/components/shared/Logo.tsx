import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" aria-label="WedPlan home" className={cn("inline-flex items-baseline gap-2 text-ink", className)}>
      <span className="font-display text-2xl leading-none font-semibold tracking-(--tracking-display)">WedPlan</span>
    </Link>
  );
};

export default Logo;
