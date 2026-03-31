// controllers/authController.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendPasswordResetOtpEmail } = require("../utils/email");

const JWT_SECRET          = process.env.JWT_SECRET          || "change_this_secret";
const JWT_EXPIRES_IN      = process.env.JWT_EXPIRES_IN      || "15m";
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET  || "change_this_refresh_secret";
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const signAccessToken  = (id) => jwt.sign({ id }, JWT_SECRET,         { expiresIn: JWT_EXPIRES_IN });
const signRefreshToken = (id) => jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });
const normalizePhoneNumber = (value = "") => String(value).replace(/[^\d+]/g, "");
const MAX_OTP_ATTEMPTS = 5;

const handleInvalidOtpAttempt = async (user) => {
  user.passwordResetOtpAttempts = (user.passwordResetOtpAttempts || 0) + 1;
  const isExceeded = user.passwordResetOtpAttempts >= MAX_OTP_ATTEMPTS;

  if (isExceeded) {
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    user.passwordResetOtpAttempts = 0;
  }

  await user.save({ validateBeforeSave: false });
  return isExceeded;
};

const sendTokens = async (user, statusCode, res) => {
  const accessToken  = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Lưu refresh token dạng hash vào DB
  const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await User.findByIdAndUpdate(user._id, { refreshToken: hashed });

  user.password     = undefined;
  user.refreshToken = undefined;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 phút
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });

  res.cookie("isLoggedIn", "true", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });

  res.status(statusCode).json({ success: true, data: { user } });
};

// ─── ĐĂNG KÝ ─────────────────────────────────────────────────────────────────

exports.register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, acceptTerms, allowPromotions } = req.body;
    const user = await User.create({
      fullName,
      email,
      phoneNumber: normalizePhoneNumber(phoneNumber),
      password,
      acceptTerms,
      allowPromotions: allowPromotions ?? false,
    });
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
    const { password } = req.body;
    const identifier = (req.body.identifier || req.body.email || req.body.phoneNumber || "").trim();
    const isEmail = identifier.includes("@");
    const query = isEmail
      ? { email: identifier.toLowerCase() }
      : { phoneNumber: normalizePhoneNumber(identifier) };

    const user = await User.findOne(query)
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
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Không tìm thấy token. Vui lòng đăng nhập lại." });
    }

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
    
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('isLoggedIn');

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

    const otp = user.createPasswordResetOtp();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetOtpEmail({
        to: user.email,
        fullName: user.fullName,
        otp,
      });
    } catch (mailErr) {
      console.error("Send reset OTP email failed:", mailErr.message);
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpires = undefined;
      user.passwordResetOtpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        success: false,
        message: "Không thể gửi OTP đặt lại mật khẩu. Vui lòng thử lại sau.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP đã được gửi qua email. Vui lòng kiểm tra hộp thư.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── XÁC THỰC OTP QUÊN MẬT KHẨU ──────────────────────────────────────────────

exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select(
      "+passwordResetOtp +passwordResetOtpExpires +passwordResetOtpAttempts"
    );

    if (!user)
      return res.status(400).json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn" });

    if (!user.verifyPasswordResetOtp(otp)) {
      const isExceeded = await handleInvalidOtpAttempt(user);
      return res.status(400).json({
        success: false,
        message: isExceeded
          ? "OTP đã sai quá số lần cho phép. Vui lòng yêu cầu mã OTP mới."
          : "OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP hợp lệ. Bạn có thể đặt lại mật khẩu.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── RESET MẬT KHẨU BẰNG OTP ────────────────────────────────────────────────

exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email }).select(
      "+passwordResetOtp +passwordResetOtpExpires +passwordResetOtpAttempts +refreshToken"
    );

    if (!user)
      return res.status(400).json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn" });

    if (!user.verifyPasswordResetOtp(otp)) {
      const isExceeded = await handleInvalidOtpAttempt(user);
      return res.status(400).json({
        success: false,
        message: isExceeded
          ? "OTP đã sai quá số lần cho phép. Vui lòng yêu cầu mã OTP mới."
          : "OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    user.password = password;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    user.passwordResetOtpAttempts = 0;
    user.refreshToken = undefined; // đăng xuất tất cả thiết bị
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
