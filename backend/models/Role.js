// models/Role.js
const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên role là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      // Ví dụ: "user", "moderator", "admin"
    },
    displayName: {
      type: String,
      required: [true, "Tên hiển thị là bắt buộc"],
      trim: true,
      // Ví dụ: "Người dùng", "Quản trị viên"
    },
    description: {
      type: String,
      default: "",
    },
    permissions: {
      type: [String],
      default: [],
      // Ví dụ: ["read:posts", "write:posts", "delete:users"]
    },
    isDefault: {
      type: Boolean,
      default: false,
      // Role mặc định khi đăng ký mới
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);