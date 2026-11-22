import Link from "next/link";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  highlight?: boolean;
};

// A figure and its label; the highlighted one sits on pear
const StatCard = ({ label, value, hint, href, highlight }: StatCardProps) => {
  const body = (
    <>
      <p className={cn("text-sm", highlight ? "text-pear-ink" : "text-ink-2")}>{label}</p>
      <p className="mt-(--space-xs) text-(length:--text-3xl) leading-none font-semibold tabular-nums">{value}</p>
      {hint && <p className={cn("mt-(--space-xs) text-xs", highlight ? "text-pear-ink" : "text-ink-3")}>{hint}</p>}
    </>
  );
  const className = cn(
    "block rounded-(--radius-card) p-(--space-md) shadow-(--shadow-card) bg-[image:var(--grain),var(--fibre)] sm:p-(--space-lg)",
    highlight ? "bg-pear text-pear-ink" : "bg-stock text-ink",
    href && "transition-transform duration-(--dur-short) hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
  );

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
};

export const StatGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-(--space-sm) sm:gap-(--space-md) lg:grid-cols-3 xl:grid-cols-5 max-lg:[&>*:last-child:nth-child(odd)]:col-span-2">{children}</div>
);

export default StatCard;
