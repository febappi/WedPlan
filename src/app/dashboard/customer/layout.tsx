import { requireRole } from "@/lib/session";

// Only customers get past this layout; anyone else is sent to their own dashboard
const CustomerLayout = async ({ children }: LayoutProps<"/dashboard/customer">) => {
  await requireRole("customer", "/dashboard/customer");
  return children;
};

export default CustomerLayout;
