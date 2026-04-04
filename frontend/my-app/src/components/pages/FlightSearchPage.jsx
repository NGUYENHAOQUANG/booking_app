import { useState, useEffect } from "react";
import { ChevronDown, LayoutGrid, List, MapPin, Calendar, Users } from "lucide-react";
import FlightSearchForm from "../flights/FlightSearchForm";
import FlightCard from "../flights/FlightCard";
import FlightFilters from "../flights/FlightFilters";

const FlightSearchPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchParams, setSearchParams] = useState({
    departure: "",
    arrival: "",
    departDate: "",
    returnDate: null,
    tripType: "one-way",
    passengers: 1,
  });
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [sortBy, setSortBy] = useState("price-asc");
  const [filters, setFilters] = useState({
    priceRange: [0, 10000000],
    airlines: [],
    departureTime: null,
  });
  const [isSearching, setIsSearching] = useState(false);

  // Mock data cho chuyến bay
  const mockFlights = [
    {
      id: 1,
      departure: "HAN",
      arrival: "SGN",
      airline: "Vietnam Airlines",
      logo: "🛫",
      departTime: "08:00",
      arriveTime: "10:30",
      flightNumber: "VN145",
      duration: "2h 30m",
      price: 2500000,
      stops: 0,
      available: 8,
      amenities: ["Meal", "WiFi", "Luggage"],
      rating: 4.8,
    },
    {
      id: 2,
      departure: "HAN",
      arrival: "SGN",
      airline: "Vietjet Air",
      logo: "✈️",
      departTime: "10:15",
      arriveTime: "12:45",
      flightNumber: "VJ215",
      duration: "2h 30m",
      price: 1800000,
      stops: 0,
      available: 15,
      amenities: ["Luggage"],
      rating: 4.5,
    },
    {
      id: 3,
      departure: "HAN",
      arrival: "SGN",
      airline: "Bamboo Airways",
      logo: "🎋",
      departTime: "12:00",
      arriveTime: "14:30",
      flightNumber: "BA156",
      duration: "2h 30m",
      price: 3200000,
      stops: 0,
      available: 12,
      amenities: ["Meal", "WiFi", "Luggage", "Entertainment"],
      rating: 4.9,
    },
    {
      id: 4,
      departure: "HAN",
      arrival: "SGN",
      airline: "Vietnam Airlines",
      logo: "🛫",
      departTime: "14:30",
      arriveTime: "17:00",
      flightNumber: "VN147",
      duration: "2h 30m",
      price: 2600000,
      stops: 0,
      available: 5,
      amenities: ["Meal", "WiFi", "Luggage"],
      rating: 4.8,
    },
    {
      id: 5,
      departure: "HAN",
      arrival: "SGN",
      airline: "Vietjet Air",
      logo: "✈️",
      departTime: "16:45",
      arriveTime: "19:15",
      flightNumber: "VJ218",
      duration: "2h 30m",
      price: 1500000,
      stops: 0,
      available: 20,
      amenities: ["Luggage"],
      rating: 4.4,
    },
    {
      id: 6,
      departure: "HAN",
      arrival: "SGN",
      airline: "Bamboo Airways",
      logo: "🎋",
      departTime: "18:00",
      arriveTime: "20:30",
      flightNumber: "BA160",
      duration: "2h 30m",
      price: 2800000,
      stops: 0,
      available: 9,
      amenities: ["Meal", "WiFi", "Luggage", "Entertainment"],
      rating: 4.9,
    },
  ];

  const handleSearch = (params) => {
    setSearchParams(params);
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setFlights(mockFlights);
      applyFilters(mockFlights);
      setIsSearching(false);
    }, 500);
  };

  const applyFilters = (flightsList) => {
    let filtered = flightsList.filter((flight) => {
      const priceMatch =
        flight.price >= filters.priceRange[0] &&
        flight.price <= filters.priceRange[1];

      const airlineMatch =
        filters.airlines.length === 0 ||
        filters.airlines.includes(flight.airline);

      return priceMatch && airlineMatch;
    });

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "duration":
          return (
            parseInt(a.duration) - parseInt(b.duration)
          );
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredFlights(filtered);
  };

  // Load initial flights when page loads
  useEffect(() => {
    setFlights(mockFlights);
  }, []);

  // Apply filters whenever flights, filters, or sortBy change
  useEffect(() => {
    if (flights.length > 0) {
      applyFilters(flights);
    }
  }, [flights, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Search Form */}
      <FlightSearchForm onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {flights.length > 0 && (
          <>
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  Kết quả tìm kiếm chuyến bay
                </h2>
                <p className="text-sm text-slate-500">
                  Tìm thấy {filteredFlights.length} chuyến bay phù hợp với tiêu chí của bạn
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Sorting */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                  <option value="duration">Thời gian bay</option>
                  <option value="rating">Đánh giá</option>
                </select>

                {/* View Toggle */}
                <div className="h-11 p-1 bg-slate-100 rounded-lg flex items-center">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`w-10 h-9 rounded-md flex items-center justify-center transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`w-10 h-9 rounded-md flex items-center justify-center transition-all ${
                      viewMode === "list"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters */}
              <div className="lg:col-span-1">
                <FlightFilters
                  flights={flights}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>

              {/* Flight Results */}
              <div className="lg:col-span-3">
                {isSearching ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="inline-block">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      </div>
                      <p className="mt-4 text-slate-500 font-medium">Đang tìm kiếm chuyến bay...</p>
                    </div>
                  </div>
                ) : filteredFlights.length === 0 ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <p className="text-slate-500 font-medium">
                        Không tìm thấy chuyến bay phù hợp
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Hãy thử thay đổi bộ lọc hoặc nội dung tìm kiếm
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 gap-4"
                        : "space-y-4"
                    }
                  >
                    {filteredFlights.map((flight) => (
                      <FlightCard
                        key={flight.id}
                        flight={flight}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {flights.length === 0 && !isSearching && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <p className="text-slate-500 font-medium text-lg">
                Không tìm thấy chuyến bay nào
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Hãy thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearchPage;
