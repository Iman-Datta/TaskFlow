import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken, clearUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

import { refreshAccessToken } from "../utils/refreshAccessToken";

const API = import.meta.env.VITE_API_URL;

function AuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const newToken = await refreshAccessToken();

        if (!newToken) {
          dispatch(clearUser());
          navigate("/auth");
          return;
        }

        dispatch(setAccessToken(newToken));

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          dispatch(clearUser());
          navigate("/auth");
          return;
        }

        const data = await res.json();
        dispatch(setUser(data.user));

        navigate("/task");
      } catch {
        dispatch(clearUser());
        navigate("/auth");
      }
    };

    handleOAuth();
  }, [dispatch, navigate]);

  return <div>Signing you in...</div>;
}

export default AuthCallback;
