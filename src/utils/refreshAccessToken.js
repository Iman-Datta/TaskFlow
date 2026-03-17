const API = import.meta.env.VITE_API_URL;

export const refreshAccessToken = async () => {
  const res = await fetch(`${API}/auth/refresh-token`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  return data.accessToken;
};
