const BusTrip = require('../models/BusTrip');
const BusSeat = require('../models/BusSeat');

function seatTypeByColumn(col) {
  if (col === 'A' || col === 'C') return 'window';
  return 'aisle';
}

async function buildSeatsForTrip(tripId) {
  const rows = [1, 2, 3, 4, 5, 6];
  const cols = ['A', 'B', 'C'];
  const seats = [];

  for (const row of rows) {
    for (const col of cols) {
      const seatNumber = `${row}${col}`;
      const status = ['2A', '2B', '3B'].includes(seatNumber) ? 'booked' : 'available';
      seats.push({
        trip: tripId,
        seatNumber,
        row,
        column: col,
        status,
        type: seatTypeByColumn(col),
      });
    }
  }

  return seats;
}

async function seedBusData() {
  const existing = await BusTrip.countDocuments();
  if (existing > 0) return;

  const today = new Date();
  const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0);
  const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 30);
  const d3 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22, 0);

  const trips = await BusTrip.insertMany([
    {
      provider: 'Xe Phương Trang',
      busType: 'Limousine 34 chỗ',
      origin: 'Hồ Chí Minh',
      destination: 'Đà Lạt',
      pickupPoint: 'Văn phòng Quận 1',
      dropoffPoint: 'VP Đà Lạt - Bùi Thị Xuân',
      departureTime: d1,
      arrivalTime: new Date(d1.getTime() + 6 * 60 * 60000),
      durationMinutes: 360,
      pricePerSeat: 240000,
      totalSeats: 18,
      availableSeats: 15,
      amenities: ['Wi-Fi', 'Nước uống', 'Điều hòa'],
      rating: 4.8,
    },
    {
      provider: 'Xe Thành Bưởi',
      busType: 'Giường nằm 40 chỗ',
      origin: 'Hồ Chí Minh',
      destination: 'Đà Lạt',
      pickupPoint: 'Bến xe Miền Đông',
      dropoffPoint: 'Bến xe Liên tỉnh Đà Lạt',
      departureTime: d2,
      arrivalTime: new Date(d2.getTime() + 6 * 60 * 60000),
      durationMinutes: 360,
      pricePerSeat: 220000,
      totalSeats: 18,
      availableSeats: 15,
      amenities: ['Chăn', 'Nước uống', 'Sạc USB'],
      rating: 4.7,
    },
    {
      provider: 'Xe Kumho Samco',
      busType: 'Limousine 22 chỗ',
      origin: 'Đà Lạt',
      destination: 'Hồ Chí Minh',
      pickupPoint: 'Bến xe Liên tỉnh Đà Lạt',
      dropoffPoint: 'Văn phòng Quận 1',
      departureTime: d3,
      arrivalTime: new Date(d3.getTime() + 6 * 60 * 60000),
      durationMinutes: 360,
      pricePerSeat: 260000,
      totalSeats: 18,
      availableSeats: 15,
      amenities: ['Wi-Fi', 'Điều hòa', 'Ghế massage'],
      rating: 4.9,
    },
  ]);

  const allSeats = [];
  for (const trip of trips) {
    const seats = await buildSeatsForTrip(trip._id);
    allSeats.push(...seats);
  }

  await BusSeat.insertMany(allSeats);
}

module.exports = { seedBusData };
