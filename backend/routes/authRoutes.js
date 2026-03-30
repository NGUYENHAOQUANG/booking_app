// routes/authRoutes.js
const express = require("express");
const router  = express.Router();
const auth    = require("../controllers/authController");
const { protect, restrictTo, hasPermission } = require("../middleware/authMiddleware");

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/register",               auth.register);
router.post("/login",                  auth.login);
router.post("/refresh-token",          auth.refreshToken);
router.post("/forgot-password",        auth.forgotPassword);
router.patch("/reset-password/:token", auth.resetPassword);

// ── Protected (cần access token) ──────────────────────────────────────────────
router.use(protect);

router.post("/logout",          auth.logout);
router.get("/me",               auth.getMe);
router.patch("/change-password", auth.changePassword);

// ── Ví dụ phân quyền theo role ────────────────────────────────────────────────
router.get("/admin-only",  restrictTo("admin"),              (req, res) =>
  res.json({ success: true, message: "Chào Admin!" }));

router.get("/mod-area",    restrictTo("admin", "moderator"), (req, res) =>
  res.json({ success: true, message: "Khu vực Mod/Admin" }));

// ── Ví dụ phân quyền theo permission ─────────────────────────────────────────
router.get("/users",       hasPermission("read:users"),      (req, res) =>
  res.json({ success: true, message: "Danh sách users" }));

module.exports = router;