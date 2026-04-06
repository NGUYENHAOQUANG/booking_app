import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "@/store/authStore";

const PrivateRoute = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  
  // Kiểm tra trạng thái đăng nhập từ store (đã được đồng bộ với isLoggedIn Cookie)
  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        redirectTo: {
          path: `${location.pathname}${location.search}`,
          state: location.state,
        },
      }}
    />
  );
};

export default PrivateRoute;
