const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// Public bus trip data
router.get('/', busController.getBusTrips);
router.get('/:id', busController.getBusTripById);
router.get('/:id/seats', busController.getBusSeatMap);

// Bus booking flow
router.post('/bookings', busController.createBusBooking);
router.get('/bookings/:id', busController.getBusBookingById);
router.put('/bookings/:id/confirm-payment', busController.confirmBusPayment);

module.exports = router;
