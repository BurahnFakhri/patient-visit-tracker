import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface ProtectedRouteProps {
  role: string;
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { token, user } = useSelector((state: RootState) => state.auth);

  // If not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If roles are defined, check access
  if (role && user?.role && role == user.role ) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />; // Renders nested routes
}
