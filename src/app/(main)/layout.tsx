import Navbar from "@/components/shared/Navbar";

const MainLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <Navbar user={null} />
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
};

export default MainLayout;
