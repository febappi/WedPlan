import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div role="status" className="flex flex-1 flex-col items-center justify-center gap-(--space-sm) py-(--space-4xl) text-ink-3">
      <Spinner className="size-7 text-ink" />
      <p className="text-sm">Loading…</p>
    </div>
  );
};

export default Loading;
