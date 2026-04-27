import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { refreshToken } from "../api/auth";
import { getErrorMessage } from "../utils/getErrorMessage";
import { setAccessToken } from "../api/client.api";
import LoadingOverlay from "./LoadingOverlay";

const PublicRoute = () => {
  const { token, setToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        if (!token?.access) {
          const data = await refreshToken();
          setToken({ access: data.access });
        }
      } catch (err) {
        console.log(getErrorMessage(err));
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);

  useEffect(() => {
    setAccessToken(token?.access ?? null);
  }, [token]);

  if (loading) {
    return <LoadingOverlay />
  }

  if (token?.access) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;