import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import WelcomeForm from "@/components/auth/WelcomeForm";
import { dashboardPaths, getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Finish Setting Up",
};

// New Google accounts land here once, to choose customer or vendor before using WedPlan
const WelcomePage = async () => {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin?redirect=/welcome");
  }
  if (!user.needsSetup) {
    redirect(dashboardPaths[user.role]);
  }

  return (
    <AuthShell title="One last step" description="You are signed in with Google. Tell us how you will use WedPlan and we will open the right dashboard.">
      <WelcomeForm user={user} />
    </AuthShell>
  );
};

export default WelcomePage;
