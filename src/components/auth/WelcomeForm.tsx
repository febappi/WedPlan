"use client";

import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import RolePicker, { SignupRole } from "./RolePicker";
import { completeSetup, SetupState } from "@/app/(main)/welcome/actions";
import { UserAvatar } from "@/components/shared/UserMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/lib/types";

// The one question a Google sign up skips: is this a couple or a vendor?
const WelcomeForm = ({ user }: { user: SessionUser }) => {
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>("customer");
  const [state, formAction, saving] = useActionState<SetupState, FormData>(completeSetup, {});
  const [signingOut, setSigningOut] = useState(false);

  // Submitting through onSubmit keeps the chosen role and typed name if the server sends an error back
  // (a form "action" prop would reset the fields after every submit)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await authClient.signOut();
    if (error) {
      setSigningOut(false);
      toast.add({ title: error.message || "Sign out failed. Please try again.", type: "error" });
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div>
      <div className="mb-(--space-lg) flex items-center gap-(--space-sm)">
        <UserAvatar user={user} className="size-11" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{user.name}</p>
          <p className="truncate text-sm text-ink-3">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-(--space-lg)">
        <RolePicker role={role} onChange={setRole} legend="How will you use WedPlan?" />

        {role === "vendor" && (
          <div className="space-y-(--space-xs)">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              name="businessName"
              autoComplete="organization"
              placeholder="The name couples will see"
              aria-invalid={Boolean(state.businessNameError)}
              aria-describedby={state.businessNameError ? "businessName-error" : undefined}
            />
            {state.businessNameError && (
              <p id="businessName-error" role="alert" className="text-sm text-destructive">
                {state.businessNameError}
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-ink-3">You cannot change this later, so pick the one that fits you.</p>

        {state.error && (
          <p role="alert" className="rounded-(--radius-input) border border-destructive/40 px-(--space-sm) py-(--space-xs) text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={saving || signingOut}>
          {saving && <Spinner />}
          {saving ? "Setting up your account" : "Continue"}
        </Button>
      </form>

      <p className="mt-(--space-lg) text-sm text-ink-2">
        Not you?{" "}
        <button type="button" onClick={handleSignOut} disabled={saving || signingOut} className="text-link disabled:opacity-60">
          Sign out
        </button>
      </p>
    </div>
  );
};

export default WelcomeForm;
