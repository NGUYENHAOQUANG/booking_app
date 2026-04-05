// controllers/flightController.js
const Flight = require('../models/Flight');
const Airport = require('../models/Airport');
const Airline = require('../models/Airline');
const Seat = require('../models/Seat');

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find({
      status: 'scheduled',
      isActive: true,
    })
      .populate('airline', 'code name logo')
      .populate('origin', 'code name city')
      .populate('destination', 'code name city')
      .sort({ departureTime: 1 })
      .limit(50);
    res.status(200).json({ success: true, flights });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// ─── SEARCH FLIGHTS ──────────────────────────────────────────────────────────
/**
 * POST /api/flights/search
 * Body: { origin, destination, departureDate, returnDate?, passengers: { adults, children, infants }, tripType }
 */
exports.searchFlights = async (req, res) => {
  try {
    const {
      origin,         // airport code e.g. "HAN"
      destination,    // airport code e.g. "SGN"
      departureDate,
      returnDate,
      tripType = 'one_way',
      passengers = { adults: 1, children: 0, infants: 0 },
    } = req.body;

    // Find airports by IATA code
    const [originAirport, destAirport] = await Promise.all([
      Airport.findOne({ code: origin.toUpperCase(), isActive: true }),
      Airport.findOne({ code: destination.toUpperCase(), isActive: true }),
    ]);

    if (!originAirport || !destAirport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bay',
      });
    }

    // Build date range for search (the whole departure day)
    const depStart = new Date(departureDate);
    depStart.setHours(0, 0, 0, 0);
    const depEnd = new Date(departureDate);
    depEnd.setHours(23, 59, 59, 999);

    const totalPassengers =
      (passengers.adults || 1) + (passengers.children || 0);

    // Query outbound flights
    const outboundFlights = await Flight.find({
      origin: originAirport._id,
      destination: destAirport._id,
      departureTime: { $gte: depStart, $lte: depEnd },
      status: 'scheduled',
      isActive: true,
      'fareClasses.availableSeats': { $gte: totalPassengers },
    })
      .populate('airline', 'code name logo')
      .populate('origin', 'code name city')
      .populate('destination', 'code name city')
      .sort({ departureTime: 1 });

    const result = { outboundFlights };

    // If round trip, also fetch return flights
    if (tripType === 'round_trip' && returnDate) {
      const retStart = new Date(returnDate);
      retStart.setHours(0, 0, 0, 0);
      const retEnd = new Date(returnDate);
      retEnd.setHours(23, 59, 59, 999);

      const returnFlights = await Flight.find({
        origin: destAirport._id,
        destination: originAirport._id,
        departureTime: { $gte: retStart, $lte: retEnd },
        status: 'scheduled',
        isActive: true,
        'fareClasses.availableSeats': { $gte: totalPassengers },
      })
        .populate('airline', 'code name logo')
        .populate('origin', 'code name city')
        .populate('destination', 'code name city')
        .sort({ departureTime: 1 });

      result.returnFlights = returnFlights;
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET FLIGHT DETAIL ────────────────────────────────────────────────────────
/**
 * GET /api/flights/:id
 */
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id)
      .populate('airline', 'code name logo')
      .populate('origin', 'code name city country')
      .populate('destination', 'code name city country');

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến bay' });
    }

    res.json({ success: true, data: flight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET SEAT MAP ─────────────────────────────────────────────────────────────
/**
 * GET /api/flights/:id/seats
 * Returns seat layout for the seat selection screen
 */
exports.getSeatMap = async (req, res) => {
  try {
    const seats = await Seat.find({ flight: req.params.id }).sort({ row: 1, column: 1 });

    if (!seats.length) {
      return res.status(404).json({ success: false, message: 'Không có dữ liệu ghế cho chuyến bay này' });
    }

    res.json({ success: true, data: seats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ALL AIRPORTS ─────────────────────────────────────────────────────────
/**
 * GET /api/flights/airports
 */
exports.getAirports = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { isActive: true };
    if (q) {
      filter.$or = [
        { code: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
      ];
    }
    const airports = await Airport.find(filter).sort({ city: 1 });
    res.json({ success: true, data: airports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADMIN: CREATE FLIGHT ──────────────────────────────────────────────────────
/**
 * POST /api/flights  (admin only)
 */
exports.createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── ADMIN: UPDATE FLIGHT ──────────────────────────────────────────────────────
/**
 * PUT /api/flights/:id  (admin only)
 */
exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến bay' });
    }
    res.json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── GET ALL AIRLINES ──────────────────────────────────────────────────────────
/**
 * GET /api/flights/airlines
 * Returns list of all airlines (for filter UI on search page)
 */
exports.getAirlines = async (req, res) => {
  try {
    const airlines = await Airline.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: airlines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
