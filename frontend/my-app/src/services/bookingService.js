// src/services/bookingService.js
import api from "./Axiosinstance";

const bookingService = {
  /**
   * POST /api/bookings
   * Tạo đặt vé mới sau khi user nhập thông tin thanh toán.
   */
  createBooking: async (bookingData) => {
    const res = await api.post("/bookings", bookingData);
    return res.data;
  },

  /**
   * PUT /api/bookings/:id/confirm-payment
   * Xác nhận thanh toán thành công từ gateway.
   */
  confirmPayment: async (bookingId, { transactionId, method }) => {
    const res = await api.put(`/bookings/${bookingId}/confirm-payment`, {
      transactionId,
      method,
    });
    return res.data;
  },

  /**
   * GET /api/bookings/my
   * Lấy lịch sử đặt vé của người dùng hiện tại.
   */
  getMyBookings: async ({ status, page = 1, limit = 10 } = {}) => {
    const res = await api.get("/bookings/my", {
      params: { status, page, limit },
    });
    return res.data;
  },

  /**
   * GET /api/bookings/:id
   * Lấy chi tiết một booking theo ID.
   */
  getBookingById: async (bookingId) => {
    const res = await api.get(`/bookings/${bookingId}`);
    return res.data;
  },

  /**
   * PUT /api/bookings/:id/cancel
   * Hủy một booking.
   */
  cancelBooking: async (bookingId, reason = "") => {
    const res = await api.put(`/bookings/${bookingId}/cancel`, { reason });
    return res.data;
  },
};

export default bookingService;
