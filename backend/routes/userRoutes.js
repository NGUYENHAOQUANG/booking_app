// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// ─── USER ROUTES (require authentication) ─────────────────────────────────────
router.use(protect);

// GET  /api/users/me          → lấy profile (màn hình Profile)
router.get('/me', userController.getProfile);
// alias: /profile
router.get('/profile', userController.getProfile);

// PUT  /api/users/me          → cập nhật profile
router.put('/me', userController.updateProfile);
// alias: /profile
router.put('/profile', userController.updateProfile);

// PUT  /api/users/me/change-password  → đổi mật khẩu
router.put('/me/change-password', userController.changePassword);

// GET  /api/users/me/stats    → thống kê booking cho profile
router.get('/me/stats', userController.getMyStats);

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// GET  /api/users             → danh sách toàn bộ users (admin)
router.get('/', restrictTo('admin', 'superadmin'), userController.getAllUsers);

// PUT  /api/users/:id/role    → thay đổi role (admin)
router.put('/:id/role', restrictTo('admin', 'superadmin'), userController.updateUserRole);

// PUT  /api/users/:id/toggle-active → kích hoạt/vô hiệu hóa tài khoản (admin)
router.put('/:id/toggle-active', restrictTo('admin', 'superadmin'), userController.toggleUserActive);

module.exports = router;
