import { HeaderSkeleton, LoadingRegion, PlanCardsSkeleton } from "@/components/shared/LoadingSkeletons";

const Loading = () => (
  <LoadingRegion label="Loading your plan">
    <HeaderSkeleton />
    <PlanCardsSkeleton />
  </LoadingRegion>
);

export default Loading;
