const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

// search
router.get("/search", carController.searchCar);

// location
router.get("/location", carController.getCarByLocation);

module.exports = router;