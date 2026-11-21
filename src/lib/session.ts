import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { Role, SessionUser } from "./types";

export const dashboardPaths: Record<Role, string> = {
  admin: "/dashboard/admin",
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
};

// Premium counts only while it has not run out; decided once on the server
const hasActivePremium = (user: Record<string, unknown>) =>
  user.subscriptionPlan === "premium" &&
  (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt as string | Date) > new Date());

const toSessionUser = (user: Record<string, unknown>): SessionUser => ({
  id: String(user.id),
  name: String(user.name),
  email: String(user.email),
  image: (user.image as string | null) ?? null,
  role: (user.role as Role) || "customer",
  isBlocked: Boolean(user.isBlocked),
  businessName: (user.businessName as string | null) ?? null,
  subscriptionPlan: user.subscriptionPlan === "premium" ? "premium" : "free",
  subscriptionExpiresAt: (user.subscriptionExpiresAt as string | Date | null) ?? null,
  isPremium: hasActivePremium(user),
});

export const getSessionUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ? toSessionUser(session.user) : null;
};

export const requireUser = async (currentPath: string) => {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/signin?redirect=${encodeURIComponent(currentPath)}`);
  }
  return user;
};

// Sends a user who opens another role's dashboard back to their own
export const requireRole = async (role: Role, currentPath: string) => {
  const user = await requireUser(currentPath);
  if (user.role !== role) {
    redirect(dashboardPaths[user.role]);
  }
  return user;
};

export const getServerToken = async () => {
  const { token } = await auth.api.getToken({ headers: await headers() });
  return token;
};
