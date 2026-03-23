import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../components/layouts/MainLayout";
import AuthLayout from "../components/layouts/AuthLayout";

// Guards
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import HomePage from "../page/HomePage";
import SearchPage from "../page/SearchPage";
import RoomDetailPage from "../page/RoomDetailPage";
import BookingPage from "../page/BookingPage";
import ProfilePage from "../page/ProfilePage";
import DashboardPage from "../page/DashboardPage";
import LoginPage from "../page/LoginPage";
import RegisterPage from "../page/RegisterPage";
import NotFoundPage from "../page/NotFoundPage";

// TODO: Thay bằng giá trị thực từ AuthContext / Redux store
const isAuthenticated = false;
const isAdmin = false;

const router = createBrowserRouter([
  // ── Public routes (có Navbar + Footer) ──
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/rooms/:id", element: <RoomDetailPage /> },

      // ── Private routes: chỉ user đã đăng nhập ──
      {
        element: <ProtectedRoute isAllowed={isAuthenticated} />,
        children: [
          { path: "/rooms/:id/book", element: <BookingPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },

      // ── Admin routes: chỉ user là admin ──
      {
        element: <ProtectedRoute isAllowed={isAdmin} redirectTo="/" />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
        ],
      },
    ],
  },

  // ── Auth routes (chỉ card form, không có Navbar) ──
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // ── 404 ──
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
