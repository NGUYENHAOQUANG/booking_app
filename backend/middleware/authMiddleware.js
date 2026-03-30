// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// ─── XÁC THỰC ACCESS TOKEN ────────────────────────────────────────────────────

exports.protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).populate("role", "name displayName permissions");
    if (!user)
      return res.status(401).json({ success: false, message: "Người dùng không tồn tại" });

    if (user.changedPasswordAfter(decoded.iat))
      return res.status(401).json({ success: false, message: "Mật khẩu vừa thay đổi. Vui lòng đăng nhập lại." });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Tài khoản đã bị vô hiệu hóa" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ─── PHÂN QUYỀN THEO TÊN ROLE ─────────────────────────────────────────────────

exports.restrictTo = (...roleNames) => {
  return (req, res, next) => {
    const userRoleName = req.user.role?.name;
    if (!roleNames.includes(userRoleName)) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền. Yêu cầu role: ${roleNames.join(" hoặc ")}`,
      });
    }
    next();
  };
};

// ─── PHÂN QUYỀN THEO PERMISSION CỤ THỂ ───────────────────────────────────────

exports.hasPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.role?.permissions || [];
    const isAdmin = userPermissions.includes("*");
    if (isAdmin) return next(); // Admin có tất cả quyền

    const hasAll = requiredPermissions.every((p) => userPermissions.includes(p));
    if (!hasAll) {
      return res.status(403).json({
        success: false,
        message: `Thiếu quyền: ${requiredPermissions.join(", ")}`,
      });
    }
    next();
  };
};