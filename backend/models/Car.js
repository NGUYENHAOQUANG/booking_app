// models/Car.js
const mongoose = require('mongoose');

/**
 * Car model — xe thuê theo địa điểm.
 * Được dùng trong trang đặt xe / tìm kiếm xe.
 */
const CarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên xe là bắt buộc'],
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: '',
      // VD: Toyota, Honda, BMW, Mercedes
    },

    model: {
      type: String,
      trim: true,
      default: '',
      // VD: Camry, Civic, X5
    },

    type: {
      type: String,
      enum: ['sedan', 'suv', 'hatchback', 'van', 'bus', 'limousine'],
      default: 'sedan',
    },

    seats: {
      type: Number,
      required: [true, 'Số chỗ ngồi là bắt buộc'],
      min: [1, 'Phải có ít nhất 1 chỗ ngồi'],
      default: 4,
    },

    pricePerDay: {
      type: Number,
      required: [true, 'Giá thuê mỗi ngày là bắt buộc'],
      min: [0, 'Giá không thể âm'],
      default: 0,
    },

    currency: {
      type: String,
      default: 'VND',
    },

    location: {
      type: String,
      required: [true, 'Địa điểm là bắt buộc'],
      trim: true,
      // VD: Hà Nội, TP.HCM, Đà Nẵng
    },

    address: {
      type: String,
      trim: true,
      default: '',
    },

    imageUrl: {
      type: String,
      default: '',
    },

    features: {
      type: [String],
      default: [],
      // VD: ['Điều hòa', 'GPS', 'Wifi', 'Ghế trẻ em']
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    licensePlate: {
      type: String,
      trim: true,
      default: '',
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index để tìm xe theo địa điểm nhanh
CarSchema.index({ location: 1, isAvailable: 1, isActive: 1 });
CarSchema.index({ pricePerDay: 1 });

module.exports = mongoose.model('Car', CarSchema);
