import { auth } from "@/lib/auth";
import { ensureConnected } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

// Make sure the database connection is open before Better Auth uses it
export const GET = async (request: Request) => {
  await ensureConnected();
  return handler.GET(request);
};

export const POST = async (request: Request) => {
  await ensureConnected();
  return handler.POST(request);
};
