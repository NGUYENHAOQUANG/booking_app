import { Navigate, Outlet } from "react-router";
import useAuthStore from "@/store/authStore";

const PrivateRoute = () => {
  const { isLoggedIn } = useAuthStore();
  
  // Kiểm tra trạng thái đăng nhập từ store (đã được đồng bộ với isLoggedIn Cookie)
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
