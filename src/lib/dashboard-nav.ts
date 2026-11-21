import { Role } from "./types";

export type DashboardLink = {
  href: string;
  label: string;
  icon: "overview" | "services" | "add" | "bookings" | "subscription" | "profile" | "users" | "transactions";
};

export const dashboardLinks: Record<Role, DashboardLink[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: "overview" },
    { href: "/dashboard/vendor/services", label: "My Services", icon: "services" },
    { href: "/dashboard/vendor/services/new", label: "Add Service", icon: "add" },
    { href: "/dashboard/vendor/bookings", label: "Booking Requests", icon: "bookings" },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: "subscription" },
    { href: "/dashboard/profile", label: "Profile Settings", icon: "profile" },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: "overview" },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: "bookings" },
    { href: "/dashboard/profile", label: "Profile Settings", icon: "profile" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: "overview" },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: "users" },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: "services" },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: "transactions" },
  ],
};
