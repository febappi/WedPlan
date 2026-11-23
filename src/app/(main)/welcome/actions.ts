"use server";

import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, ensureConnected } from "@/lib/db";
import { dashboardPaths, getSessionUser } from "@/lib/session";

export type SetupState = { error?: string; businessNameError?: string };

// Finishes a new Google account: the role (and a business name for vendors) is set once, on the server.
// Only an account that is still pending can be changed, so this can never switch an existing role.
export const completeSetup = async (_state: SetupState, formData: FormData): Promise<SetupState> => {
  const user = await getSessionUser();
  if (!user) {
    redirect("/signin?redirect=/welcome");
  }
  if (!user.needsSetup) {
    redirect(dashboardPaths[user.role]);
  }

  const role = formData.get("role");
  if (role !== "customer" && role !== "vendor") {
    return { error: "Choose Customer or Vendor to continue." };
  }

  const businessName = String(formData.get("businessName") || "").trim();
  if (role === "vendor" && !businessName) {
    return { businessNameError: "Business name is required for vendors" };
  }

  try {
    await ensureConnected();
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(user.id), role: "pending" },
      { $set: { role, businessName: role === "vendor" ? businessName : null, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
      return { error: "Your account is already set up. Please refresh the page." };
    }
  } catch (error) {
    console.error("[welcome] setup failed:", error instanceof Error ? error.message : error);
    return { error: "Your account could not be saved. Please try again." };
  }

  // AuthToast on the dashboard reads this and confirms the new account
  (await cookies()).set("wedplan_auth_toast", "setup", { path: "/", maxAge: 60, sameSite: "lax" });
  redirect(dashboardPaths[role]);
};
