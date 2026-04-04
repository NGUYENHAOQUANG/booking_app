// seeders/seedFlightData.js
/**
 * Seed initial data for:
 * - 8 Vietnamese airports
 * - 4 major airlines
 * - Sample flights (HAN <-> SGN, HAN <-> DAD)
 *
 * Run with: node seeders/seedFlightData.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Airport = require('../models/Airport');
const Airline = require('../models/Airline');
const Flight = require('../models/Flight');
const Seat = require('../models/Seat');
const connectDB = require('../config/db');

// ─── DATA ─────────────────────────────────────────────────────────────────────

const airports = [
  { code: 'HAN', name: 'Sân bay Quốc tế Nội Bài', city: 'Hà Nội', country: 'Vietnam', countryCode: 'VN' },
  { code: 'SGN', name: 'Sân bay Quốc tế Tân Sơn Nhất', city: 'Hồ Chí Minh', country: 'Vietnam', countryCode: 'VN' },
  { code: 'DAD', name: 'Sân bay Quốc tế Đà Nẵng', city: 'Đà Nẵng', country: 'Vietnam', countryCode: 'VN' },
  { code: 'CXR', name: 'Sân bay Quốc tế Cam Ranh', city: 'Nha Trang', country: 'Vietnam', countryCode: 'VN' },
  { code: 'PQC', name: 'Sân bay Quốc tế Phú Quốc', city: 'Phú Quốc', country: 'Vietnam', countryCode: 'VN' },
  { code: 'HPH', name: 'Sân bay Quốc tế Cát Bi', city: 'Hải Phòng', country: 'Vietnam', countryCode: 'VN' },
  { code: 'HUI', name: 'Sân bay Quốc tế Phú Bài', city: 'Huế', country: 'Vietnam', countryCode: 'VN' },
  { code: 'VCA', name: 'Sân bay Quốc tế Cần Thơ', city: 'Cần Thơ', country: 'Vietnam', countryCode: 'VN' },
];

const airlines = [
  { code: 'VN', name: 'Vietnam Airlines', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Vietnam_Airlines_logo.svg/1200px-Vietnam_Airlines_logo.svg.png' },
  { code: 'VJ', name: 'VietJet Air', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Vietjet_Air_logo.svg/1200px-Vietjet_Air_logo.svg.png' },
  { code: 'QH', name: 'Bamboo Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Bamboo_Airways_logo.svg/1200px-Bamboo_Airways_logo.svg.png' },
  { code: 'BL', name: 'Pacific Airlines', logo: '' },
];

// Helper to build a Date for today at given HH:MM
function todayAt(hours, minutes, daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// Build standard Economy + Business fare classes
function buildFareClasses(ecoPrice, busPrice) {
  return [
    {
      name: 'Economy',
      code: 'ECO',
      basePrice: ecoPrice,
      totalSeats: 120,
      availableSeats: 120,
      baggageAllowance: { cabin: 7, checked: 0 },
      isRefundable: false,
      changeFee: 200000,
    },
    {
      name: 'Business',
      code: 'BUS',
      basePrice: busPrice,
      totalSeats: 20,
      availableSeats: 20,
      baggageAllowance: { cabin: 10, checked: 30 },
      isRefundable: true,
      changeFee: 0,
    },
  ];
}

// ─── SEAT GENERATION ──────────────────────────────────────────────────────────
function generateSeats(flightId, totalRows = 30, columns = ['A', 'B', 'C', 'D', 'E', 'F']) {
  const seats = [];
  for (let row = 1; row <= totalRows; row++) {
    for (const col of columns) {
      const fareClass = row <= 5 ? 'BUS' : 'ECO';
      let type = 'middle';
      if (col === 'A' || col === 'F') type = 'window';
      else if (col === 'C' || col === 'D') type = 'aisle';

      const extraFee = col === 'A' || col === 'F' ? 50000 :
        col === 'C' || col === 'D' ? 30000 : 0;

      seats.push({
        flight: flightId,
        seatNumber: `${row}${col}`,
        row,
        column: col,
        fareClass,
        type,
        status: 'available',
        extraFee,
      });
    }
  }
  return seats;
}

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────
async function seedFlightData() {
  await connectDB();
  console.log('🌱 Bắt đầu seed dữ liệu chuyến bay...');

  // Upsert airports
  for (const ap of airports) {
    await Airport.findOneAndUpdate({ code: ap.code }, ap, { upsert: true, new: true });
  }
  console.log(`✅ Đã seed ${airports.length} sân bay`);

  // Upsert airlines
  for (const al of airlines) {
    await Airline.findOneAndUpdate({ code: al.code }, al, { upsert: true, new: true });
  }
  console.log(`✅ Đã seed ${airlines.length} hãng hàng không`);

  // Get ObjectIds
  const [HAN, SGN, DAD, PQC] = await Promise.all([
    Airport.findOne({ code: 'HAN' }),
    Airport.findOne({ code: 'SGN' }),
    Airport.findOne({ code: 'DAD' }),
    Airport.findOne({ code: 'PQC' }),
  ]);

  const [VN, VJ, QH] = await Promise.all([
    Airline.findOne({ code: 'VN' }),
    Airline.findOne({ code: 'VJ' }),
    Airline.findOne({ code: 'QH' }),
  ]);

  // Define sample flights for the next 7 days
  const flightDefs = [];
  for (let day = 0; day < 7; day++) {
    flightDefs.push(
      // HAN -> SGN
      { flightNumber: `VN${201 + day}`, airline: VN._id, origin: HAN._id, destination: SGN._id, departureTime: todayAt(6, 0, day), arrivalTime: todayAt(8, 10, day), aircraft: 'Airbus A321', fareClasses: buildFareClasses(990000, 3200000) },
      { flightNumber: `VJ${101 + day}`, airline: VJ._id, origin: HAN._id, destination: SGN._id, departureTime: todayAt(9, 30, day), arrivalTime: todayAt(11, 45, day), aircraft: 'Airbus A320', fareClasses: buildFareClasses(790000, 2500000) },
      { flightNumber: `QH${301 + day}`, airline: QH._id, origin: HAN._id, destination: SGN._id, departureTime: todayAt(14, 0, day), arrivalTime: todayAt(16, 15, day), aircraft: 'Boeing 787', fareClasses: buildFareClasses(1100000, 3500000) },
      // SGN -> HAN
      { flightNumber: `VN${401 + day}`, airline: VN._id, origin: SGN._id, destination: HAN._id, departureTime: todayAt(7, 0, day), arrivalTime: todayAt(9, 10, day), aircraft: 'Airbus A321', fareClasses: buildFareClasses(990000, 3200000) },
      { flightNumber: `VJ${501 + day}`, airline: VJ._id, origin: SGN._id, destination: HAN._id, departureTime: todayAt(13, 0, day), arrivalTime: todayAt(15, 15, day), aircraft: 'Airbus A320', fareClasses: buildFareClasses(790000, 2500000) },
      // HAN -> DAD
      { flightNumber: `VN${601 + day}`, airline: VN._id, origin: HAN._id, destination: DAD._id, departureTime: todayAt(8, 0, day), arrivalTime: todayAt(9, 20, day), aircraft: 'ATR72', fareClasses: buildFareClasses(650000, 1800000) },
      { flightNumber: `VJ${701 + day}`, airline: VJ._id, origin: HAN._id, destination: DAD._id, departureTime: todayAt(16, 30, day), arrivalTime: todayAt(17, 50, day), aircraft: 'Airbus A320', fareClasses: buildFareClasses(550000, 1600000) },
      // SGN -> PQC
      { flightNumber: `VN${801 + day}`, airline: VN._id, origin: SGN._id, destination: PQC._id, departureTime: todayAt(7, 30, day), arrivalTime: todayAt(8, 30, day), aircraft: 'ATR72', fareClasses: buildFareClasses(450000, 1200000) },
    );
  }

  let flightCount = 0;
  let seatCount = 0;

  for (const def of flightDefs) {
    // Skip if flight already exists today
    const existing = await Flight.findOne({ flightNumber: def.flightNumber, departureTime: def.departureTime });
    if (existing) continue;

    const flight = await Flight.create(def);
    flightCount++;

    // Generate seat map
    const seats = generateSeats(flight._id);
    await Seat.insertMany(seats);
    seatCount += seats.length;
  }

  console.log(`✅ Đã seed ${flightCount} chuyến bay và ${seatCount} ghế`);
  console.log('🎉 Seed dữ liệu hoàn tất!');
  process.exit(0);
}

seedFlightData().catch((err) => {
  console.error('❌ Seed thất bại:', err);
  process.exit(1);
});
