import { FilterSkeleton, HeaderSkeleton, ListSkeleton, LoadingRegion } from "@/components/shared/LoadingSkeletons";

const Loading = () => (
  <LoadingRegion label="Loading your bookings">
    <HeaderSkeleton />
    <FilterSkeleton variant="chips" />
    <ListSkeleton />
  </LoadingRegion>
);

export default Loading;
