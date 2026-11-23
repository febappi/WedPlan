"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

type GoogleButtonProps = {
  callbackURL: string;
  errorCallbackURL: string;
  label: string;
};

// An existing account (same email, made with email or Google) signs straight in.
// A brand-new account goes to /welcome first to pick customer or vendor.
const GoogleButton = ({ callbackURL, errorCallbackURL, label }: GoogleButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL, errorCallbackURL, newUserCallbackURL: "/welcome" });
    if (error) {
      setLoading(false);
      toast.add({ title: error.message || "Google sign in failed. Please try again.", type: "error" });
    }
  };

  return (
    <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleGoogle} disabled={loading} aria-label={label}>
      {loading ? (
        <Spinner />
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.55 2.75 12 2.75 6.89 2.75 2.75 6.9 2.75 12S6.89 21.25 12 21.25c5.33 0 8.87-3.75 8.87-9.02 0-.6-.06-1.06-.14-1.53z" />
        </svg>
      )}
      {/* very narrow screens get the short form so the label never runs out of the button */}
      <span className="min-[360px]:hidden">Google</span>
      <span className="max-[359px]:hidden">{label}</span>
    </Button>
  );
};

export default GoogleButton;
