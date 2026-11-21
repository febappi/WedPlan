import { Suspense } from "react";
import HomeBanner from "@/components/home/HomeBanner";
import FeaturedServices from "@/components/home/FeaturedServices";
import CategoryTiles from "@/components/home/CategoryTiles";
import WhyChooseWedPlan from "@/components/home/WhyChooseWedPlan";
import HowWedPlanWorks from "@/components/home/HowWedPlanWorks";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";

const HomePage = () => {
  return (
    <>
      <HomeBanner />
      <Suspense
        fallback={
          <div className="container pt-(--section-gap-s)">
            <ServiceGridSkeleton count={3} />
          </div>
        }
      >
        <FeaturedServices />
      </Suspense>
      <CategoryTiles />
      <WhyChooseWedPlan />
      <HowWedPlanWorks />
    </>
  );
};

export default HomePage;
