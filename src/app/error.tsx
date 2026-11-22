"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

// Catches errors that escape the section error pages, such as a dashboard layout failing to load
const AppError = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <main className="flex min-h-dvh items-center justify-center px-(--space-md) py-(--space-2xl)">
      <div className="stock flex w-full max-w-md flex-col items-start gap-(--space-md) p-(--space-xl)">
        <TriangleAlert className="size-8 text-coral" aria-hidden="true" />
        <div>
          <h1 className="text-(length:--text-title)">Something went wrong</h1>
          <p className="mt-(--space-xs) text-ink-2">The page could not load just now. Try again, or go back to the home page.</p>
        </div>
        <div className="flex flex-wrap gap-(--space-sm)">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AppError;
