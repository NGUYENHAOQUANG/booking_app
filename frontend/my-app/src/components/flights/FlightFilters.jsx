import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FlightFilters = ({ flights, filters, onFiltersChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    airline: true,
    departure: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get unique airlines from flights
  const airlines = [...new Set(flights.map((f) => f.airline))];

  // Get price range
  const minPrice = Math.min(...flights.map((f) => f.price));
  const maxPrice = Math.max(...flights.map((f) => f.price));

  const handleAirlineChange = (airline) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    onFiltersChange({
      ...filters,
      airlines: newAirlines,
    });
  };

  const handlePriceChange = (value) => {
    onFiltersChange({
      ...filters,
      priceRange: [0, value],
    });
  };

  const formatPrice = (price) => {
    return (price / 1000000).toFixed(1) + " triệu";
  };

  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("price")}
        >
          <h3 className="font-bold text-slate-900 text-lg">Giá tiền</h3>
          <ChevronDown
            size={20}
            className={`text-slate-400 transition-transform ${
              expandedSections.price ? "rotate-180" : ""
            }`}
          />
        </div>

        {expandedSections.price && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>{formatPrice(minPrice)}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>

            {/* Quick price buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[3000000, 5000000, 7000000, 10000000].map((price) => (
                <button
                  key={price}
                  onClick={() => handlePriceChange(price)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    filters.priceRange[1] === price
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {formatPrice(price)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Airline Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("airline")}
        >
          <h3 className="font-bold text-slate-900 text-lg">Hãng hàng không</h3>
          <ChevronDown
            size={20}
            className={`text-slate-400 transition-transform ${
              expandedSections.airline ? "rotate-180" : ""
            }`}
          />
        </div>

        {expandedSections.airline && (
          <div className="mt-6 space-y-3">
            {airlines.map((airline) => {
              const airlineFlights = flights.filter((f) => f.airline === airline);
              const isChecked = filters.airlines.includes(airline);

              return (
                <label
                  key={airline}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAirlineChange(airline)}
                    className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`block text-sm font-medium transition-colors ${
                        isChecked
                          ? "text-blue-600"
                          : "text-slate-700 group-hover:text-slate-900"
                      }`}
                    >
                      {airline}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    ({airlineFlights.length})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Departure Time Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("departure")}
        >
          <h3 className="font-bold text-slate-900 text-lg">Giờ khởi hành</h3>
          <ChevronDown
            size={20}
            className={`text-slate-400 transition-transform ${
              expandedSections.departure ? "rotate-180" : ""
            }`}
          />
        </div>

        {expandedSections.departure && (
          <div className="mt-6 space-y-3">
            {[
              {
                label: "Sáng sớm (00:00 - 06:00)",
                value: "early-morning",
              },
              { label: "Sáng (06:00 - 12:00)", value: "morning" },
              { label: "Chiều (12:00 - 18:00)", value: "afternoon" },
              { label: "Tối (18:00 - 23:59)", value: "evening" },
            ].map((time) => {
              const matchFlights = flights.filter((f) => {
                const hour = parseInt(f.departTime);
                if (time.value === "early-morning") return hour < 6;
                if (time.value === "morning") return hour >= 6 && hour < 12;
                if (time.value === "afternoon") return hour >= 12 && hour < 18;
                if (time.value === "evening") return hour >= 18;
                return false;
              });

              return (
                <label key={time.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="departure-time"
                    checked={filters.departureTime === time.value}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        departureTime: time.value,
                      })
                    }
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="block text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      {time.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    ({matchFlights.length})
                  </span>
                </label>
              );
            })}
            
            {/* Clear filter button */}
            <button
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  departureTime: null,
                })
              }
              className="w-full mt-4 py-2 px-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition"
            >
              Xóa bộ lọc thời gian
            </button>
          </div>
        )}
      </div>

      {/* Clear All Filters Button */}
      <button
        onClick={() =>
          onFiltersChange({
            priceRange: [0, 10000000],
            airlines: [],
            departureTime: null,
          })
        }
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold rounded-xl hover:from-blue-100 hover:to-blue-200 transition"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  );
};

export default FlightFilters;
