import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
});

export const getToken = async () => {
  const { data } = await authClient.token();
  return data?.token;
};

export const getAuthHeaders = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// The role chosen on the sign up page travels to the server in a short-lived cookie
export const setSignupRole = (role: "customer" | "vendor") => {
  document.cookie = `wedplan_signup_role=${role}; path=/; max-age=600; samesite=lax`;
};

export const clearSignupRole = () => {
  document.cookie = "wedplan_signup_role=; path=/; max-age=0; samesite=lax";
};

// Google sign in leaves the site, so a toast cannot be shown from the button.
// This note survives the round trip and AuthToast shows the message when the app loads again.
export const AUTH_TOAST_COOKIE = "wedplan_auth_toast";

export const setAuthToast = (value: "google") => {
  document.cookie = `${AUTH_TOAST_COOKIE}=${value}; path=/; max-age=600; samesite=lax`;
};

export const takeAuthToast = () => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_TOAST_COOKIE}=([^;]*)`));
  if (!match) {
    return "";
  }
  document.cookie = `${AUTH_TOAST_COOKIE}=; path=/; max-age=0; samesite=lax`;
  return decodeURIComponent(match[1]);
};
