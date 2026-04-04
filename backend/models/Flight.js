// models/Flight.js
const mongoose = require('mongoose');

// Sub-schema for fare classes
const FareClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // e.g. "Economy", "Business", "First Class"
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      // e.g. "ECO", "BUS", "FST"
    },
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Giá không thể âm'],
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [0, 'Số ghế không thể âm'],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Số ghế không thể âm'],
    },
    baggageAllowance: {
      cabin: { type: Number, default: 7 },   // kg
      checked: { type: Number, default: 0 }, // kg (0 = not included)
    },
    isRefundable: { type: Boolean, default: false },
    changeFee: { type: Number, default: 0 },
  },
  { _id: false }
);

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: [true, 'Số hiệu chuyến bay là bắt buộc'],
      trim: true,
      uppercase: true,
      // e.g. "VN123", "VJ456"
    },
    airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airline',
      required: [true, 'Hãng hàng không là bắt buộc'],
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airport',
      required: [true, 'Sân bay khởi hành là bắt buộc'],
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airport',
      required: [true, 'Sân bay đến là bắt buộc'],
    },
    departureTime: {
      type: Date,
      required: [true, 'Thời gian khởi hành là bắt buộc'],
    },
    arrivalTime: {
      type: Date,
      required: [true, 'Thời gian đến là bắt buộc'],
    },
    duration: {
      type: Number, // minutes
    },
    aircraft: {
      type: String,
      default: '',
      // e.g. "Airbus A321", "Boeing 737"
    },
    fareClasses: {
      type: [FareClassSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate duration before save
FlightSchema.pre('save', function () {
  if (this.departureTime && this.arrivalTime) {
    this.duration = Math.round(
      (this.arrivalTime - this.departureTime) / 60000
    );
  }
});

FlightSchema.index({ origin: 1, destination: 1, departureTime: 1 });
FlightSchema.index({ flightNumber: 1 });

module.exports = mongoose.model('Flight', FlightSchema);
