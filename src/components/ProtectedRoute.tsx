import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { refreshToken } from "../api/auth";
import { getErrorMessage } from "../utils/getErrorMessage";
import { setAccessToken } from "../api/client.api";
import LoadingOverlay from "./LoadingOverlay";

const MIN_LOADING_TIME = 800; // 👈 adjust this

const ProtectedRoute = () => {
  const { token, setToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      const start = Date.now();

      try {
        if (!token?.access) {
          const data = await refreshToken();
          setToken({ access: data.access });
        }
      } catch (err) {
        console.log(getErrorMessage(err));
        setToken(null);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = MIN_LOADING_TIME - elapsed;

        setTimeout(() => {
          setLoading(false);
        }, Math.max(remaining, 0));
      }
    };

    tryRefresh();
  }, []);

  useEffect(() => {
    setAccessToken(token?.access ?? null);
  }, [token]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!token?.access) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;