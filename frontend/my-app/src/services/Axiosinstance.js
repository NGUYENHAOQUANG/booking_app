import axios from "axios";
import { API_BASE_URL } from "@/constants/config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Quan trọng: Cho phép gửi và nhận Cookies
});

// ── Response: tự refresh token khi gặp 401 ───────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (original?.bypassAuthInterceptor) {
      return Promise.reject(error);
    }

    // ✅ ĐÃ SỬA: Phân loại RÕ RÀNG từng nhóm Route để tránh dẫm chân lên nhau
    const isLoginOrRegister = ["login", "register"].some(keyword => original.url?.includes(keyword));
    const isLogoutRoute = original.url?.includes("logout");
    const isRefreshTokenRoute = original.url?.includes("refresh-token");

    const isUnauthorized = error.response?.status === 401;
    const isUnprocessable = error.response?.status === 422;

    // 🛑 TRƯỜNG HỢP 1: Đăng nhập / Đăng ký bị lỗi (VD: Sai pass, tài khoản không tồn tại)
    // -> Ném thẳng lỗi về để UI tự hiển thị, tuyệt đối không gọi refresh-token hay logout!
    if (isLoginOrRegister) {
      return Promise.reject(error);
    }

    // 🔄 TRƯỜNG HỢP 2: Lỗi 401 ở các API thông thường (VD: lấy profile, fetch data...)
    // -> Tiến hành gọi Refresh Token
    if (isUnauthorized && !original._retry && !isLogoutRoute && !isRefreshTokenRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then(() => api(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });

        if (response.data.success) {
          processQueue(null);
          return api(original); // Gọi lại API ban đầu
        }
        throw new Error("Refresh failed");
      } catch (err) {
        processQueue(err);
        const { default: useAuthStore } = await import("@/store/authStore");

        // Refresh thất bại -> Clear state và đuổi về login
        useAuthStore.getState().logout(true);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 🚪 TRƯỜNG HỢP 3: Lỗi xuất phát từ chính API Refresh Token hoặc Logout
    // -> Báo hiệu phiên đăng nhập đã "chết" hoàn toàn, đá về Login
    if ((isRefreshTokenRoute || isLogoutRoute) && (isUnauthorized || isUnprocessable)) {
      const { default: useAuthStore } = await import("@/store/authStore");
      useAuthStore.getState().logout(true);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Trả về lỗi mặc định cho tất cả các trường hợp HTTP Error khác (400, 403, 404, 500...)
    return Promise.reject(error);
  }
);

export default api;