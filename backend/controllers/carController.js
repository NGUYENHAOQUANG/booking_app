const cars = [
    { id: 1, name: "Toyota", location: "Hà Nội" },
    { id: 2, name: "Honda", location: "TP.HCM" },
    { id: 3, name: "BMW", location: "Đà Nẵng" },
    { id: 4, name: "Mercedes", location: "Hà Nội" },
];

// 🔍 search car
exports.searchCar = (req, res) => {
    const keyword = req.query.q?.toLowerCase() || "";

    const result = cars.filter(car =>
        car.name.toLowerCase().includes(keyword)
    );

    res.json(result);
};

// 📍 filter by location
exports.getCarByLocation = (req, res) => {
    const location = req.query.location;

    const result = cars.filter(car =>
        car.location === location
    );

    res.json(result);
};