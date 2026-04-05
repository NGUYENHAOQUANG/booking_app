// controllers/userController.js
const User = require('../models/User');
const Booking = require('../models/Booking');

// ─── GET MY PROFILE ───────────────────────────────────────────────────────────
/**
 * GET /api/users/me  hoặc  GET /api/users/profile
 * Trả về profile người dùng hiện tại (màn hình Profile).
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('role', 'name displayName');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPDATE MY PROFILE ────────────────────────────────────────────────────────
/**
 * PUT /api/users/me  hoặc  PUT /api/users/profile
 * Cập nhật họ tên, số điện thoại (màn hình chỉnh sửa Profile).
 */
exports.updateProfile = async (req, res) => {
  try {
    // Chỉ cho phép cập nhật các field an toàn
    const ALLOWED_FIELDS = ['fullName', 'phoneNumber', 'gender', 'birthDate', 'city', 'allowPromotions'];
    const updates = {};
    ALLOWED_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).populate('role', 'name displayName');

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
/**
 * PUT /api/users/me/change-password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── GET MY STATS ─────────────────────────────────────────────────────────────
/**
 * GET /api/users/me/stats
 * Trả về thống kê nhanh hiển thị trên profile (tổng số chuyến, v.v.).
 */
exports.getMyStats = async (req, res) => {
  try {
    const [total, confirmed, cancelled] = await Promise.all([
      Booking.countDocuments({ user: req.user._id }),
      Booking.countDocuments({ user: req.user._id, status: 'confirmed' }),
      Booking.countDocuments({ user: req.user._id, status: 'cancelled' }),
    ]);

    res.json({
      success: true,
      data: {
        totalBookings: total,
        confirmedBookings: confirmed,
        cancelledBookings: cancelled,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADMIN: GET ALL USERS ─────────────────────────────────────────────────────
/**
 * GET /api/users?page=1&limit=20&q=
 * Lấy danh sách tất cả người dùng (admin only).
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .populate('role', 'name displayName')
        .select('-password -refreshToken -passwordResetOtp')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADMIN: UPDATE USER ROLE ──────────────────────────────────────────────────
/**
 * PUT /api/users/:id/role
 * Thay đổi role người dùng (admin only).
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: roleId },
      { new: true }
    ).populate('role', 'name displayName');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── ADMIN: TOGGLE USER STATUS ──────────────────────────────────────────────
/**
 * PUT /api/users/:id/toggle-active
 * Kích hoạt / vô hiệu hóa tài khoản người dùng (admin only).
 */
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: { _id: user._id, isActive: user.isActive },
      message: user.isActive ? 'Đã kích hoạt tài khoản' : 'Đã vô hiệu hóa tài khoản',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
