import { Clock, Briefcase, Users, Heart } from "lucide-react";
import { useState } from "react";

const FlightCard = ({ flight, viewMode }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (time) => {
    return time;
  };

  const calculateArrivalTime = (depart, duration) => {
    // Simplified calculation
    return depart;
  };

  const getStopsText = (stops) => {
    if (stops === 0) return "Bay thẳng";
    if (stops === 1) return "1 điểm dừng";
    return `${stops} điểm dừng`;
  };

  if (viewMode === "list") {
    return (
      <div
        className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 p-6 transition-all hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Airline Info */}
          <div className="md:col-span-2">
            <div className="text-3xl mb-2">{flight.logo}</div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">
                {flight.airline}
              </div>
              <div className="text-xs text-slate-500">
                Chuyến {flight.flightNumber}
              </div>
            </div>
          </div>

          {/* Flight Times */}
          <div className="md:col-span-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {flight.departTime}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {flight.departure}
              </div>
            </div>
          </div>

          {/* Duration & Info */}
          <div className="md:col-span-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-0.5 flex-1 bg-slate-300"></div>
                <Clock size={14} className="text-slate-400" />
                <div className="h-0.5 flex-1 bg-slate-300"></div>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                {flight.duration}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {getStopsText(flight.stops)}
              </div>
            </div>
          </div>

          {/* Arrival Time */}
          <div className="md:col-span-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {flight.arriveTime}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {flight.arrival}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="md:col-span-2">
            <div className="flex gap-1 justify-center mb-2">
              {flight.amenities.slice(0, 2).map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                >
                  {amenity === "Meal"
                    ? "🍽️"
                    : amenity === "WiFi"
                    ? "📡"
                    : amenity === "Luggage"
                    ? "🧳"
                    : "🎬"}
                </span>
              ))}
            </div>
            <div className="text-xs text-slate-500 text-center">
              {flight.amenities.length} satinh tiện
            </div>
          </div>

          {/* Price & Action */}
          <div className="md:col-span-2 text-center">
            <div className="mb-3">
              <div className="text-sm text-slate-500">Giá từ</div>
              <div className="text-2xl font-bold text-blue-600">
                {(flight.price / 1000000).toFixed(1)}M
              </div>
            </div>
            <button
              onClick={() => alert("Chuyến bay: " + flight.flightNumber)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all active:scale-95"
            >
              Chọn
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-yellow-400 text-lg">⭐</div>
            <span className="font-semibold text-slate-900">{flight.rating}</span>
            <span className="text-sm text-slate-500">({flight.available} chỗ còn)</span>
          </div>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-lg transition ${
              isFavorite
                ? "bg-red-100 text-red-600"
                : "bg-slate-100 text-slate-400 hover:text-slate-600"
            }`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with airline and favorite */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{flight.logo}</div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">
              {flight.airline}
            </div>
            <div className="text-xs text-slate-500">
              {flight.flightNumber}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-2 rounded-lg transition ${
            isFavorite
              ? "bg-red-100 text-red-600"
              : "bg-slate-100 text-slate-400 hover:text-slate-600"
          }`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Flight times and route */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 items-center mb-6">
          {/* Departure */}
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {flight.departTime}
            </div>
            <div className="text-sm text-slate-600 font-medium mt-1">
              {flight.departure}
            </div>
          </div>

          {/* Duration */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-0.5 flex-1 bg-slate-300"></div>
              <Clock size={16} className="text-blue-600" />
              <div className="h-0.5 flex-1 bg-slate-300"></div>
            </div>
            <div className="text-xs text-slate-600 font-semibold">
              {flight.duration}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {getStopsText(flight.stops)}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {flight.arriveTime}
            </div>
            <div className="text-sm text-slate-600 font-medium mt-1">
              {flight.arrival}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {flight.amenities.map((amenity, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                <span>
                  {amenity === "Meal"
                    ? "🍽️"
                    : amenity === "WiFi"
                    ? "📡"
                    : amenity === "Luggage"
                    ? "🧳"
                    : amenity === "Entertainment"
                    ? "🎬"
                    : "✓"}
                </span>
                {amenity}
              </div>
            ))}
          </div>
        </div>

        {/* Rating and available seats */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="font-semibold text-slate-900">{flight.rating}</span>
            <span className="text-xs text-slate-500">({flight.available} chỗ)</span>
          </div>
        </div>

        {/* Price and button */}
        <div>
          <div className="text-sm text-slate-500 mb-2">Giá vé từ</div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-3xl font-bold text-blue-600">
              {(flight.price / 1000000).toFixed(1)}
              <span className="text-lg ml-1">triệu</span>
            </div>
            <button
              onClick={() => alert("Chuyến bay: " + flight.flightNumber)}
              className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all active:scale-95 ${
                isHovered
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Chọn ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
