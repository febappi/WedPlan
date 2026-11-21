"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const BlockedNotice = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="container flex min-h-dvh flex-col justify-center py-(--space-3xl)">
      <h1 className="text-(length:--text-display-s)">Your account is blocked</h1>
      <p className="lead mt-(--space-md) text-ink-2">
        An admin has blocked this account, so the dashboard and bookings are closed to it. Contact WedPlan support if you think this is a mistake.
      </p>
      <div className="mt-(--space-xl)">
        <Button type="button" size="lg" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
};

export default BlockedNotice;
