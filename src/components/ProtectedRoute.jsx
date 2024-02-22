import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn === true ? <Outlet /> : <Navigate to="/" replace />;
};
