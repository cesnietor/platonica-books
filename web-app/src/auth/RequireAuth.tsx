import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RequireAuth() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    // still checking the cookie → show spinner (or null)
    return <div>Loading…</div>;
  }

  if (!isAuthenticated) {
    // preserve where they were going to redirect back after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
