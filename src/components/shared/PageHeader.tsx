type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-(--space-md) sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-(length:--text-display-s)">{title}</h1>
        {description && <p className="lead mt-(--space-md) text-ink-2">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
};

export default PageHeader;
