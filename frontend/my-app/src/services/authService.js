// src/services/authService.js
import api from "./Axiosinstance";

export const authService = {
  register:       (data)        => api.post("/auth/register", data, { bypassAuthInterceptor: true }),
  login:          (data)        => api.post("/auth/login", data, { bypassAuthInterceptor: true }),
  logout:         ()            => api.post("/auth/logout", {}, { bypassAuthInterceptor: true }),
  refreshToken:   ()            => api.post("/auth/refresh-token", {}, { bypassAuthInterceptor: true }),
  getMe:          ()            => api.get("/auth/me"),

  forgotPassword: (email)       => api.post("/auth/forgot-password", { email }, { bypassAuthInterceptor: true }),
  verifyOTP:      (data)        => api.post("/auth/forgot-password/verify-otp", data, { bypassAuthInterceptor: true }),
  resetPassword:  (data)        => api.patch("/auth/reset-password", data, { bypassAuthInterceptor: true }),
  changePassword: (data)        => api.patch("/auth/change-password", data),
};