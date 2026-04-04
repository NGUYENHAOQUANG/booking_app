// routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// GET /api/cars/location?location=Hà Nội
router.get('/location', carController.getCarsByLocation);

module.exports = router;
