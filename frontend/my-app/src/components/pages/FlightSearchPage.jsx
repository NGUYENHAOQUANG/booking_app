import { createElement, useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Plane, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  SlidersHorizontal,
  CalendarDays,
  Search
} from "lucide-react";
import flightService from "../../services/flightService";
import toast from "react-hot-toast";

// Assets (Assuming these exist based on the previous code)
import sangIcon from "@/assets/icon/sang.svg";
import chieuIcon from "@/assets/icon/chieu.svg";
import toiIcon from "@/assets/icon/toi.svg";
import khuyaIcon from "@/assets/icon/khuya.svg";

const QUICK_SORTS = [
  { key: "cheap", label: "Rẻ nhất", getValue: (flight) => flight.price, note: (flight) => `${new Intl.NumberFormat("vi-VN").format(flight.price)}Vnd` },
  { key: "fast", label: "Nhanh nhất", getValue: (flight) => flight.durationMinutes, note: (flight) => `${Math.floor(flight.durationMinutes / 60)}h${String(flight.durationMinutes % 60).padStart(2, "0")}m` },
  { key: "recommended", label: "Tốt nhất", getValue: (flight) => flight.price * 0.7 + flight.durationMinutes * 600, note: () => "Đề cử cho bạn" },
];

function toTime(value) {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function getDurationLabel(minutes) {
  const value = Number(minutes || 0);
  if (!value) return "--";
  const h = Math.floor(value / 60);
  const m = value % 60;
  return `${h}h${String(m).padStart(2, "0")}m`;
}

function normalizeSearchParams(searchParams) {
  return {
    origin: searchParams?.departure || searchParams?.origin || "SGN",
    destination: searchParams?.arrival || searchParams?.destination || "HAN",
    departureDate: searchParams?.departDate || searchParams?.departureDate || new Date().toISOString().slice(0, 10),
    returnDate: searchParams?.returnDate || "",
    passengers: Number(searchParams?.passengers || 1),
    tripType: searchParams?.tripType === "round_trip" ? "round_trip" : "one_way",
    selectedAirlines: Array.isArray(searchParams?.selectedAirlines) ? searchParams.selectedAirlines : [],
  };
}

function airportLabel(airport) {
  if (!airport) return "";
  return `${airport.city || airport.name || airport.code} (${airport.code})`;
}

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

const InfoPill = ({ icon, title, value }) => (
  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5">
    {icon ? createElement(icon, { size: 16, className: "text-[#159c90]" }) : null}
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">{title}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  </div>
);

const SearchField = ({ label, type = "text", value, onChange, placeholder, options, min }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-400 uppercase ml-1">{label}</label>
    {type === "select" ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[54px] rounded-xl border border-gray-200 px-4 text-sm font-medium focus:border-[#159c90] focus:ring-1 focus:ring-[#159c90] outline-none transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className="h-[54px] rounded-xl border border-gray-200 px-4 text-sm font-medium focus:border-[#159c90] focus:ring-1 focus:ring-[#159c90] outline-none transition-all"
      />
    )}
  </div>
);

const FilterPanel = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
      {title}
    </h4>
    {children}
  </div>
);

const FlightSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchForm, setSearchForm] = useState(() => normalizeSearchParams(location.state?.searchParams));
  const [editMode, setEditMode] = useState(false);
  const [airports, setAirports] = useState([]);
  
  const [searchMeta, setSearchMeta] = useState(() => ({
    departure: searchForm.origin,
    arrival: searchForm.destination,
    date: new Date(searchForm.departureDate).toLocaleDateString("vi-VN"),
    time: "Cả ngày",
    passengers: searchForm.passengers,
  }));

  const [allFlights, setAllFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [quickSort, setQuickSort] = useState("cheap");
  const [maxPrice, setMaxPrice] = useState(20000000);
  const [timeRange, setTimeRange] = useState("all");
  const [selectedStops, setSelectedStops] = useState(["0", "1", "2+"]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  const airportDisplay = (code) => {
    const airport = airports.find((item) => item.code === code);
    return airport ? airportLabel(airport) : code;
  };

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const params = normalizeSearchParams(location.state?.searchParams);
      
      const [airportsRes, flightsRes] = await Promise.all([
        flightService.getAirports(),
        flightService.searchFlights({
          origin: params.origin,
          destination: params.destination,
          departureDate: params.departureDate,
          returnDate: params.tripType === "round_trip" ? params.returnDate || undefined : undefined,
          passengers: {
            adults: Number(params.passengers || 1),
            children: 0,
            infants: 0,
          },
          tripType: params.tripType,
        }),
      ]);

      setAirports(Array.isArray(airportsRes?.data) ? airportsRes.data : (airportsRes?.airports || []));

      const rawFlights = Array.isArray(flightsRes?.data?.outboundFlights) ? flightsRes.data.outboundFlights : [];
      const mapped = rawFlights.map((item) => ({
        id: item._id,
        airline: item.airline?.name || "Airline",
        airlineCode: item.airline?.code || "VN",
        flightNumber: item.flightNumber || "VN357",
        departureCode: item.origin?.code || "SGN",
        departureCity: item.origin?.city || "Sài Gòn",
        arrivalCode: item.destination?.code || "HAN",
        arrivalCity: item.destination?.city || "Hà Nội",
        departureTime: toTime(item.departureTime),
        arrivalTime: toTime(item.arrivalTime),
        departHour: new Date(item.departureTime).getHours(),
        durationMinutes: Number(item.duration || 150),
        durationLabel: getDurationLabel(item.duration),
        price: Number(item.fareClasses?.[0]?.basePrice || 900000),
        stops: Number(item.stops || 0),
        baggage: "15Kg",
        meal: "Bữa ăn",
      }));

      setAllFlights(mapped);
      if (mapped.length) {
        setMaxPrice(Math.max(...mapped.map((item) => item.price)));
        const airlines = [...new Set(mapped.map((item) => item.airline))];
        setSelectedAirlines(airlines);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không tải được dữ liệu chuyến bay");
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = async () => {
    if (!searchForm.origin || !searchForm.destination || !searchForm.departureDate) {
      toast.error("Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày đi");
      return;
    }

    try {
      setSearching(true);
      const res = await flightService.searchFlights({
        origin: searchForm.origin,
        destination: searchForm.destination,
        departureDate: searchForm.departureDate,
        returnDate: searchForm.tripType === "round_trip" ? searchForm.returnDate || undefined : undefined,
        passengers: {
          adults: Number(searchForm.passengers || 1),
          children: 0,
          infants: 0,
        },
        tripType: searchForm.tripType,
      });

      const rawFlights = Array.isArray(res?.data?.outboundFlights) ? res.data.outboundFlights : [];
      const mapped = rawFlights.map((item) => ({
        id: item._id,
        airline: item.airline?.name || "Airline",
        airlineCode: item.airline?.code || "VN",
        flightNumber: item.flightNumber || "VN357",
        departureCode: item.origin?.code || "SGN",
        departureCity: item.origin?.city || "Sài Gòn",
        arrivalCode: item.destination?.code || "HAN",
        arrivalCity: item.destination?.city || "Hà Nội",
        departureTime: toTime(item.departureTime),
        arrivalTime: toTime(item.arrivalTime),
        departHour: new Date(item.departureTime).getHours(),
        durationMinutes: Number(item.duration || 150),
        durationLabel: getDurationLabel(item.duration),
        price: Number(item.fareClasses?.[0]?.basePrice || 900000),
        stops: Number(item.stops || 0),
        baggage: "15Kg",
        meal: "Bữa ăn",
      }));

      setAllFlights(mapped);
      setSearchMeta({
        departure: searchForm.origin,
        arrival: searchForm.destination,
        date: new Date(searchForm.departureDate).toLocaleDateString("vi-VN"),
        time: "Cả ngày",
        passengers: searchForm.passengers,
      });
      
      if (mapped.length) {
        setMaxPrice(Math.max(...mapped.map((item) => item.price)));
        setSelectedAirlines([...new Set(mapped.map((item) => item.airline))]);
      }
      setEditMode(false);
      if (!mapped.length) toast("Không tìm thấy chuyến bay phù hợp", { icon: "ℹ️" });
    } catch {
      toast.error("Lỗi tìm kiếm chuyến bay");
    } finally {
      setSearching(false);
    }
  };

  const filteredFlights = useMemo(() => {
    let list = [...allFlights];

    // Filter by Price
    list = list.filter((item) => item.price <= maxPrice);

    // Filter by Airline
    if (selectedAirlines.length) {
      list = list.filter((item) => selectedAirlines.includes(item.airline));
    }

    // Filter by Stops
    if (selectedStops.length) {
      list = list.filter((item) => {
        const s = item.stops;
        if (s === 0) return selectedStops.includes("0");
        if (s === 1) return selectedStops.includes("1");
        return selectedStops.includes("2+");
      });
    }

    // Filter by Time Range
    if (timeRange !== "all") {
      list = list.filter((item) => {
        const h = item.departHour;
        if (timeRange === "sang") return h >= 6 && h < 12;
        if (timeRange === "chieu") return h >= 12 && h < 18;
        if (timeRange === "toi") return h >= 18 && h < 22;
        if (timeRange === "khuya") return h >= 22 || h < 6;
        return true;
      });
    }

    // Sort
    const sorter = QUICK_SORTS.find((s) => s.key === quickSort) || QUICK_SORTS[0];
    return list.sort((a, b) => sorter.getValue(a) - sorter.getValue(b));
  }, [allFlights, maxPrice, selectedAirlines, selectedStops, timeRange, quickSort]);

  const toggleStop = (val) => {
    setSelectedStops((prev) => 
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const toggleAirline = (val) => {
    setSelectedAirlines((prev) => 
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <InfoPill icon={Plane} title="Chuyến bay" value={`${airportDisplay(searchMeta.departure)} → ${airportDisplay(searchMeta.arrival)}`} />
              <InfoPill icon={CalendarDays} title="Ngày đi" value={searchMeta.date} />
              <InfoPill icon={Users} title="Hành khách" value={`${searchMeta.passengers} Khách`} />
            </div>
            
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#e0f2f1] text-[#00796b] rounded-full font-bold text-sm hover:bg-[#b2dfdb] transition-colors"
            >
              <SlidersHorizontal size={16} />
              {editMode ? "Đóng chỉnh sửa" : "Chỉnh sửa tìm kiếm"}
            </button>
          </div>

          {editMode && (
            <div className="mt-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in slide-in-from-top duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <SearchField label="Điểm đi" value={searchForm.origin} onChange={(v) => setSearchForm({...searchForm, origin: v.toUpperCase()})} placeholder="SGN" />
                <SearchField label="Điểm đến" value={searchForm.destination} onChange={(v) => setSearchForm({...searchForm, destination: v.toUpperCase()})} placeholder="HAN" />
                <SearchField label="Ngày đi" type="date" value={searchForm.departureDate} onChange={(v) => setSearchForm({...searchForm, departureDate: v})} />
                <SearchField label="Hành khách" type="number" min="1" value={searchForm.passengers} onChange={(v) => setSearchForm({...searchForm, passengers: v})} />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="h-[54px] self-end bg-[#159c90] text-white rounded-xl font-bold hover:bg-[#10897f] disabled:opacity-50 appearance-none"
                >
                  {searching ? "Đang tìm..." : "Tìm chuyến bay"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Bộ lọc</h3>
              <button 
                onClick={() => {
                  setTimeRange("all");
                  setSelectedStops(["0", "1", "2+"]);
                  setSelectedAirlines([...new Set(allFlights.map(f => f.airline))]);
                  if (allFlights.length) setMaxPrice(Math.max(...allFlights.map(f => f.price)));
                }}
                className="text-sm font-bold text-[#159c90] hover:underline"
              >
                Xóa tất cả
              </button>
            </div>

            <FilterPanel title="Lọc theo giá vé">
              <input
                type="range"
                min={0}
                max={allFlights.length ? Math.max(...allFlights.map(f => f.price)) : 20000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#159c90]"
              />
              <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
                <span>0đ</span>
                <span className="text-[#159c90]">{fmt(maxPrice)}</span>
              </div>
            </FilterPanel>

            <FilterPanel title="Thời gian khởi hành">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "sang", label: "Sáng", icon: sangIcon, h: "6:00 - 12:00" },
                  { key: "chieu", label: "Chiều", icon: chieuIcon, h: "12:00 - 18:00" },
                  { key: "toi", label: "Tối", icon: toiIcon, h: "18:00 - 22:00" },
                  { key: "khuya", label: "Khuya", icon: khuyaIcon, h: "22:00 - 6:00" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTimeRange(timeRange === t.key ? "all" : t.key)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                      timeRange === t.key 
                      ? "border-[#159c90] bg-[#e0f2f1] text-[#00796b]" 
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    <img src={t.icon} alt="" className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">{t.label}</span>
                    <span className="text-[10px] opacity-60 font-medium">{t.h}</span>
                  </button>
                ))}
              </div>
            </FilterPanel>

            <FilterPanel title="Số trạm dừng">
              <div className="space-y-3">
                {[
                  { val: "0", label: "Bay thẳng" },
                  { val: "1", label: "1 điểm dừng" },
                  { val: "2+", label: "2+ điểm dừng" },
                ].map((s) => (
                  <label key={s.val} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedStops.includes(s.val)}
                      onChange={() => toggleStop(s.val)}
                      className="w-5 h-5 rounded border-gray-300 text-[#159c90] focus:ring-[#159c90] accent-[#159c90]"
                    />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors uppercase">{s.label}</span>
                  </label>
                ))}
              </div>
            </FilterPanel>

            <FilterPanel title="Hãng hàng không">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {[...new Set(allFlights.map(f => f.airline))].map((airline) => (
                  <label key={airline} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                      className="w-5 h-5 rounded border-gray-300 text-[#159c90] focus:ring-[#159c90] accent-[#159c90]"
                    />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 truncate uppercase">{airline}</span>
                  </label>
                ))}
              </div>
            </FilterPanel>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sorting */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex shadow-sm">
              {QUICK_SORTS.map((sort) => {
                const isActive = quickSort === sort.key;
                return (
                  <button
                    key={sort.key}
                    onClick={() => setQuickSort(sort.key)}
                    className={`flex-1 py-4 px-6 text-left transition-all ${
                      isActive ? "bg-[#159c90] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`text-sm font-bold uppercase tracking-wider ${isActive ? "text-white" : "text-gray-400"}`}>{sort.label}</div>
                    <div className={`text-lg font-black mt-0.5`}>
                      {filteredFlights.length > 0 ? sort.note([...filteredFlights].sort((a,b) => sort.getValue(a) - sort.getValue(b))[0]) : "—"}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Flight Cards */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <div className="w-12 h-12 border-4 border-[#159c90]/20 border-t-[#159c90] rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tìm chuyến bay...</p>
              </div>
            ) : filteredFlights.length > 0 ? (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <div key={flight.id} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:border-[#159c90]/30 transition-all group overflow-hidden relative">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      {/* Airline */}
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-[#159c90]/20 transition-colors">
                          <Plane className="text-[#159c90] rotate-45" size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 uppercase tracking-tight">{flight.airline}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{flight.flightNumber}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex-1 flex items-center justify-center gap-8">
                        <div className="text-center">
                          <div className="text-2xl font-black text-gray-900">{flight.departureTime}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{flight.departureCode}</div>
                        </div>
                        
                        <div className="flex-1 max-w-[120px] flex flex-col items-center gap-1">
                          <div className="text-[10px] font-black text-[#159c90] uppercase tracking-tighter">{flight.durationLabel}</div>
                          <div className="w-full h-[2px] bg-gray-100 relative">
                            <div className="absolute top-1/2 left-0 w-2 h-2 border-2 border-gray-200 bg-white rounded-full -translate-y-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-2 h-2 border-2 border-gray-200 bg-white rounded-full -translate-y-1/2"></div>
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase">{flight.stops === 0 ? "Bay thẳng" : `${flight.stops} Điểm dừng`}</div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-black text-gray-900">{flight.arrivalTime}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{flight.arrivalCode}</div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="text-right min-w-[180px]">
                        <div className="text-sm font-bold text-gray-400 line-through">1.200.000đ</div>
                        <div className="text-2xl font-black text-[#159c90]">{fmt(flight.price)}</div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">mỗi hành khách</p>
                        <button 
                          onClick={() => navigate(`/flight-seats/${flight.id}`)}
                          className="px-8 py-3 bg-[#159c90] text-white rounded-2xl font-bold text-sm hover:bg-[#10897f] hover:shadow-lg hover:shadow-[#159c90]/20 transition-all uppercase tracking-wider"
                        >
                          Chọn ghế
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <Search size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest">Không có chuyến bay phù hợp</p>
                <button 
                  onClick={() => {
                    setTimeRange("all");
                    setSelectedStops(["0", "1", "2+"]);
                    setSelectedAirlines([...new Set(allFlights.map(f => f.airline))]);
                    if (allFlights.length) setMaxPrice(Math.max(...allFlights.map(f => f.price)));
                  }}
                  className="mt-4 text-[#159c90] font-bold hover:underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;
