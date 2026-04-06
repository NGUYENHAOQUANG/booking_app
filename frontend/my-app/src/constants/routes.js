// src/constants/routes.js
export const ROUTES = {
  HOME:                 "/",
  LOGIN:                "/login",
  REGISTER:             "/register",
  FORGOT_PW:            "/forgot-password",
  VERIFY_OTP:           "/verify-otp",        // Màn nhập mã 6 số
  RESET_PW:             "/reset-password",    // Token truyền qua state

  // ── Main pages ──────────────────────────────────────────────────
  SEARCH:               "/search",            // Tìm kiếm phòng / chỗ ở
  ROOM_DETAIL:          "/rooms/:id",

  // ── Flight ──────────────────────────────────────────────────────
  FLIGHT_SEARCH:        "/flights",           // Trang tìm kiếm chuyến bay
  FLIGHT_SEATS:         "/flight-seats/:flightId", // Chọn ghế
  FLIGHT_PAYMENT:       "/flight-payment",    // Thông tin thanh toán vé máy bay
  CHECKOUT:             "/checkout",          // Checkout (không yêu cầu đăng nhập)

  // ── Bus ─────────────────────────────────────────────────────────
  BUS_SEARCH:           "/buses",             // Tìm kiếm xe khách
  BUS_SEATS:            "/bus-seats",         // Chọn ghế xe khách
  BUS_CUSTOMER_INFO:    "/bus-customer-info", // Nhập thông tin khách hàng xe khách

  // ── User (protected) ─────────────────────────────────────────────
  DASHBOARD:            "/dashboard",
  PROFILE:              "/profile",
  BOOKING:              "/booking",
  BOOKING_CONFIRMATION: "/booking-confirmation",
  BOOKING_FAILURE:      "/booking-failure",
  BOOKING_HISTORY:      "/booking-history",

  // ── Admin (protected + role admin) ───────────────────────────────
  ADMIN:                "/admin",
  ADMIN_FLIGHTS:        "/admin/flights",
  ADMIN_BOOKINGS:       "/admin/bookings",
  ADMIN_USERS:          "/admin/users",

  NOT_FOUND:            "*",
};
