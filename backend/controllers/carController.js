// controllers/carController.js
const Car = require('../models/Car');

// ─── GET CARS BY LOCATION ────────────────────────────────────────────────────
/**
 * GET /api/cars/location?location=Hà Nội
 */
exports.getCarsByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location || !location.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu tham số location.',
      });
    }

    const cars = await Car.find({
      location: { $regex: location.trim(), $options: 'i' },
      isAvailable: true,
      isActive: true,
    }).sort({ rating: -1, pricePerDay: 1 });

    return res.json({ success: true, data: cars });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ALL CARS ─────────────────────────────────────────────────────────────
/**
 * GET /api/cars?page=1&limit=12&type=suv&minPrice=&maxPrice=&q=
 */
exports.getAllCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      minPrice,
      maxPrice,
      q,
      location,
    } = req.query;

    const filter = { isActive: true };
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { model: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [cars, total] = await Promise.all([
      Car.find(filter).sort({ rating: -1 }).skip(skip).limit(Number(limit)),
      Car.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: cars,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET CAR BY ID ────────────────────────────────────────────────────────────
/**
 * GET /api/cars/:id
 */
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || !car.isActive) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
    }
    return res.json({ success: true, data: car });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CREATE CAR (admin) ───────────────────────────────────────────────────────
/**
 * POST /api/cars
 */
exports.createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    return res.status(201).json({ success: true, data: car });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ─── UPDATE CAR (admin) ───────────────────────────────────────────────────────
/**
 * PUT /api/cars/:id
 */
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!car) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
    }
    return res.json({ success: true, data: car });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE CAR (admin) ───────────────────────────────────────────────────────
/**
 * DELETE /api/cars/:id
 */
exports.deleteCar = async (req, res) => {
  try {
    // Soft delete
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!car) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
    }
    return res.json({ success: true, message: 'Đã xóa xe thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
