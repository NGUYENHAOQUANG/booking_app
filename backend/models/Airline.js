// models/Airline.js
const mongoose = require('mongoose');

const AirlineSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Mã hãng bay là bắt buộc'],
      unique: true,
      uppercase: true,
      trim: true,
      // IATA airline code: VN (Vietnam Airlines), VJ (VietJet), QH (Bamboo)
    },
    name: {
      type: String,
      required: [true, 'Tên hãng bay là bắt buộc'],
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Airline', AirlineSchema);
