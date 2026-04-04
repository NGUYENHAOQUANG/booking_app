// controllers/userController.js
const User = require('../models/User');
const Booking = require('../models/Booking');

// ─── GET MY PROFILE ───────────────────────────────────────────────────────────
/**
 * GET /api/users/me
 * Returns current user's profile (Profile screen)
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
 * PUT /api/users/me
 * Update name, phone number (Profile screen edit)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;
    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (phoneNumber) updates.phoneNumber = phoneNumber;

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
 * Returns quick stats shown on profile page (total trips, etc.)
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
