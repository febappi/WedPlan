import { Suspense } from "react";
import HomeBanner from "@/components/home/HomeBanner";
import FeaturedServices from "@/components/home/FeaturedServices";
import CategoryTiles from "@/components/home/CategoryTiles";
import WhyChooseWedPlan from "@/components/home/WhyChooseWedPlan";
import HowWedPlanWorks from "@/components/home/HowWedPlanWorks";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage = () => {
  return (
    <>
      <HomeBanner />
      <Suspense
        fallback={
          <div className="container pt-(--section-gap-s)">
            <Skeleton className="h-10 w-96 max-w-full bg-paper-3" />
            <Skeleton className="mt-(--space-sm) h-5 w-80 max-w-full bg-paper-3" />
            <div className="mt-(--space-2xl)">
              <ServiceGridSkeleton count={6} />
            </div>
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
