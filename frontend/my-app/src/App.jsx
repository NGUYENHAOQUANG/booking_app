import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import Cookies from "js-cookie";
import { router } from "@/routers";
import useAuthStore from "@/store/authStore";

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  // Lấy thông tin user mới nhất từ server khi app khởi động nếu có session cookie
  useEffect(() => {
    if (Cookies.get("isLoggedIn")) fetchMe();
  }, [fetchMe]);

  return <RouterProvider router={router} />;
}