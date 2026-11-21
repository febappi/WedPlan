"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  List,
  Menu,
  PlusSquare,
  ReceiptText,
  UserRound,
  Users,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { UserAvatar } from "@/components/shared/UserMenu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DashboardLink, dashboardLinks } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/lib/types";

const icons = {
  overview: LayoutDashboard,
  services: List,
  add: PlusSquare,
  bookings: CalendarCheck,
  subscription: CreditCard,
  profile: UserRound,
  users: Users,
  transactions: ReceiptText,
};

const roleLabels = { admin: "Admin", vendor: "Vendor", customer: "Customer" };

const NavLinks = ({ links, onNavigate }: { links: DashboardLink[]; onNavigate?: () => void }) => {
  const pathname = usePathname();
  // The longest matching link is the current one, so Add Service does not also light up My Services
  const current = links
    .filter((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-(--space-3xs)">
      {links.map((link) => {
        const Icon = icons[link.icon];
        const active = current === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-(--space-sm) rounded-(--radius-stock) px-(--space-sm) text-sm font-semibold transition-colors duration-(--dur-short)",
              active ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-3 hover:text-ink"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

const UserBlock = ({ user }: { user: SessionUser }) => (
  <div className="flex items-center gap-(--space-sm)">
    <UserAvatar user={user} className="size-9" />
    <div className="min-w-0">
      <p className="truncate text-sm text-ink">{user.name}</p>
      <p className="truncate text-xs text-ink-3">
        {roleLabels[user.role]}
        {user.role === "vendor" && user.isPremium && <span className="text-blue">, Premium</span>}
      </p>
    </div>
  </div>
);

export const DashboardSidebar = ({ user }: { user: SessionUser }) => (
  <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-rule bg-paper-2 lg:flex">
    <div className="flex h-(--nav-height) items-center border-b border-rule px-(--space-lg)">
      <Logo />
    </div>
    <div className="flex-1 overflow-y-auto p-(--space-md)">
      <NavLinks links={dashboardLinks[user.role]} />
    </div>
    <div className="border-t border-rule p-(--space-md)">
      <UserBlock user={user} />
    </div>
  </aside>
);

export const DashboardMobileNav = ({ user }: { user: SessionUser }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open dashboard menu" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-paper-2">
        <SheetHeader className="border-b border-rule">
          <SheetTitle className="font-display text-xl font-semibold">Dashboard</SheetTitle>
        </SheetHeader>
        <div className="flex-1 px-(--space-md)">
          <NavLinks links={dashboardLinks[user.role]} onNavigate={() => setOpen(false)} />
        </div>
        <div className="border-t border-rule p-(--space-md)">
          <UserBlock user={user} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
