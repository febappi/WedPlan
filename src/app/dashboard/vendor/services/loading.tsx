import { HeaderSkeleton, ListSkeleton, LoadingRegion } from "@/components/shared/LoadingSkeletons";

const Loading = () => (
  <LoadingRegion label="Loading your services">
    <HeaderSkeleton action />
    <ListSkeleton rows={4} />
  </LoadingRegion>
);

export default Loading;
