const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, options);
  } catch {
    throw new Error("Could not reach the server. Please check your connection.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
