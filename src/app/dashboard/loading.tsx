import { HeaderSkeleton, LoadingRegion, StatsSkeleton } from "@/components/shared/LoadingSkeletons";

// Overview pages: a header, the statistics cards and the chart area
const DashboardLoading = () => (
  <LoadingRegion label="Loading dashboard">
    <HeaderSkeleton />
    <StatsSkeleton />
  </LoadingRegion>
);

export default DashboardLoading;
