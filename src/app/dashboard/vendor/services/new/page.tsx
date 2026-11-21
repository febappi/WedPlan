import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ServiceForm from "@/components/services/ServiceForm";

export const metadata: Metadata = {
  title: "Add Service",
};

const AddServicePage = () => {
  return (
    <>
      <DashboardHeader
        title="Add Service"
        description="New services wait for an admin to approve them before couples can see and book them."
      />
      <ServiceForm />
    </>
  );
};

export default AddServicePage;
