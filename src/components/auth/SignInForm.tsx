"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleButton from "./GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

const getGoogleErrorMessage = (code: string) => {
  if (!code) {
    return "";
  }
  return `Google sign in did not finish (${code.replace(/_/g, " ")}). Please try again.`;
};

type SignInFormProps = {
  redirectTo: string;
  googleError: string;
};

const SignInForm = ({ redirectTo, googleError }: SignInFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(getGoogleErrorMessage(googleError));

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    if (!email || !password) {
      setErrorMessage("Please enter your email and password");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setLoading(false);
      const message = error.message || "Sign in failed. Please try again.";
      setErrorMessage(message);
      toast.add({ title: message, type: "error" });
      return;
    }

    toast.add({ title: "Signed in successfully", type: "success" });
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div>
      <form onSubmit={handleSignIn} method="post" noValidate className="space-y-(--space-lg)">
        <div className="space-y-(--space-xs)">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-(--space-xs)">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Your password" />
        </div>

        {errorMessage && (
          <p role="alert" className="rounded-(--radius-input) border border-destructive/40 px-(--space-sm) py-(--space-xs) text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Signing in" : "Sign In"}
        </Button>
      </form>

      <div className="my-(--space-lg) flex items-center gap-(--space-sm) text-sm text-ink-3">
        <span className="h-px flex-1 bg-rule" />
        or
        <span className="h-px flex-1 bg-rule" />
      </div>

      <GoogleButton callbackURL={redirectTo} errorCallbackURL="/signin" label="Sign in with Google" />

      <p className="mt-(--space-lg) text-sm text-ink-2">
        New to WedPlan?{" "}
        <Link href="/signup" className="text-link">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
