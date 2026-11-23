import { FormSkeleton, HeaderSkeleton, LoadingRegion } from "@/components/shared/LoadingSkeletons";

const Loading = () => (
  <LoadingRegion label="Loading your profile">
    <HeaderSkeleton />
    <FormSkeleton fields={3} />
  </LoadingRegion>
);

export default Loading;
