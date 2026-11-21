import { requireRole } from "@/lib/session";

// Only admins get past this layout; anyone else is sent to their own dashboard
const AdminLayout = async ({ children }: LayoutProps<"/dashboard/admin">) => {
  await requireRole("admin", "/dashboard/admin");
  return children;
};

export default AdminLayout;
