// models/Booking.js
const mongoose = require("mongoose");
const PassengerSchema = require("./Passenger");

/**
 * Booking model - core of the flight booking flow.
 * Covers: search → select seats → passenger info → payment → confirmation.
 * Referenced in: Trang trạng thái thanh toán, Trang lịch sử đặt vé.
 */
const BookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      // Auto-generated: e.g. "BK-2024-XYZABC"
    },

    // ── USER ──────────────────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Người dùng là bắt buộc"],
    },

    // ── CONTACT INFO (collected at checkout) ──────────────────────────────────
    contactInfo: {
      fullName: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
      },
      phone: { type: String, required: true, trim: true },
    },

    // ── FLIGHTS ────────────────────────────────────────────────────────────────
    tripType: {
      type: String,
      enum: ["one_way", "round_trip"],
      required: true,
      default: "one_way",
    },
    outboundFlight: {
      flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight",
        required: true,
      },
      fareClass: { type: String, required: true },
      farePrice: { type: Number, required: true }, // price per adult at booking time
    },
    returnFlight: {
      flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight" },
      fareClass: { type: String },
      farePrice: { type: Number },
    },

    // ── PASSENGERS ────────────────────────────────────────────────────────────
    passengers: {
      type: [PassengerSchema],
      required: true,
      validate: [(arr) => arr.length > 0, "Phải có ít nhất 1 hành khách"],
    },

    // ── ADD-ONS ───────────────────────────────────────────────────────────────
    addOns: {
      extraBaggage: {
        outbound: { type: Number, default: 0 }, // extra kg
        return: { type: Number, default: 0 },
      },
      meals: [
        {
          passengerId: mongoose.Schema.Types.ObjectId,
          flight: String, // 'outbound' | 'return'
          meal: String,
        },
      ],
      insurance: { type: Boolean, default: false },
    },

    // ── PRICING ───────────────────────────────────────────────────────────────
    pricing: {
      subtotal: { type: Number, required: true },
      taxes: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
      currency: { type: String, default: "VND" },
    },

    // ── PAYMENT ───────────────────────────────────────────────────────────────
    payment: {
      method: {
        type: String,
        enum: [
          "credit_card",
          "debit_card",
          "bank_transfer",
          "e_wallet",
          "cash",
          "counter",
          "pending",
        ],
        default: "pending",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      transactionId: { type: String, default: "" },
      paidAt: { type: Date },
    },

    // ── BOOKING STATUS ────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "refund_requested",
        "refunded",
      ],
      default: "pending",
    },

    // ── TICKET INFO ───────────────────────────────────────────────────────────
    ticketIssuedAt: { type: Date },
    cancellationReason: { type: String, default: "" },
    cancelledAt: { type: Date },
  },
  { timestamps: true },
);

// Auto-generate booking code before saving
BookingSchema.pre("save", function () {
  if (!this.bookingCode) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const random = Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
    this.bookingCode = `BK${random}`;
  }
});

BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });

module.exports = mongoose.model("Booking", BookingSchema);
