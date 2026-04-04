// controllers/carController.js
// Dữ liệu mẫu những xe và vị trí hiện có
const cars = [
  { id: 1, name: 'Toyota Camry', location: 'Hà Nội' },
  { id: 2, name: 'Honda Civic', location: 'TP.HCM' },
  { id: 3, name: 'BMW X5', location: 'Đà Nẵng' },
  { id: 4, name: 'Mercedes C-Class', location: 'Hà Nội' },
  { id: 5, name: 'Toyota Corolla', location: 'TP.HCM' },
  { id: 6, name: 'Honda Accord', location: 'Đà Nẵng' },
];

exports.getCarsByLocation = (req, res) => {
  const { location } = req.query;

  if (!location || typeof location !== 'string' || !location.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu tham số location. Vui lòng gửi location trong query string.',
    });
  }

  const normalizedLocation = location.trim().toLowerCase();
  const filteredCars = cars.filter(
    (car) => car.location.toLowerCase() === normalizedLocation,
  );

  return res.json({
    success: true,
    data: filteredCars,
  });
};
