// models/Airport.js
const mongoose = require('mongoose');

const AirportSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Mã sân bay là bắt buộc'],
      unique: true,
      uppercase: true,
      trim: true,
      // IATA code: HAN, SGN, DAD...
    },
    name: {
      type: String,
      required: [true, 'Tên sân bay là bắt buộc'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Thành phố là bắt buộc'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Quốc gia là bắt buộc'],
      trim: true,
      default: 'Vietnam',
    },
    countryCode: {
      type: String,
      uppercase: true,
      trim: true,
      default: 'VN',
    },
    timezone: {
      type: String,
      default: 'Asia/Ho_Chi_Minh',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


AirportSchema.index({ city: 'text', name: 'text' });

module.exports = mongoose.model('Airport', AirportSchema);
