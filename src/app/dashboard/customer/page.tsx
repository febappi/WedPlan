import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Customer Dashboard",
};

const CustomerOverviewPage = async () => {
  const user = await getSessionUser();

  return <DashboardHeader title="Overview" description={`Signed in as ${user?.name}.`} />;
};

export default CustomerOverviewPage;
