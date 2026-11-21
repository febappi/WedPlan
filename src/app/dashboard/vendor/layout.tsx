import { requireRole } from "@/lib/session";

// Only vendors get past this layout; anyone else is sent to their own dashboard
const VendorLayout = async ({ children }: LayoutProps<"/dashboard/vendor">) => {
  await requireRole("vendor", "/dashboard/vendor");
  return children;
};

export default VendorLayout;
