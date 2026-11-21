"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/lib/types";

const roleLabels = {
  admin: "Admin",
  vendor: "Vendor",
  customer: "Customer",
};

export const UserAvatar = ({ user, className }: { user: SessionUser; className?: string }) => (
  <Avatar className={className}>
    <AvatarImage src={user.image || undefined} alt={user.name} />
    <AvatarFallback className="bg-ink text-paper">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
  </Avatar>
);

const UserMenu = ({ user }: { user: SessionUser }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.add({ title: error.message || "Logout failed. Please try again.", type: "error" });
      return;
    }
    toast.add({ title: "Logged out", type: "success" });
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        aria-label="Open profile menu"
      >
        <UserAvatar user={user} className="size-10" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-(--space-sm) py-(--space-xs)">
            <UserAvatar user={user} className="size-9" />
            <span className="min-w-0">
              <span className="block truncate text-sm text-ink">{user.name}</span>
              <span className="block truncate text-xs text-ink-3">
                {roleLabels[user.role]}, {user.email}
              </span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
          <Settings />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
