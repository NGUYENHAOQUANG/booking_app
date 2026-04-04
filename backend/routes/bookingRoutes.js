// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes require authentication
router.use(protect);

// ─── USER ROUTES ──────────────────────────────────────────────────────────────

// GET  /api/bookings/my  → booking history (Trang lịch sử đặt vé)
router.get('/my', bookingController.getMyBookings);

// POST /api/bookings    → create new booking (Trang Thông tin thanh toán)
router.post('/', bookingController.createBooking);

// GET  /api/bookings/:id  → booking detail (Trang trạng thái thanh toán)
router.get('/:id', bookingController.getBookingById);

// PUT  /api/bookings/:id/confirm-payment  → confirm after payment success
router.put('/:id/confirm-payment', bookingController.confirmPayment);

// PUT  /api/bookings/:id/cancel  → cancel a booking
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
