import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign In",
};

const getText = (value: string | string[] | undefined) => (typeof value === "string" ? value : "");

// Only same-site paths are allowed as a redirect target
const getSafeRedirect = (value: string) => (value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard");

const SignInPage = async ({ searchParams }: PageProps<"/signin">) => {
  const params = await searchParams;
  const redirectTo = getSafeRedirect(getText(params.redirect));

  const user = await getSessionUser();
  if (user) {
    redirect(redirectTo);
  }

  return (
    <AuthShell title="Welcome back" description="Sign in to see your bookings, services and dashboard.">
      <SignInForm redirectTo={redirectTo} googleError={getText(params.error)} />
    </AuthShell>
  );
};

export default SignInPage;
