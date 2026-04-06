const mongoose = require('mongoose');

const BusTripSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    busType: {
      type: String,
      default: 'Ghế ngồi',
      trim: true,
    },
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    pickupPoint: {
      type: String,
      required: true,
      trim: true,
    },
    dropoffPoint: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
      default: 36,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
      default: 36,
    },
    amenities: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.7,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

BusTripSchema.index({ origin: 1, destination: 1, departureTime: 1 });
BusTripSchema.index({ isActive: 1 });

module.exports = mongoose.model('BusTrip', BusTripSchema);
