import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, Plane, Clock, MapPin, Calendar, Users, SlidersHorizontal } from "lucide-react";
import flightService from "../../services/flightService";
import toast from "react-hot-toast";

/* ────────── helper ────────── */
const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

const FlightSearchPage = () => {
  const navigate = useNavigate();

  /* ── search bar state ── */
  const [searchParams, setSearchParams] = useState({
    departure: "Sài Gòn",
    arrival: "Hà Nội",
    departDate: "2025-01-24",
    passengers: 2,
  });
  const [showEditSearch, setShowEditSearch] = useState(false);

  /* ── flights ── */
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  /* ── sorting ── */
  const [sortTab, setSortTab] = useState("cheapest"); // cheapest | fastest | best

  /* ── filters ── */
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [maxPrice, setMaxPrice] = useState(20000000);
  const [minPrice, setMinPrice] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  /* ── fetch real data ── */
  const fetchFlights = async () => {
    try {
      setIsSearching(true);
      const res = await flightService.getFlights();
      const raw = res.flights || res.data || [];

      const mapped = raw.map((f) => ({
        id: f._id,
        airline: f.airline?.name || "Airline",
        airlineCode: f.flightNumber?.slice(0, 2) || "XX",
        flightNumber: f.flightNumber || "XX000",
        departure: f.origin?.code || "SGN",
        departureCity: f.origin?.city || "Sài Gòn",
        arrival: f.destination?.code || "HAN",
        arrivalCity: f.destination?.city || "Hà Nội",
        departTime: new Date(f.departureTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        arriveTime: new Date(f.arrivalTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        departHour: new Date(f.departureTime).getHours(),
        duration: f.duration
          ? `${Math.floor(f.duration / 60)}h${f.duration % 60 > 0 ? f.duration % 60 + "m" : ""}`
          : "2h25m",
        durationMin: f.duration || 145,
        price: f.fareClasses?.[0]?.basePrice || 900000,
        stops: 0,
        baggage: "15Kg",
        meal: "Bữa ăn",
        raw: f,
      }));

      setFlights(mapped);
      const prices = mapped.map((f) => f.price);
      if (prices.length) {
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải chuyến bay!");
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  /* ── filtering + sorting ── */
  useEffect(() => {
    let list = [...flights];

    // price
    list = list.filter((f) => f.price >= priceRange[0] && f.price <= priceRange[1]);

    // time of day
    if (selectedTimes.length > 0) {
      list = list.filter((f) => {
        const h = f.departHour;
        return selectedTimes.some((t) => {
          if (t === "morning") return h >= 5 && h < 12;
          if (t === "afternoon") return h >= 12 && h < 17;
          if (t === "evening") return h >= 17 && h < 24;
          if (t === "night") return h >= 0 && h < 5;
          return false;
        });
      });
    }

    // stops
    if (selectedStops.length > 0) {
      list = list.filter((f) => selectedStops.includes(f.stops));
    }

    // airlines
    if (selectedAirlines.length > 0) {
      list = list.filter((f) => selectedAirlines.includes(f.airline));
    }

    // sorting
    if (sortTab === "cheapest") list.sort((a, b) => a.price - b.price);
    else if (sortTab === "fastest") list.sort((a, b) => a.durationMin - b.durationMin);
    else list.sort((a, b) => a.price / a.durationMin - b.price / b.durationMin);

    setFilteredFlights(list);
  }, [flights, priceRange, selectedTimes, selectedStops, selectedAirlines, sortTab]);

  const airlines = [...new Set(flights.map((f) => f.airline))];

  const toggleTime = (t) =>
    setSelectedTimes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  const toggleStop = (s) =>
    setSelectedStops((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleAirline = (a) =>
    setSelectedAirlines((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  /* ────────── RENDER ────────── */
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ━━━━ Search Summary Bar ━━━━ */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
            {/* Search info pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5">
                <Plane size={16} className="text-primary" />
                <span className="text-sm font-medium text-gray-700">
                  Chuyến bay
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {searchParams.departure} → {searchParams.arrival}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Thời gian</span>
                <span className="text-sm font-semibold text-gray-900">
                  7:30 AM&nbsp;&nbsp;{new Date(searchParams.departDate).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5">
                <Users size={16} className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Số lượng</span>
                <span className="text-sm font-semibold text-gray-900">
                  {searchParams.passengers} Khách hàng
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowEditSearch(!showEditSearch)}
              className="flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full hover:bg-secondary transition-colors text-sm"
            >
              <Search size={16} />
              Chỉnh sửa tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* ━━━━ Main Content ━━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Chọn chuyến bay đến {searchParams.arrival}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tìm thấy {filteredFlights.length} chuyến bay phù hợp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ━━━━ Filter Sidebar ━━━━ */}
          <aside className="lg:col-span-1">
            <div className="space-y-5">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  Lọc
                </h3>
                <button
                  onClick={() => {
                    setPriceRange([minPrice, maxPrice]);
                    setSelectedTimes([]);
                    setSelectedStops([]);
                    setSelectedAirlines([]);
                  }}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Xóa
                </button>
              </div>

              {/* ── Price Filter ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xs">₫</span>
                  </span>
                  Lọc theo giá vé
                </h4>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
                  <span>{fmt(minPrice)}</span>
                  <span className="text-primary font-semibold">{fmt(priceRange[1])}</span>
                </div>
              </div>

              {/* ── Time Filter ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock size={14} className="text-primary" />
                  </span>
                  Thời gian
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "morning", label: "Sáng", icon: "☀️", sub: "5:00 - 12:00" },
                    { key: "afternoon", label: "Chiều", icon: "🌤️", sub: "12:00 - 17:00" },
                    { key: "evening", label: "Tối", icon: "🌙", sub: "17:00 - 24:00" },
                    { key: "night", label: "Khuya", icon: "🌑", sub: "0:00 - 5:00" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => toggleTime(t.key)}
                      className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all text-xs font-medium ${
                        selectedTimes.includes(t.key)
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Stops Filter ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin size={14} className="text-primary" />
                  </span>
                  Trạm dừng
                </h4>
                <div className="space-y-3">
                  {[
                    { val: 0, label: "Số điểm dừng" },
                    { val: 1, label: "Điểm dừng 1" },
                    { val: 2, label: "Điểm dừng 2" },
                  ].map((s) => (
                    <label key={s.val} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedStops.includes(s.val)}
                        onChange={() => toggleStop(s.val)}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        {s.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Airlines Filter ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <Plane size={14} className="text-primary" />
                  </span>
                  Hãng máy bay
                </h4>
                <div className="space-y-3">
                  {airlines.map((a) => (
                    <label key={a} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(a)}
                        onChange={() => toggleAirline(a)}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-5 h-5 bg-primary/20 rounded-sm flex items-center justify-center">
                          <Plane size={10} className="text-primary" />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                          {a}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ━━━━ Results Column ━━━━ */}
          <div className="lg:col-span-3">
            {/* Sorting Tabs */}
            <div className="flex items-center gap-0 mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {[
                { key: "cheapest", label: "Rẻ nhất", sub: filteredFlights.length > 0 ? fmt(filteredFlights[0]?.price || 0) : "—" },
                { key: "fastest", label: "Nhanh nhất", sub: filteredFlights.length > 0 ? (sortTab === "fastest" ? filteredFlights[0]?.duration : flights.reduce((min, f) => f.durationMin < min.durationMin ? f : min, flights[0])?.duration || "—") : "—" },
                { key: "best", label: "Tốt nhất", sub: "Đề cử cho bạn" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSortTab(tab.key)}
                  className={`flex-1 py-3.5 px-4 text-center transition-all ${
                    sortTab === tab.key
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className={`text-sm font-semibold ${sortTab === tab.key ? "text-white" : "text-gray-900"}`}>
                    {tab.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${sortTab === tab.key ? "text-white/80" : "text-gray-400"}`}>
                    {tab.sub}
                  </div>
                </button>
              ))}
            </div>

            {/* Flight Cards */}
            {isSearching ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                  <p className="mt-3 text-gray-500 text-sm font-medium">Đang tìm kiếm chuyến bay...</p>
                </div>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Plane size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Không tìm thấy chuyến bay phù hợp</p>
                  <p className="text-sm text-gray-400 mt-1">Hãy thử thay đổi bộ lọc</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightResultCard key={flight.id} flight={flight} navigate={navigate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ────────── Flight Result Card ────────── */
const FlightResultCard = ({ flight, navigate }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Airline Info */}
        <div className="flex items-center gap-3 px-5 py-4 md:w-[160px] md:border-r border-gray-100">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Plane size={18} className="text-primary" />
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm">{flight.airline}</div>
            <div className="text-xs text-gray-400">{flight.flightNumber}</div>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex-1 flex items-center px-5 py-4">
          <div className="flex items-center justify-between w-full gap-3">
            {/* Departure */}
            <div className="text-center min-w-[80px]">
              <div className="text-xl font-bold text-gray-900">{flight.departTime}</div>
              <div className="text-xs text-gray-500 mt-0.5">{flight.departureCity}</div>
            </div>

            {/* Duration line */}
            <div className="flex-1 flex flex-col items-center px-2">
              <div className="text-xs text-gray-400 font-medium mb-1">{flight.duration}</div>
              <div className="w-full flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="flex-1 h-[1.5px] bg-gray-300 relative">
                  <Plane size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                </div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <div className="text-xs text-primary font-medium mt-1">Sân bay</div>
            </div>

            {/* Arrival */}
            <div className="text-center min-w-[80px]">
              <div className="text-xl font-bold text-gray-900">{flight.arriveTime}</div>
              <div className="text-xs text-gray-500 mt-0.5">{flight.arrivalCity}</div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-3 px-4 py-3 md:border-l border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>🧳</span>
            <span>{flight.baggage}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>🍽️</span>
            <span>{flight.meal}</span>
          </div>
        </div>

        {/* Price + Book */}
        <div className="flex items-center gap-4 px-5 py-4 md:border-l border-gray-100 md:min-w-[200px]">
          <div className="flex-1">
            <div className="text-lg font-bold text-primary">{fmt(flight.price)}</div>
          </div>
          <button
            onClick={() => navigate(`/flight-seats/${flight.id}`)}
            className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm whitespace-nowrap"
          >
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;
