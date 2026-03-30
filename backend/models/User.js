// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Role = require("./Role");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Họ tên là bắt buộc"],
      trim: true,
      minlength: [2, "Họ tên phải có ít nhất 2 ký tự"],
      maxlength: [100, "Họ tên tối đa 100 ký tự"],
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
    phoneNumber: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      unique: true,
      sparse: true,
      trim: true,
      match: [/^\+?[0-9]{9,15}$/, "Số điện thoại không hợp lệ"],
    },
    acceptTerms: {
      type: Boolean,
      required: [true, "Bạn phải đồng ý điều khoản sử dụng"],
      validate: {
        validator: (value) => value === true,
        message: "Bạn phải đồng ý điều khoản sử dụng",
      },
    },
    allowPromotions: {
      type: Boolean,
      default: false,
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
    passwordResetOtp: { type: String, select: false },
    passwordResetOtpExpires: { type: Date, select: false },
    passwordResetOtpAttempts: { type: Number, default: 0, select: false },
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

UserSchema.pre("save",function () {
  if (!this.isModified("phoneNumber")) return;
  this.phoneNumber = this.phoneNumber.replace(/[^\d+]/g, "");
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

UserSchema.methods.createPasswordResetOtp = function () {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  this.passwordResetOtp = crypto.createHash("sha256").update(otp).digest("hex");
  const expiresInMinutes = Number(process.env.PASSWORD_RESET_OTP_EXPIRES_MINUTES || 10);
  this.passwordResetOtpExpires = Date.now() + expiresInMinutes * 60 * 1000;
  this.passwordResetOtpAttempts = 0;
  return otp;
};

UserSchema.methods.verifyPasswordResetOtp = function (otp) {
  if (!this.passwordResetOtp || !this.passwordResetOtpExpires) return false;
  if (this.passwordResetOtpExpires.getTime() < Date.now()) return false;

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  return this.passwordResetOtp === hashedOtp;
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
