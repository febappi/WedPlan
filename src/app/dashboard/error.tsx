"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

// Keeps the sidebar in place when one dashboard page fails to load
const DashboardError = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="stock flex flex-col items-start gap-(--space-md) p-(--space-xl)">
      <TriangleAlert className="size-8 text-coral" aria-hidden="true" />
      <div>
        <h1 className="text-(length:--text-title)">This page did not load</h1>
        <p className="mt-(--space-xs) text-ink-2">Something went wrong while loading your data. Try again, or go back to the overview.</p>
      </div>
      <div className="flex flex-wrap gap-(--space-sm)">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          Back to overview
        </Link>
      </div>
    </div>
  );
};

export default DashboardError;
