"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

const ErrorPage = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="container flex flex-1 flex-col justify-center py-(--space-4xl)">
      <h1 className="text-(length:--text-display-s)">This page did not load</h1>
      <p className="lead mt-(--space-md) text-ink-2">Something went wrong on our side. Try again, or go back to the home page.</p>
      <div className="mt-(--space-xl) flex flex-wrap gap-(--space-sm)">
        <Button type="button" size="lg" onClick={reset}>
          Try again
        </Button>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
