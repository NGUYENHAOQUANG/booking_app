const mongoose = require('mongoose');

const BusPassengerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: '',
    },
    seatNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    idNumber: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false },
);

const BusBookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusTrip',
      required: true,
    },
    contactInfo: {
      fullName: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
      },
      phone: { type: String, required: true, trim: true },
    },
    passengers: {
      type: [BusPassengerSchema],
      validate: [(arr) => arr.length > 0, 'Phải có ít nhất 1 hành khách'],
      required: true,
    },
    pricing: {
      subtotal: { type: Number, required: true },
      serviceFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
      currency: { type: String, default: 'VND' },
    },
    payment: {
      method: {
        type: String,
        enum: ['momo', 'counter', 'bank_transfer', 'e_wallet', 'cash'],
        default: 'momo',
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: { type: String, default: '' },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    ticketIssuedAt: { type: Date },
  },
  { timestamps: true },
);

BusBookingSchema.pre('save', function () {
  if (this.bookingCode) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  this.bookingCode = `BUS${random}`;
});

BusBookingSchema.index({ createdAt: -1 });
BusBookingSchema.index({ status: 1 });

module.exports = mongoose.model('BusBooking', BusBookingSchema);
