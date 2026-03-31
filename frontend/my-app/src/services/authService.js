// src/services/authService.js
import api from "./axiosInstance";

export const authService = {
  register:       (data)        => api.post("/auth/register", data),
  login:          (data)        => api.post("/auth/login", data),
  logout:         ()            => api.post("/auth/logout"),
  refreshToken:   (data)        => api.post("/auth/refresh-token", data),
  getMe:          ()            => api.get("/auth/me"),

  forgotPassword: (email)       => api.post("/auth/forgot-password", { email }),
  verifyOTP:      (data)        => api.post("/auth/verify-otp", data),       // { email, code }
  resetPassword:  (code, data)  => api.patch(`/auth/reset-password/${code}`, data),
  changePassword: (data)        => api.patch("/auth/change-password", data),
};