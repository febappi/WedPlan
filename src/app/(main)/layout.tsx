import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { getSessionUser } from "@/lib/session";

const MainLayout = async ({ children }: LayoutProps<"/">) => {
  const user = await getSessionUser();

  return (
    <>
      <Navbar user={user} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
