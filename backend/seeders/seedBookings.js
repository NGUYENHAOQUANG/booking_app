const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Role = require("../models/Role");
const Flight = require("../models/Flight");
const Seat = require("../models/Seat");
const Booking = require("../models/Booking");

async function seedBookings() {
  try {
    await connectDB();
    console.log("🌱 Bắt đầu tạo dữ liệu mẫu cho Hệ thống Đặt Vé...");

    // 1. Tạo hoặc lấy Role user
    let userRole = await Role.findOne({ name: "user" });
    if (!userRole) {
      userRole = await Role.create({
        name: "user",
        displayName: "Người dùng",
        isActive: true,
      });
    }

    // 2. Tạo một User mẫu
    let testUser = await User.findOne({ email: "testcustomer@gmail.com" });
    if (!testUser) {
      testUser = await User.create({
        username: "testcustomer",
        fullName: "Test Customer",
        email: "testcustomer@gmail.com",
        phoneNumber: "0987654321",
        password: "Password@123",
        acceptTerms: true,
        role: userRole._id,
      });
      console.log("✅ Đã tạo User mẫu:", testUser.email);
    }

    // 3. Lấy 1 chuyến bay ngẫu nhiên
    const flight = await Flight.findOne();
    if (!flight) {
      console.log(
        "⚠️ Không tìm thấy chuyến bay nào trong hệ thống. Vui lòng chạy seedFlightData.js trước!",
      );
      process.exit(1);
    }

    // Tìm 1 ghế trống của chuyến bay này
    const seat = await Seat.findOne({
      flight: flight._id,
      status: "available",
    });
    if (!seat) {
      console.log("⚠️ Không tìm thấy ghế trống nào!");
      process.exit(1);
    }

    // 4. Update trạng thái ghế thành đã đặt
    seat.status = "booked";
    await seat.save();

    // 5. Tạo Booking
    const newBooking = await Booking.create({
      user: testUser._id,
      contactInfo: {
        fullName: testUser.fullName || testUser.username || "Test Customer",
        email: testUser.email,
        phone: "0987654321",
      },
      tripType: "one_way",
      outboundFlight: {
        flight: flight._id,
        fareClass: seat.fareClass,
        farePrice: 1500000,
      },
      passengers: [
        {
          type: "adult",
          salutation: "Mr",
          firstName: "Nguyen",
          lastName: "Van A",
          seatOutbound: seat.seatNumber,
        },
      ],
      pricing: {
        subtotal: 1500000,
        taxes: 100000,
        serviceFee: 50000,
        total: 1650000,
        currency: "VND",
      },
      payment: {
        method: "e_wallet", // Momo
        status: "paid",
        paidAt: new Date(),
      },
      status: "confirmed",
    });

    console.log(
      `✅ Đã tạo thành công Booking mẫu (Mã: ${newBooking.bookingCode})`,
    );

    console.log("🎉 Seed toàn bộ dữ liệu Đặt vé hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu Bookings:", error);
    process.exit(1);
  }
}

seedBookings();
