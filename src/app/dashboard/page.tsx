import { redirect } from "next/navigation";
import { dashboardPaths, requireUser } from "@/lib/session";

// /dashboard sends each user to the dashboard of their own role
const DashboardPage = async () => {
  const user = await requireUser("/dashboard");
  redirect(dashboardPaths[user.role]);
};

export default DashboardPage;
