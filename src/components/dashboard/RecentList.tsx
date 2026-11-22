import Link from "next/link";

type RecentListProps = {
  title: string;
  href: string;
  linkLabel: string;
  empty: string;
  count: number;
  children?: React.ReactNode;
};

// A short list under the stat cards with a link to the full page
const RecentList = ({ title, href, linkLabel, empty, count, children }: RecentListProps) => {
  return (
    <section className="stock mt-(--space-xl) p-(--space-lg)">
      <div className="flex flex-wrap items-baseline justify-between gap-(--space-sm)">
        <h2 className="text-(length:--text-title)">{title}</h2>
        <Link href={href} className="text-link text-sm">
          {linkLabel}
        </Link>
      </div>
      {count === 0 ? <p className="mt-(--space-md) text-ink-2">{empty}</p> : <ul className="mt-(--space-md) divide-y divide-rule">{children}</ul>}
    </section>
  );
};

export default RecentList;
