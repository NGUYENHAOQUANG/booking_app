import { useState } from "react";
import { Calendar, MapPin, Users, Plane } from "lucide-react";

const FlightSearchForm = ({ onSearch }) => {
  const [tripType, setTripType] = useState("one-way");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  const airports = [
    { code: "HAN", city: "Hà Nội", country: "Việt Nam" },
    { code: "SGN", city: "TP. Hồ Chí Minh", country: "Việt Nam" },
    { code: "DAD", city: "Đà Nẵng", country: "Việt Nam" },
    { code: "CTS", city: "Cần Thơ", country: "Việt Nam" },
    { code: "HUI", city: "Huế", country: "Việt Nam" },
    { code: "BKK", city: "Bangkok", country: "Thái Lan" },
    { code: "SIN", city: "Singapore", country: "Singapore" },
    { code: "KUL", city: "Kuala Lumpur", country: "Malaysia" },
    { code: "NRT", city: "Tôkyô", country: "Nhật Bản" },
  ];

  const [departureDropdown, setDepartureDropdown] = useState(false);
  const [arrivalDropdown, setArrivalDropdown] = useState(false);

  const handleSearch = () => {
    if (!departure || !arrival || !departDate) {
      alert("Vui lòng nhập đầy đủ thông tin tìm kiếm");
      return;
    }

    onSearch({
      departure,
      arrival,
      departDate,
      returnDate: tripType === "round-trip" ? returnDate : null,
      tripType,
      passengers,
    });
  };

  const swapAirports = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 pt-12 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full -mr-48 -mt-48 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full -ml-36 -mb-36 opacity-20"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-white text-4xl font-bold mb-2 flex items-center gap-2">
            <Plane size={36} />
            Tìm chuyến bay
          </h1>
          <p className="text-blue-100">Khám phá những điểm đến tuyệt vời</p>
        </div>

        {/* Trip Type Selector */}
        <div className="flex gap-4 mb-8">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              value="one-way"
              checked={tripType === "one-way"}
              onChange={(e) => setTripType(e.target.value)}
              className="w-4 h-4 accent-white"
            />
            <span className="ml-3 text-white font-medium group-hover:text-blue-100 transition">
              Một chiều
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              value="round-trip"
              checked={tripType === "round-trip"}
              onChange={(e) => setTripType(e.target.value)}
              className="w-4 h-4 accent-white"
            />
            <span className="ml-3 text-white font-medium group-hover:text-blue-100 transition">
              Khứ hồi
            </span>
          </label>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Departure Airport */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Từ
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Sân bay"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value.toUpperCase())}
                  onFocus={() => setDepartureDropdown(true)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase font-medium"
                />
                {departureDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                    {airports
                      .filter((a) => a.code.includes(departure.toUpperCase()))
                      .map((airport) => (
                        <button
                          key={airport.code}
                          onClick={() => {
                            setDeparture(airport.code);
                            setDepartureDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b last:border-b-0"
                        >
                          <div className="font-semibold text-slate-900">
                            {airport.code}
                          </div>
                          <div className="text-sm text-slate-500">
                            {airport.city}, {airport.country}
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-end justify-center lg:h-14">
              <button
                onClick={swapAirports}
                className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition font-medium"
                title="Đổi chuyến"
              >
                ⇄
              </button>
            </div>

            {/* Arrival Airport */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Đến
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Sân bay"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value.toUpperCase())}
                  onFocus={() => setArrivalDropdown(true)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase font-medium"
                />
                {arrivalDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                    {airports
                      .filter((a) => a.code.includes(arrival.toUpperCase()))
                      .map((airport) => (
                        <button
                          key={airport.code}
                          onClick={() => {
                            setArrival(airport.code);
                            setArrivalDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b last:border-b-0"
                        >
                          <div className="font-semibold text-slate-900">
                            {airport.code}
                          </div>
                          <div className="text-sm text-slate-500">
                            {airport.city}, {airport.country}
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Departure Date */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Ngày đi
              </label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Return Date (only for round trip) */}
            {tripType === "round-trip" && (
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Ngày về
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            )}

            {/* Passengers */}
            <div className={tripType === "round-trip" ? "lg:col-span-1" : "lg:col-span-2"}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Hành khách
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-left font-medium bg-white hover:bg-slate-50"
                >
                  {passengers} hành khách
                </button>
                {showPassengerDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-4">
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setPassengers(num);
                            setShowPassengerDropdown(false);
                          }}
                          className={`w-full py-2 rounded-lg transition text-left px-3 ${
                            passengers === num
                              ? "bg-blue-500 text-white font-medium"
                              : "hover:bg-slate-100"
                          }`}
                        >
                          {num} hành khách
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchForm;
