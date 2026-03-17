import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setAccessToken } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CheckEmail from "./pages/CheckEmail";
import Task from "./pages/Task";
import Completed from "./pages/Completed";
import Trash from "./pages/Trash";
import OAuthSuccess from "./pages/OAuthSuccess";
import About from "./pages/About";

import { getAccessTokenFromCookie } from "./utils/getAccessToken";
import { refreshAccessToken } from "./utils/refreshAccessToken";

const API = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();

  // Check user login or not
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = getAccessTokenFromCookie();

        let token = accessToken;

        // If no access token → try refresh
        if (!token) {
          try {
            const newToken = await refreshAccessToken();

            if (!newToken) {
              dispatch(clearUser());
              return;
            }

            dispatch(setAccessToken(newToken));
            token = newToken;
          } catch {
            dispatch(clearUser());
            return;
          }
        }

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // passing cookies
        });

        if (!res.ok) {
          if (res.status === 401) {
            const newToken = await refreshAccessToken();

            if (!newToken) {
              dispatch(clearUser());
              return;
            }

            // store new token
            dispatch(setAccessToken(newToken));

            // retry /me
            const retryRes = await fetch(`${API}/auth/me`, {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
              credentials: "include",
            });

            if (!retryRes.ok) {
              dispatch(clearUser());
              return;
            }

            const retryData = await retryRes.json();

            dispatch(setUser(retryData.user));
          }
          return;
        }

        const data = await res.json();

        // Update redux after login
        dispatch(setUser(data.user));
        dispatch(setAccessToken(token));
      } catch {
        dispatch(clearUser());
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 pt-2 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/checkEmail" element={<CheckEmail />} />
        <Route path="/task" element={<Task />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
