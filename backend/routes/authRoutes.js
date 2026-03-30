// routes/authRoutes.js
const express = require("express");
const router  = express.Router();
const auth    = require("../controllers/authController");
const { protect, restrictTo, hasPermission } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} = require("../middleware/authValidation");

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/register",               validateRegister,      auth.register);
router.post("/login",                  validateLogin,         auth.login);
router.post("/refresh-token",          validateRefreshToken,  auth.refreshToken);
router.post("/forgot-password",        validateForgotPassword, auth.forgotPassword);
router.patch("/reset-password/:token", validateResetPassword, auth.resetPassword);

// ── Protected (cần access token) ──────────────────────────────────────────────
router.use(protect);

router.post("/logout",          auth.logout);
router.get("/me",               auth.getMe);
router.patch("/change-password", validateChangePassword, auth.changePassword);

// ── Ví dụ phân quyền theo role ────────────────────────────────────────────────
router.get("/admin-only",  restrictTo("admin"),              (req, res) =>
  res.json({ success: true, message: "Chào Admin!" }));

router.get("/mod-area",    restrictTo("admin", "moderator"), (req, res) =>
  res.json({ success: true, message: "Khu vực Mod/Admin" }));

// ── Ví dụ phân quyền theo permission ─────────────────────────────────────────
router.get("/users",       hasPermission("read:users"),      (req, res) =>
  res.json({ success: true, message: "Danh sách users" }));

module.exports = router;
