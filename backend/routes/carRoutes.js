// routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// GET /api/cars/location?location=Hà Nội
router.get('/location', carController.getCarsByLocation);

module.exports = router;

module.exports = router;
>>>>>>> bdfbf20e08b3293f4c3f4358b55e9a16f5534652
