const BusTrip = require('../models/BusTrip');
const BusSeat = require('../models/BusSeat');
const BusBooking = require('../models/BusBooking');

exports.getBusTrips = async (req, res) => {
  try {
    const { origin, destination, date, passengers = 1 } = req.query;
    const filter = {
      isActive: true,
      availableSeats: { $gte: Number(passengers) || 1 },
    };

    if (origin) {
      filter.origin = { $regex: origin, $options: 'i' };
    }
    if (destination) {
      filter.destination = { $regex: destination, $options: 'i' };
    }
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: start, $lte: end };
    }

    const trips = await BusTrip.find(filter).sort({ departureTime: 1 });
    res.json({ success: true, data: trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBusTripById = async (req, res) => {
  try {
    const trip = await BusTrip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến xe' });
    }
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBusSeatMap = async (req, res) => {
  try {
    const seats = await BusSeat.find({ trip: req.params.id }).sort({ row: 1, column: 1 });
    if (!seats.length) {
      return res.status(404).json({ success: false, message: 'Không có dữ liệu ghế cho chuyến xe này' });
    }
    res.json({ success: true, data: seats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBusBooking = async (req, res) => {
  try {
    const { tripId, contactInfo, passengers, pricing, payment } = req.body;

    const trip = await BusTrip.findById(tripId);
    if (!trip || !trip.isActive) {
      return res.status(400).json({ success: false, message: 'Chuyến xe không khả dụng' });
    }

    const selectedSeats = passengers.map((p) => p.seatNumber).filter(Boolean);
    if (!selectedSeats.length) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn ghế' });
    }

    const seatDocs = await BusSeat.find({
      trip: tripId,
      seatNumber: { $in: selectedSeats },
      status: 'available',
    });

    if (seatDocs.length !== selectedSeats.length) {
      return res.status(400).json({ success: false, message: 'Một số ghế đã được đặt, vui lòng chọn lại' });
    }

    const booking = await BusBooking.create({
      user: req.user?._id,
      trip: tripId,
      contactInfo,
      passengers,
      pricing,
      payment: {
        method: payment?.method || 'momo',
        status: 'pending',
      },
      status: 'pending',
    });

    await BusSeat.updateMany(
      { trip: tripId, seatNumber: { $in: selectedSeats } },
      { $set: { status: 'reserved' } },
    );

    await BusTrip.findByIdAndUpdate(tripId, {
      $inc: { availableSeats: -selectedSeats.length },
    });

    const populated = await BusBooking.findById(booking._id).populate('trip');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.confirmBusPayment = async (req, res) => {
  try {
    const { transactionId, method } = req.body;
    const booking = await BusBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đặt chỗ xe khách' });
    }

    if (booking.payment.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Đơn này đã thanh toán' });
    }

    booking.payment.status = 'paid';
    booking.payment.transactionId = transactionId || '';
    booking.payment.method = method || booking.payment.method;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';
    booking.ticketIssuedAt = new Date();
    await booking.save();

    const seatNumbers = booking.passengers.map((p) => p.seatNumber);
    await BusSeat.updateMany(
      { trip: booking.trip, seatNumber: { $in: seatNumbers } },
      { $set: { status: 'booked' } },
    );

    const populated = await BusBooking.findById(booking._id).populate('trip');
    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBusBookingById = async (req, res) => {
  try {
    const booking = await BusBooking.findById(req.params.id).populate('trip');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đặt chỗ xe khách' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
