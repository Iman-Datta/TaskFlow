import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

import { getAccessTokenFromCookie } from "../utils/getAccessToken";

const API = import.meta.env.VITE_API_URL;

function OAuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) {
      navigate("/auth");
      return;
    }
    const loadUser = async () => {
      const res = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        navigate("/auth");
        return;
      }

      const data = await res.json();
      dispatch(setAccessToken(accessToken));
      dispatch(setUser(data.user));

      navigate("/task");
    };

    loadUser();
  }, [dispatch, navigate]);

  return <div>Signing you in...</div>;
}

export default OAuthSuccess;
