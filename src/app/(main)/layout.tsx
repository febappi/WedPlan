import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const MainLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <Navbar user={null} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
