import { create } from "zustand";
import { authService } from "@/services/authService";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/config";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || null,
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || null,
  loading: false,

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken });
  },

  setUser: (user) => set({ user }),

  login: async (credentials) => {
    set({ loading: true });
    try {
      const { data } = await authService.login(credentials);
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Đăng nhập thất bại" };
    } finally {
      set({ loading: false });
    }
  },

  register: async (formData) => {
    set({ loading: true });
    try {
      await authService.register(formData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Đăng ký thất bại" };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try { await authService.logout(); } catch (e) { /* ignore */ }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
  },

  fetchMe: async () => {
    if (!localStorage.getItem(ACCESS_TOKEN_KEY)) return;
    try {
      const { data } = await authService.getMe();
      set({ user: data.user });
    } catch (error) {
      // Nếu lỗi 401 thì axios interceptor sẽ xử lý refresh token
      // Nếu vẫn lỗi thì logout
      if (error.response?.status === 401) {
        // useAuthStore.getState().logout();
      }
    }
  },
}));

export default useAuthStore;
