// src/constants/routes.js
export const ROUTES = {
  HOME:        "/",
  LOGIN:       "/login",
  REGISTER:    "/register",
  FORGOT_PW:   "/forgot-password",
  VERIFY_OTP:  "/verify-otp",          // ← màn nhập mã 6 số
  RESET_PW:    "/reset-password",      // ← không dùng :token, token truyền qua state
  DASHBOARD:   "/dashboard",
  PROFILE:     "/profile",
  SEARCH:      "/search",
  ROOM_DETAIL: "/rooms/:id",
  BOOKING:     "/booking",
  BOOKING_HISTORY: "/booking-history",
  NOT_FOUND:   "*",
};