import Link from "next/link";
import BlockedNotice from "@/components/dashboard/BlockedNotice";
import { DashboardMobileNav, DashboardSidebar } from "@/components/dashboard/DashboardNav";
import Logo from "@/components/shared/Logo";
import UserMenu from "@/components/shared/UserMenu";
import { requireUser } from "@/lib/session";

const DashboardLayout = async ({ children }: LayoutProps<"/dashboard">) => {
  const user = await requireUser("/dashboard");

  if (user.isBlocked) {
    return <BlockedNotice />;
  }

  return (
    <div className="flex min-h-dvh">
      <DashboardSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-(--z-sticky-nav) flex h-(--nav-height) items-center justify-between gap-(--space-md) border-b border-rule bg-paper px-(--space-md) sm:px-(--space-lg)">
          <div className="flex min-w-0 items-center gap-(--space-xs) lg:hidden">
            <DashboardMobileNav user={user} />
            <Logo />
          </div>
          <div className="ml-auto flex items-center gap-(--space-lg)">
            <Link href="/" className="-my-(--space-xs) hidden py-(--space-xs) text-sm text-ink-2 transition-colors duration-(--dur-short) hover:text-ink sm:inline">
              Back to site
            </Link>
            <UserMenu user={user} />
          </div>
        </header>
        <div className="flex-1 px-(--space-md) py-(--space-xl) sm:px-(--space-lg) lg:px-(--space-xl)">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
