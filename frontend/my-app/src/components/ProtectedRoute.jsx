import { Navigate, Outlet } from "react-router-dom";

/**
 * Bảo vệ các route yêu cầu đăng nhập.
 * @param {boolean} isAllowed - True nếu user được phép truy cập.
 * @param {string} redirectTo - Đường dẫn redirect khi không có quyền.
 */
const ProtectedRoute = ({ isAllowed, redirectTo = "/login" }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
