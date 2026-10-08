import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";

export function useApi() {
  const { getToken } = useAuth();

  return useCallback(
    async (path, options = {}) => {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
      if (!res.ok) throw new Error((await res.json()).error || "Request failed");
      return res.json();
    },
    [getToken]
  );
}