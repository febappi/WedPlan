import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { db, mongoClient } from "./db";

export const SIGNUP_ROLE_COOKIE = "wedplan_signup_role";
const PUBLIC_ROLES = ["customer", "vendor"];

const appURL = (process.env.BETTER_AUTH_URL as string).replace(/\/$/, "");

export const auth = betterAuth({
  baseURL: appURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [appURL],
  database: mongodbAdapter(db, { client: mongoClient }),
  user: {
    modelName: "users",
    additionalFields: {
      // input: false means a user can never send these in sign up or profile updates
      role: { type: "string", defaultValue: "customer", input: false },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      subscriptionPlan: { type: "string", defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
      businessName: { type: "string", required: false, input: true },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },
  databaseHooks: {
    user: {
      create: {
        // The role picked on the sign up page arrives in a short-lived cookie.
        // Only customer and vendor are accepted, so admin can never be created here.
        before: async (user, ctx) => {
          const requestedRole = ctx?.getCookie(SIGNUP_ROLE_COOKIE);
          const role = requestedRole && PUBLIC_ROLES.includes(requestedRole) ? requestedRole : "customer";
          return {
            data: {
              ...user,
              role,
              isBlocked: false,
              subscriptionPlan: "free",
              subscriptionExpiresAt: null,
              businessName: role === "vendor" ? user.businessName || null : null,
            },
          };
        },
      },
    },
    session: {
      create: {
        // Blocked users cannot start a new session
        before: async (session, ctx) => {
          const user = await ctx?.context.internalAdapter.findUserById(session.userId);
          if (user && (user as { isBlocked?: boolean }).isBlocked) {
            throw new APIError("FORBIDDEN", { message: "Your account has been blocked. Please contact WedPlan support." });
          }
        },
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: appURL,
        audience: appURL,
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          name: user.name,
          email: user.email,
          role: (user as { role?: string }).role,
        }),
      },
    }),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
