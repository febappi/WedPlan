import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import NotFoundContent from "@/components/shared/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found",
};

const NotFound = () => {
  return (
    <>
      <Navbar user={null} />
      <NotFoundContent />
      <Footer />
    </>
  );
};

export default NotFound;
