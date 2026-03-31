import { create } from "zustand";
import Cookies from "js-cookie";
import { authService } from "@/services/authService";

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: Cookies.get(import.meta.env.VITE_IS_LOGGED_IN_KEY) === "true",
  loading: false,

  setUser: (user) => set({ user, isLoggedIn: true }),

  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await authService.login(credentials);
      // Backend trả về { success: true, data: { user }, ... }
      if (response.data.success) {
        set({ user: response.data.data.user, isLoggedIn: true });
        return { success: true };
      }
      return { success: false, error: response.data.message || "Đăng nhập thất bại" };
    } catch (error) {
      // Ưu tiên lấy message chi tiết từ Backend
      const msg = error.response?.data?.message || error.message || "Lỗi kết nối máy chủ";
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  register: async (formData) => {
    set({ loading: true });
    try {
      const response = await authService.register(formData);
      if (response.data.success) {
        set({ user: response.data.data.user, isLoggedIn: true });
        return { success: true };
      }
      return { success: false, error: response.data.message || "Đăng ký thất bại" };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Lỗi kết nối máy chủ";
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  logout: async (skipApi = false) => {
    // 1. Xóa state ngay lập tức (UI phản hồi tức thì)
    set({ user: null, isLoggedIn: false });
    Cookies.remove(import.meta.env.VITE_IS_LOGGED_IN_KEY);

    if (skipApi) return;

    // 2. Gọi logout backend (Nếu 401 thì axios interceptor đã chặn loop)
    try { 
      await authService.logout(); 
    } catch (e) { 
      console.warn("Backend logout failed or session already dead"); 
    }
  },

  fetchMe: async () => {
    if (!Cookies.get(import.meta.env.VITE_IS_LOGGED_IN_KEY)) return;
    try {
      const response = await authService.getMe();
      if (response.data.success) {
        set({ user: response.data.data.user, isLoggedIn: true });
      } else {
        set({ user: null, isLoggedIn: false });
        Cookies.remove(import.meta.env.VITE_IS_LOGGED_IN_KEY);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        set({ user: null, isLoggedIn: false });
        Cookies.remove(import.meta.env.VITE_IS_LOGGED_IN_KEY);
      }
    }
  },
}));

export default useAuthStore;
