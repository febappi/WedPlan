import HomeBanner from "@/components/home/HomeBanner";
import CategoryStrips from "@/components/home/CategoryStrips";
import WhyChooseWedPlan from "@/components/home/WhyChooseWedPlan";
import HowWedPlanWorks from "@/components/home/HowWedPlanWorks";

const HomePage = () => {
  return (
    <>
      <HomeBanner />
      <CategoryStrips />
      <WhyChooseWedPlan />
      <HowWedPlanWorks />
    </>
  );
};

export default HomePage;
