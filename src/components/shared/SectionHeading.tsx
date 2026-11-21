import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

// The head block: an h2 and at most one line, with an optional action on the right
const SectionHeading = ({ id, title, description, className, children }: SectionHeadingProps) => {
  return (
    <div className={cn("flex flex-col gap-(--space-lg) md:flex-row md:items-end md:justify-between", className)}>
      <div className="flex flex-col gap-(--space-md)">
        <h2 id={id}>{title}</h2>
        {description && <p className="lead text-ink-2">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
};

export default SectionHeading;
