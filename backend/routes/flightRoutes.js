// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/flights/airports?q=han  → search airports for autocomplete
router.get('/airports', flightController.getAirports);

// GET /api/flights/airlines  → list all airlines
router.get('/airlines', flightController.getAirlines);

// GET /api/flights  → get all public flights for testing/UI setup
router.get('/', flightController.getAllFlights);

// POST /api/flights/search  → search available flights
router.post('/search', flightController.searchFlights);

// GET /api/flights/:id  → get flight detail
router.get('/:id', flightController.getFlightById);

// GET /api/flights/:id/seats  → get seat map for a flight
router.get('/:id/seats', flightController.getSeatMap);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
// POST /api/flights  → create a new flight (admin only)
router.post('/', protect, restrictTo('admin', 'superadmin'), flightController.createFlight);

// PUT /api/flights/:id  → update flight (admin only)
router.put('/:id', protect, restrictTo('admin', 'superadmin'), flightController.updateFlight);

module.exports = router;
