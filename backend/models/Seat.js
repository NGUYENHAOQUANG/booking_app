// models/Seat.js
const mongoose = require('mongoose');

/**
 * Seat model - represents individual seats on an aircraft for a specific flight.
 * Used by the seat map UI (Chọn vị trí ghế ngồi screen).
 */
const SeatSchema = new mongoose.Schema(
  {
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: [true, 'Chuyến bay là bắt buộc'],
    },
    seatNumber: {
      type: String,
      required: [true, 'Số ghế là bắt buộc'],
      trim: true,
      uppercase: true,
      // e.g. "1A", "12C", "23F"
    },
    row: {
      type: Number,
      required: true,
    },
    column: {
      type: String,
      required: true,
      uppercase: true,
      // A, B, C, D, E, F
    },
    fareClass: {
      type: String,
      required: true,
      // "ECO", "BUS", "FST"
    },
    type: {
      type: String,
      enum: ['window', 'middle', 'aisle'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'reserved', 'unavailable'],
      default: 'available',
    },
    extraFee: {
      type: Number,
      default: 0,
      // Extra charge for preferred seats (exit row, front rows, etc.)
    },
  },
  { timestamps: true }
);

SeatSchema.index({ flight: 1, seatNumber: 1 }, { unique: true });
SeatSchema.index({ flight: 1, status: 1 });

module.exports = mongoose.model('Seat', SeatSchema);
