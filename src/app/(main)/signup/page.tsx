import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async ({ searchParams }: PageProps<"/signup">) => {
  const params = await searchParams;
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  const defaultRole = params.role === "vendor" ? "vendor" : "customer";

  return (
    <AuthShell
      title="Create your account"
      description="Couples send booking requests. Vendors list their services and answer them."
    >
      <SignUpForm defaultRole={defaultRole} />
    </AuthShell>
  );
};

export default SignUpPage;
