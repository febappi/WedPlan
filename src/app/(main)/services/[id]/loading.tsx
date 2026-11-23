import { LoadingRegion, ServiceDetailsSkeleton } from "@/components/shared/LoadingSkeletons";

const Loading = () => (
  <LoadingRegion label="Loading service">
    <ServiceDetailsSkeleton />
  </LoadingRegion>
);

export default Loading;
