"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { publicNavLinks } from "@/lib/site";
import { SessionUser } from "@/lib/types";

const Navbar = ({ user }: { user: SessionUser | null }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-(--z-sticky-nav) border-b border-rule bg-paper">
      <div className="container flex h-(--nav-height) items-center justify-between gap-6">
        <Logo />

        <div className="flex items-center gap-6">
          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "text-sm whitespace-nowrap underline-offset-[0.4em] transition-colors duration-(--dur-short)",
                  isActive(link.href)
                    ? "text-ink underline decoration-signal decoration-1"
                    : "text-ink-2 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user && <UserMenu user={user} />}

          {!user && (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/signin" className="text-sm whitespace-nowrap text-ink-2 transition-colors duration-(--dur-short) hover:text-ink">
                Sign In
              </Link>
              <Link href="/signup" className={buttonVariants({ variant: "outline" })}>
                Sign Up
              </Link>
            </div>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}>
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-paper">
              <SheetHeader className="border-b border-rule">
                <SheetTitle className="font-display text-xl font-normal">WedPlan</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col px-4">
                {publicNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "border-b border-rule py-4 text-md",
                      isActive(link.href) ? "text-ink underline decoration-signal underline-offset-[0.4em]" : "text-ink-2"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {!user && (
                <div className="mt-auto flex flex-col gap-3 border-t border-rule p-4">
                  <Link href="/signin" onClick={() => setIsMenuOpen(false)} className={buttonVariants({ variant: "outline" })}>
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)} className={buttonVariants()}>
                    Sign Up
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
