// src/services/carService.js
import api from "./Axiosinstance";

const carService = {
  /**
   * GET /api/cars/location?location=...
   * Lấy danh sách xe theo vị trí.
   */
  getCarsByLocation: async (location) => {
    const res = await api.get("/cars/location", { params: { location } });
    return res.data;
  },

  /**
   * GET /api/cars
   * Lấy toàn bộ danh sách xe (admin / browse).
   */
  getAllCars: async (filters = {}) => {
    const res = await api.get("/cars", { params: filters });
    return res.data;
  },

  /**
   * GET /api/cars/:id
   * Lấy chi tiết một xe.
   */
  getCarById: async (carId) => {
    const res = await api.get(`/cars/${carId}`);
    return res.data;
  },

  /**
   * POST /api/cars (admin only)
   * Tạo xe mới.
   */
  createCar: async (carData) => {
    const res = await api.post("/cars", carData);
    return res.data;
  },

  /**
   * PUT /api/cars/:id (admin only)
   * Cập nhật thông tin xe.
   */
  updateCar: async (carId, carData) => {
    const res = await api.put(`/cars/${carId}`, carData);
    return res.data;
  },

  /**
   * DELETE /api/cars/:id (admin only)
   * Xóa xe.
   */
  deleteCar: async (carId) => {
    const res = await api.delete(`/cars/${carId}`);
    return res.data;
  },
};

export default carService;
