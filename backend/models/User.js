// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Role = require("./Role");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username là bắt buộc"],
      unique: true,
      trim: true,
      minlength: [3, "Username phải có ít nhất 3 ký tự"],
      maxlength: [30, "Username tối đa 30 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Password là bắt buộc"],
      minlength: [8, "Password phải có ít nhất 8 ký tự"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
        "Password phải có ít nhất 8 ký tự, gồm chữ thường, chữ hoa, số và ký tự đặc biệt",
      ],
      select: false,
    },

    // ── ROLE (ObjectId → collection roles) ──────────────────────────────────
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      // Tự động gán role mặc định qua pre-save hook
    },

    // ── TRẠNG THÁI ────────────────────────────────────────────────────────────
    isActive: { type: Boolean, default: true },

    // ── RESET PASSWORD ────────────────────────────────────────────────────────
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,

    // ── REFRESH TOKEN (lưu dạng hash) ─────────────────────────────────────────
    refreshToken: { type: String, select: false },

    // ── BRUTE-FORCE PROTECTION ────────────────────────────────────────────────
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
  },
  { timestamps: true }
);

// ─── VIRTUAL ──────────────────────────────────────────────────────────────────
UserSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ─── HOOKS ────────────────────────────────────────────────────────────────────

// Hash password trước khi lưu
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
});

// Gán role mặc định nếu user mới chưa có role
UserSchema.pre("save", async function () {
  if (!this.isNew || this.role) return;
  const defaultRole = await Role.findOne({ isDefault: true, isActive: true });
  if (defaultRole) this.role = defaultRole._id;
});

// ─── METHODS ──────────────────────────────────────────────────────────────────

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.createPasswordResetToken = function () {
  const raw = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(raw).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 phút
  return raw;
};

UserSchema.methods.changedPasswordAfter = function (jwtIat) {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > jwtIat;
};

UserSchema.methods.incrementLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
  }
  const update = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    update.$set = { lockUntil: Date.now() + 30 * 60 * 1000 }; // Khóa 30 phút
  }
  return this.updateOne(update);
};

module.exports = mongoose.model("User", UserSchema);
