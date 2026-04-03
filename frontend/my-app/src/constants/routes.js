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
  PAYMENT:        "/payment", // Để lại cho tương thích (hoặc xoá)
  FLIGHT_PAYMENT: "/payment/flight",
  BUS_PAYMENT:    "/payment/bus",
  NOT_FOUND:      "*",
};