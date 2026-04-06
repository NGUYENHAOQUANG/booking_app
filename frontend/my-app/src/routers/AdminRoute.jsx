// src/routers/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

/**
 * AdminRoute — Chỉ cho phép user có role name là "admin" hoặc "superadmin".
 * - Nếu chưa đăng nhập → redirect về /login
 * - Nếu không đủ quyền → redirect về /dashboard
 *
 * Note: User.role là ObjectId populate { name, displayName }.
 * Nên check qua user.role?.name.
 */
export default function AdminRoute() {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // user.role có thể là ObjectId chưa populate, hoặc object { name, displayName }
  const roleName = typeof user?.role === "object" ? user?.role?.name : null;
  const isAdmin  = ["admin", "superadmin"].includes(roleName);

  if (!isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
