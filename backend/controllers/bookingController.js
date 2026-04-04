// controllers/bookingController.js
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Seat = require('../models/Seat');

// ─── CREATE BOOKING ───────────────────────────────────────────────────────────
/**
 * POST /api/bookings
 * Creates booking after payment info is submitted (Trang Thông tin thanh toán)
 */
exports.createBooking = async (req, res) => {
  try {
    const {
      tripType,
      outboundFlight,
      returnFlight,
      passengers,
      contactInfo,
      addOns,
      pricing,
      payment,
    } = req.body;

    // Validate outbound flight exists and has availability
    const flight = await Flight.findById(outboundFlight.flight);
    if (!flight || flight.status !== 'scheduled') {
      return res.status(400).json({ success: false, message: 'Chuyến bay không khả dụng' });
    }

    // Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      tripType,
      outboundFlight,
      returnFlight: tripType === 'round_trip' ? returnFlight : undefined,
      passengers,
      contactInfo,
      addOns,
      pricing,
      payment: { ...payment, status: 'pending' },
      status: 'pending',
    });

    // Reduce available seats count in fare class
    await decreaseAvailableSeats(
      outboundFlight.flight,
      outboundFlight.fareClass,
      passengers.length
    );

    if (tripType === 'round_trip' && returnFlight?.flight) {
      await decreaseAvailableSeats(
        returnFlight.flight,
        returnFlight.fareClass,
        passengers.length
      );
    }

    // Mark selected seats as reserved
    const seatNumbers = passengers
      .map((p) => p.seatOutbound)
      .filter(Boolean);

    if (seatNumbers.length) {
      await Seat.updateMany(
        { flight: outboundFlight.flight, seatNumber: { $in: seatNumbers } },
        { $set: { status: 'reserved' } }
      );
    }

    const populated = await Booking.findById(booking._id)
      .populate('outboundFlight.flight', 'flightNumber departureTime arrivalTime')
      .populate('user', 'fullName email');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── CONFIRM PAYMENT ──────────────────────────────────────────────────────────
/**
 * PUT /api/bookings/:id/confirm-payment
 * Called after payment gateway callback to confirm a booking
 * (Trang trạng thái thanh toán - success state)
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { transactionId, method } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đặt vé' });
    }

    if (booking.payment.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Đặt vé đã được thanh toán' });
    }

    booking.payment.status = 'paid';
    booking.payment.transactionId = transactionId || '';
    booking.payment.method = method || booking.payment.method;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';
    booking.ticketIssuedAt = new Date();

    // Mark seats as booked (finalized)
    const seatNumbers = booking.passengers.map((p) => p.seatOutbound).filter(Boolean);
    if (seatNumbers.length) {
      await Seat.updateMany(
        { flight: booking.outboundFlight.flight, seatNumber: { $in: seatNumbers } },
        { $set: { status: 'booked' } }
      );
    }

    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET MY BOOKINGS ──────────────────────────────────────────────────────────
/**
 * GET /api/bookings/my
 * Returns the current user's booking history (Trang lịch sử đặt vé)
 */
exports.getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate({
          path: 'outboundFlight.flight',
          select: 'flightNumber departureTime arrivalTime duration',
          populate: [
            { path: 'origin', select: 'code city name' },
            { path: 'destination', select: 'code city name' },
            { path: 'airline', select: 'code name logo' },
          ],
        })
        .populate({
          path: 'returnFlight.flight',
          select: 'flightNumber departureTime arrivalTime duration',
          populate: [
            { path: 'origin', select: 'code city name' },
            { path: 'destination', select: 'code city name' },
            { path: 'airline', select: 'code name logo' },
          ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET BOOKING DETAIL ───────────────────────────────────────────────────────
/**
 * GET /api/bookings/:id
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate({
        path: 'outboundFlight.flight',
        populate: [
          { path: 'origin', select: 'code city name country' },
          { path: 'destination', select: 'code city name country' },
          { path: 'airline', select: 'code name logo' },
        ],
      })
      .populate({
        path: 'returnFlight.flight',
        populate: [
          { path: 'origin', select: 'code city name country' },
          { path: 'destination', select: 'code city name country' },
          { path: 'airline', select: 'code name logo' },
        ],
      });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đặt vé' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CANCEL BOOKING ───────────────────────────────────────────────────────────
/**
 * PUT /api/bookings/:id/cancel
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đặt vé' });
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Không thể hủy đặt vé này' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason || '';
    booking.cancelledAt = new Date();

    // Restore seat availability
    await increaseAvailableSeats(
      booking.outboundFlight.flight,
      booking.outboundFlight.fareClass,
      booking.passengers.length
    );

    // Free up reserved/booked seats
    const seatNumbers = booking.passengers.map((p) => p.seatOutbound).filter(Boolean);
    if (seatNumbers.length) {
      await Seat.updateMany(
        { flight: booking.outboundFlight.flight, seatNumber: { $in: seatNumbers } },
        { $set: { status: 'available' } }
      );
    }

    await booking.save();
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function decreaseAvailableSeats(flightId, fareClassCode, count) {
  await Flight.findOneAndUpdate(
    { _id: flightId, 'fareClasses.code': fareClassCode },
    { $inc: { 'fareClasses.$.availableSeats': -count } }
  );
}

async function increaseAvailableSeats(flightId, fareClassCode, count) {
  await Flight.findOneAndUpdate(
    { _id: flightId, 'fareClasses.code': fareClassCode },
    { $inc: { 'fareClasses.$.availableSeats': count } }
  );
}
