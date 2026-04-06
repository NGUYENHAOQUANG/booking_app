// routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/cars/location?location=Hà Nội
router.get('/location', carController.getCarsByLocation);

// GET /api/cars             — Lấy tất cả xe (với filter/pagination)
router.get('/',    carController.getAllCars);

// GET /api/cars/:id         — Chi tiết một xe
router.get('/:id', carController.getCarById);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// POST   /api/cars         — Tạo xe mới
router.post('/', protect, restrictTo('admin', 'superadmin'), carController.createCar);

// PUT    /api/cars/:id     — Cập nhật xe
router.put('/:id', protect, restrictTo('admin', 'superadmin'), carController.updateCar);

// DELETE /api/cars/:id     — Xóa xe (soft delete)
router.delete('/:id', protect, restrictTo('admin', 'superadmin'), carController.deleteCar);

module.exports = router;
