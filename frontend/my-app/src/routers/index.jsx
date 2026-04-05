// src/routers/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ROUTES } from "@/constants/routes";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";

const lazy_ = (fn) => {
  const Comp = lazy(fn);
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse italic select-none">
          Đang tải trải nghiệm của bạn...
        </div>
      }
    >
      <Comp />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  // ── Auth routes ──────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN,      element: lazy_(() => import("@/components/auth/LoginPage")) },
      { path: ROUTES.REGISTER,   element: lazy_(() => import("@/components/auth/RegisterPage")) },
      { path: ROUTES.FORGOT_PW,  element: lazy_(() => import("@/components/auth/ForgotPasswordPage")) },
      { path: ROUTES.VERIFY_OTP, element: lazy_(() => import("@/components/auth/VerifyOTPPage")) },
      { path: ROUTES.RESET_PW,   element: lazy_(() => import("@/components/auth/ResetPasswordPage")) },
    ],
  },

  // ── Public & Protected routes (Main Layout) ───────────────────────────
  {
    element: <MainLayout />,
    children: [
      // Public pages
      { path: ROUTES.HOME,          element: lazy_(() => import("@/components/pages/HomePage")) },
      { path: ROUTES.SEARCH,        element: lazy_(() => import("@/components/pages/SearchPage")) },
      { path: ROUTES.FLIGHT_SEARCH, element: lazy_(() => import("@/components/pages/FlightSearchPage")) },
      { path: ROUTES.FLIGHT_SEATS,  element: lazy_(() => import("@/components/pages/FlightSeatsPage")) },
      { path: ROUTES.CHECKOUT,      element: lazy_(() => import("@/components/pages/CheckoutPage")) },
      { path: ROUTES.ROOM_DETAIL,   element: lazy_(() => import("@/components/pages/RoomDetailPage")) },
      { path: ROUTES.FLIGHT_PAYMENT, element: lazy_(() => import("@/components/pages/FlightPaymentPage")) },
      { path: ROUTES.BUS_PAYMENT,   element: lazy_(() => import("@/components/pages/BusPaymentPage")) },

      // Protected user routes
      {
        element: <PrivateRoute />,
        children: [
          { path: ROUTES.DASHBOARD,            element: lazy_(() => import("@/components/pages/DashboardPage")) },
          { path: ROUTES.PROFILE,              element: lazy_(() => import("@/components/pages/ProfilePage")) },
          { path: ROUTES.BOOKING,              element: lazy_(() => import("@/components/pages/BookingPage")) },
          { path: ROUTES.BOOKING_CONFIRMATION, element: lazy_(() => import("@/components/pages/BookingConfirmationPage")) },
          { path: ROUTES.BOOKING_FAILURE,      element: lazy_(() => import("@/components/pages/BookingFailurePage")) },
          { path: ROUTES.BOOKING_HISTORY,      element: lazy_(() => import("@/components/pages/BookingHistoryPage")) },
        ],
      },

      // Protected admin routes
      {
        element: <AdminRoute />,
        children: [
          { path: ROUTES.ADMIN,          element: lazy_(() => import("@/components/pages/AdminPage")) },
          { path: ROUTES.ADMIN_FLIGHTS,  element: lazy_(() => import("@/components/pages/AdminPage")) },
          { path: ROUTES.ADMIN_BOOKINGS, element: lazy_(() => import("@/components/pages/AdminPage")) },
          { path: ROUTES.ADMIN_USERS,    element: lazy_(() => import("@/components/pages/AdminPage")) },
        ],
      },
    ],
  },

  { path: "/", element: <Navigate to={ROUTES.HOME} replace /> },
  { path: ROUTES.NOT_FOUND, element: lazy_(() => import("@/components/pages/NotFoundPage")) },
]);
