// controllers/authController.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendPasswordResetEmail } = require("../utils/email");

const JWT_SECRET          = process.env.JWT_SECRET          || "change_this_secret";
const JWT_EXPIRES_IN      = process.env.JWT_EXPIRES_IN      || "15m";
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET  || "change_this_refresh_secret";
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const signAccessToken  = (id) => jwt.sign({ id }, JWT_SECRET,         { expiresIn: JWT_EXPIRES_IN });
const signRefreshToken = (id) => jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });

const sendTokens = async (user, statusCode, res) => {
  const accessToken  = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Lưu refresh token dạng hash vào DB
  const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await User.findByIdAndUpdate(user._id, { refreshToken: hashed });

  user.password     = undefined;
  user.refreshToken = undefined;

  res.status(statusCode).json({ success: true, accessToken, refreshToken, data: { user } });
};

// ─── ĐĂNG KÝ ─────────────────────────────────────────────────────────────────

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    await user.populate("role", "name displayName permissions");
    await sendTokens(user, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ success: false, message: `${field} đã tồn tại` });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── ĐĂNG NHẬP ───────────────────────────────────────────────────────────────

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password +refreshToken")
      .populate("role", "name displayName permissions");

    if (!user)
      return res.status(401).json({ success: false, message: "Email hoặc password không đúng" });

    if (user.isLocked)
      return res.status(423).json({ success: false, message: "Tài khoản bị khóa tạm thời. Thử lại sau 30 phút." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({ success: false, message: "Email hoặc password không đúng" });
    }

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Tài khoản đã bị vô hiệu hóa" });

    await User.findByIdAndUpdate(user._id, {
      $set: { loginAttempts: 0, lastLogin: new Date() },
      $unset: { lockUntil: 1 },
    });

    await sendTokens(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify chữ ký
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Kiểm tra token có khớp với DB không
    const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const user = await User.findOne({ _id: decoded.id, refreshToken: hashed })
      .select("+refreshToken")
      .populate("role", "name displayName permissions");

    if (!user)
      return res.status(401).json({ success: false, message: "Refresh token không hợp lệ" });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Tài khoản đã bị vô hiệu hóa" });

    await sendTokens(user, 200, res);
  } catch (err) {
    res.status(401).json({ success: false, message: "Refresh token hết hạn hoặc không hợp lệ" });
  }
};

// ─── ĐĂNG XUẤT ───────────────────────────────────────────────────────────────

exports.logout = async (req, res) => {
  try {
    // Xóa refresh token → vô hiệu hóa hoàn toàn
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res.status(200).json({ success: true, message: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── QUÊN MẬT KHẨU ───────────────────────────────────────────────────────────

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản với email này" });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetPath = process.env.RESET_PASSWORD_PATH || "/reset-password";
    const normalizedClientUrl = clientUrl.endsWith("/") ? clientUrl.slice(0, -1) : clientUrl;
    const normalizedResetPath = resetPath.startsWith("/") ? resetPath : `/${resetPath}`;
    const resetUrl = `${normalizedClientUrl}${normalizedResetPath}/${resetToken}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        username: user.username,
        resetUrl,
      });
    } catch (mailErr) {
      console.error("Send reset email failed:", mailErr.message);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        success: false,
        message: "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── RESET MẬT KHẨU (từ link email) ──────────────────────────────────────────

exports.resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });

    user.password          = req.body.password;
    user.passwordResetToken   = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken         = undefined; // đăng xuất tất cả thiết bị
    await user.save();

    res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ĐỔI MẬT KHẨU (đang đăng nhập) ──────────────────────────────────────────

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng" });

    user.password     = newPassword;
    user.refreshToken = undefined; // đăng xuất các thiết bị khác
    await user.save();

    await user.populate("role", "name displayName permissions");
    await sendTokens(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── THÔNG TIN BẢN THÂN ───────────────────────────────────────────────────────

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("role", "name displayName permissions");
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
