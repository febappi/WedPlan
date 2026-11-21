import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import NotFoundContent from "@/components/shared/NotFoundContent";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Page not found",
};

const NotFound = async () => {
  const user = await getSessionUser();

  return (
    <>
      <Navbar user={user} />
      <NotFoundContent />
      <Footer />
    </>
  );
};

export default NotFound;
