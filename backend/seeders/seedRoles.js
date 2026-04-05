// seeders/seedRoles.js
// Chạy một lần để khởi tạo roles: node seeders/seedRoles.js

require("dotenv").config(); // ← Load .env trước khi dùng process.env

const mongoose = require("mongoose");
const Role = require("../models/Role");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/myapp";

const defaultRoles = [
  {
    name: "user",
    displayName: "Người dùng",
    description: "Tài khoản người dùng thông thường",
    permissions: ["read:own_profile", "update:own_profile"],
    isDefault: true, // ← Role này được gán tự động khi đăng ký
    isActive: true,
  },
  {
    name: "moderator",
    displayName: "Điều hành viên",
    description: "Có thể quản lý nội dung",
    permissions: [
      "read:own_profile",
      "update:own_profile",
      "read:users",
      "moderate:content",
    ],
    isDefault: false,
    isActive: true,
  },
  {
    name: "admin",
    displayName: "Quản trị viên",
    description: "Toàn quyền hệ thống",
    permissions: ["*"], // Wildcard = tất cả quyền
    isDefault: false,
    isActive: true,
  },
];

async function seedRoles() {
  for (const roleData of defaultRoles) {
    await Role.findOneAndUpdate({ name: roleData.name }, roleData, {
      upsert: true,
      returnDocument: "after",
    });
    console.log(`✔  Role "${roleData.name}" ready`);
  }
  console.log("🌱 Seed roles hoàn tất!");
}

module.exports = { seedRoles };

if (require.main === module) {
  mongoose
    .connect(MONGO_URI)
    .then(async () => {
      console.log("✅ Connected to MongoDB");
      await seedRoles();
      await mongoose.disconnect();
    })
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
