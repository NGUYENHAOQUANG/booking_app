const cars = [
  {
    id: 1,
    name: 'Toyota Camry',
    price: 650000,
    seats: 5,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    name: 'Honda Civic',
    price: 590000,
    seats: 5,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    name: 'BMW 3 Series',
    price: 1250000,
    seats: 5,
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    name: 'Mercedes C-Class',
    price: 1350000,
    seats: 5,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
  },
];

// 🔍 search car
exports.searchCar = (req, res) => {
  const pickup = req.query.pickup?.trim() || '';
  const dropoff = req.query.dropoff?.trim() || '';
  const date = req.query.date?.trim() || '';

  if (!pickup || !dropoff || !date) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp pickup, dropoff và date.',
    });
  }

  const availableCars = cars.map((car) => ({
    id: car.id,
    name: car.name,
    price: car.price,
    seats: car.seats,
    image: car.image,
  }));

  return res.json({
    success: true,
    data: availableCars,
  });
};

// 📍 filter by location
exports.getCarByLocation = (req, res) => {
  const location = req.query.location;

  const result = cars.filter((car) => car.location === location);

  res.json(result);
};