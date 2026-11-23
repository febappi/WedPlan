import { FilterSkeleton, HeaderSkeleton, ListSkeleton, LoadingRegion } from "@/components/shared/LoadingSkeletons";

const Loading = () => (
  <LoadingRegion label="Loading users">
    <HeaderSkeleton />
    <FilterSkeleton variant="search" />
    <ListSkeleton />
  </LoadingRegion>
);

export default Loading;
