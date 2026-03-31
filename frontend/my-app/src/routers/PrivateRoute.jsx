import { Navigate, Outlet } from "react-router";
import useAuthStore from "@/store/authStore";

const PrivateRoute = () => {
  const { accessToken } = useAuthStore();
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
