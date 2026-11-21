import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Profile Settings",
};

const ProfilePage = async () => {
  const user = await requireUser("/dashboard/profile");

  return (
    <>
      <DashboardHeader title="Profile Settings" description="Your name and photo appear on your bookings and listings." />
      <ProfileForm user={user} />
    </>
  );
};

export default ProfilePage;
