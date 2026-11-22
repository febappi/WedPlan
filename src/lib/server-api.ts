import "server-only";
import { getServerToken } from "./session";

// GET from the Express API on the server with the signed-in user's token; null when it fails
export const serverFetch = async <T>(path: string): Promise<T | null> => {
  try {
    const token = await getServerToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
};
