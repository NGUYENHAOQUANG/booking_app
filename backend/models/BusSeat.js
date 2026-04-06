const mongoose = require('mongoose');

const BusSeatSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusTrip',
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    row: {
      type: Number,
      required: true,
      min: 1,
    },
    column: {
      type: String,
      required: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'booked', 'unavailable'],
      default: 'available',
    },
    type: {
      type: String,
      enum: ['window', 'middle', 'aisle'],
      default: 'window',
    },
  },
  { timestamps: true },
);

BusSeatSchema.index({ trip: 1, seatNumber: 1 }, { unique: true });
BusSeatSchema.index({ trip: 1, status: 1 });

module.exports = mongoose.model('BusSeat', BusSeatSchema);
