// models/Passenger.js
const mongoose = require('mongoose');

/**
 * Passenger sub-document schema.
 * Embedded in Booking, represents each traveler's info collected at checkout
 * (Trang Thông tin thanh toán screen).
 */
const PassengerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['adult', 'child', 'infant'],
      required: true,
      default: 'adult',
    },
    salutation: {
      type: String,
      enum: ['Mr', 'Ms', 'Mrs', 'Mstr', 'Miss'],
      required: true,
    },
    firstName: {
      type: String,
      required: [true, 'Tên là bắt buộc'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Họ là bắt buộc'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    nationality: {
      type: String,
      default: 'VN',
    },
    passportNumber: {
      type: String,
      default: '',
    },
    passportExpiry: {
      type: Date,
    },
    // Seat selected for this passenger on each flight leg
    seatOutbound: {
      type: String,
      default: '',
    },
    seatReturn: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

module.exports = PassengerSchema;
