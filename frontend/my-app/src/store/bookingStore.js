// src/store/bookingStore.js
import { create } from "zustand";
import bookingService from "@/services/bookingService";

const useBookingStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────────────────────
  bookings: [],
  currentBooking: null,
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },
  loading: false,
  error: null,

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Lấy danh sách đặt vé của người dùng hiện tại */
  fetchMyBookings: async ({ status, page = 1, limit = 10 } = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await bookingService.getMyBookings({ status, page, limit });
      if (res.success) {
        set({
          bookings: res.data,
          pagination: res.pagination,
        });
      }
    } catch (err) {
      set({ error: err?.message || "Lỗi khi tải dữ liệu đặt vé" });
    } finally {
      set({ loading: false });
    }
  },

  /** Lấy chi tiết một booking */
  fetchBookingById: async (id) => {
    set({ loading: true, error: null, currentBooking: null });
    try {
      const res = await bookingService.getBookingById(id);
      if (res.success) {
        set({ currentBooking: res.data });
      }
    } catch (err) {
      set({ error: err?.message || "Không tìm thấy đặt vé" });
    } finally {
      set({ loading: false });
    }
  },

  /** Tạo booking mới */
  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const res = await bookingService.createBooking(bookingData);
      if (res.success) {
        set({ currentBooking: res.data });
        return { success: true, data: res.data };
      }
      return { success: false, error: res.message };
    } catch (err) {
      const msg = err?.message || "Tạo đặt vé thất bại";
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  /** Xác nhận thanh toán */
  confirmPayment: async (bookingId, paymentData) => {
    set({ loading: true, error: null });
    try {
      const res = await bookingService.confirmPayment(bookingId, paymentData);
      if (res.success) {
        set({ currentBooking: res.data });
        return { success: true, data: res.data };
      }
      return { success: false, error: res.message };
    } catch (err) {
      const msg = err?.message || "Xác nhận thanh toán thất bại";
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  /** Hủy booking */
  cancelBooking: async (bookingId, reason) => {
    set({ loading: true, error: null });
    try {
      const res = await bookingService.cancelBooking(bookingId, reason);
      if (res.success) {
        // Cập nhật danh sách bookings nếu đang xem
        const bookings = get().bookings.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        );
        set({ bookings, currentBooking: res.data });
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      const msg = err?.message || "Hủy đặt vé thất bại";
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  /** Reset state */
  reset: () => set({ bookings: [], currentBooking: null, error: null }),
}));

export default useBookingStore;
