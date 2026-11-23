import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { ensureConnected } from "./db";
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

// A pending account carries "customer" only as a placeholder: requireUser sends it to /welcome first
const toSessionUser = (user: Record<string, unknown>): SessionUser => ({
  id: String(user.id),
  name: String(user.name),
  email: String(user.email),
  image: (user.image as string | null) ?? null,
  role: user.role === "pending" ? "customer" : (user.role as Role) || "customer",
  needsSetup: user.role === "pending",
  isBlocked: Boolean(user.isBlocked),
  businessName: (user.businessName as string | null) ?? null,
  phone: (user.phone as string | null) ?? null,
  subscriptionPlan: user.subscriptionPlan === "premium" ? "premium" : "free",
  subscriptionExpiresAt: (user.subscriptionExpiresAt as string | Date | null) ?? null,
  isPremium: hasActivePremium(user),
});

// On serverless hosting the database connection can be closed while an instance is frozen.
// Each attempt re-opens it first, retries briefly, and logs the real message for the hosting logs.
const withRetry = async <T>(label: string, task: () => Promise<T>, attempts = 3): Promise<T> => {
  for (let attempt = 1; ; attempt++) {
    try {
      await ensureConnected();
      return await task();
    } catch (error) {
      console.error(`[auth] ${label} failed (attempt ${attempt} of ${attempts}):`, error instanceof Error ? error.message : error);
      if (attempt >= attempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 150 * attempt));
    }
  }
};

// cache() shares one session lookup between the layout and the page of the same request
export const getSessionUser = cache(async () => {
  const requestHeaders = await headers();
  const session = await withRetry("getSession", () => auth.api.getSession({ headers: requestHeaders }));
  return session ? toSessionUser(session.user) : null;
});

export const requireUser = async (currentPath: string) => {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/signin?redirect=${encodeURIComponent(currentPath)}`);
  }
  if (user.needsSetup) {
    redirect("/welcome");
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
  const requestHeaders = await headers();
  const { token } = await withRetry("getToken", () => auth.api.getToken({ headers: requestHeaders }));
  return token;
};
