// src/services/userService.js
import api from "./Axiosinstance";

const userService = {
  /**
   * GET /api/users/profile
   * Lấy thông tin profile của người dùng hiện tại.
   */
  getProfile: async () => {
    const res = await api.get("/users/profile");
    return res.data;
  },

  /**
   * PUT /api/users/profile
   * Cập nhật thông tin profile.
   */
  updateProfile: async (profileData) => {
    const res = await api.put("/users/profile", profileData);
    return res.data;
  },

  /**
   * GET /api/users  (admin only)
   * Lấy danh sách toàn bộ người dùng.
   */
  getAllUsers: async ({ page = 1, limit = 20, q } = {}) => {
    const res = await api.get("/users", { params: { page, limit, q } });
    return res.data;
  },

  /**
   * PUT /api/users/:id/role  (admin only)
   * Thay đổi role người dùng.
   */
  updateUserRole: async (userId, role) => {
    const res = await api.put(`/users/${userId}/role`, { role });
    return res.data;
  },
};

export default userService;
