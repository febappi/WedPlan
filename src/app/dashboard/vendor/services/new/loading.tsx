import { FormSkeleton, HeaderSkeleton, LoadingRegion } from "@/components/shared/LoadingSkeletons";

const Loading = () => (
  <LoadingRegion label="Loading the service form">
    <HeaderSkeleton />
    <FormSkeleton fields={6} />
  </LoadingRegion>
);

export default Loading;
