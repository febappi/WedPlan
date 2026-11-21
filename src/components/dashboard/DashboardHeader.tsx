type DashboardHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const DashboardHeader = ({ title, description, children }: DashboardHeaderProps) => {
  return (
    <div className="mb-(--space-xl) flex flex-col gap-(--space-md) sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-(length:--text-3xl) leading-tight">{title}</h1>
        {description && <p className="mt-(--space-xs) max-w-[60ch] text-ink-2">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
};

export default DashboardHeader;
