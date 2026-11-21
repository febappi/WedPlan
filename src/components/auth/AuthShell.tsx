type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

// Sign in and sign up share this frame: the head on the left, the form on card stock on the right
const AuthShell = ({ title, description, children }: AuthShellProps) => {
  return (
    <section className="air flex-1 py-(--space-3xl)">
      <div className="container grid grid-cols-1 items-start gap-(--space-2xl) lg:grid-cols-12 lg:gap-(--gap-columns)">
        <div className="lg:col-span-5 lg:pt-(--space-2xl)">
          <h1 className="text-(length:--text-display-s)">{title}</h1>
          <p className="lead mt-(--space-md) text-ink-2">{description}</p>
        </div>
        <div className="stock p-(--space-lg) sm:p-(--space-xl) lg:col-span-6 lg:col-start-7">{children}</div>
      </div>
    </section>
  );
};

export default AuthShell;
