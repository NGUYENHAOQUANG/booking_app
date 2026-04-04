// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(protect);

// GET  /api/users/me          → get profile (Profile screen)
router.get('/me', userController.getProfile);

// PUT  /api/users/me          → update profile
router.put('/me', userController.updateProfile);

// PUT  /api/users/me/change-password  → change password
router.put('/me/change-password', userController.changePassword);

// GET  /api/users/me/stats    → get booking stats for profile
router.get('/me/stats', userController.getMyStats);

module.exports = router;
