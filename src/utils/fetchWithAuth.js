import { refreshAccessToken } from "./refreshAccessToken";
import { clearUser, setAccessToken } from "../features/auth/authSlice";


export const fetchWithAuth = async (
  url,
  options = {},
  dispatch,
  accessToken,
) => {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      const newToken = await refreshAccessToken();

      dispatch(setAccessToken(newToken));

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
      });
    } catch {
      dispatch(clearUser());
      return null;
    }
  }

  return res;
};
