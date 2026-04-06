import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, Plane, Clock, MapPin, Calendar, Users, SlidersHorizontal } from "lucide-react";
import flightService from "../../services/flightService";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plane, SlidersHorizontal, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import flightService from "@/services/flightService";
import toast from "react-hot-toast";
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
    passengers: Number(searchParams?.passengers || 2),
    tripType: searchParams?.tripType === "round_trip" ? "round_trip" : "one_way",
    selectedAirlines: Array.isArray(searchParams?.selectedAirlines) ? searchParams.selectedAirlines : [],
  };
}

function airportLabel(airport) {
  if (!airport) return "";
  return `${airport.city || airport.name || airport.code} (${airport.code})`;
}

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
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [timeRange, setTimeRange] = useState("all");
  const [selectedStops, setSelectedStops] = useState(["0", "1", "2+"]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [preferredAirlines, setPreferredAirlines] = useState([]);

  useEffect(() => {
    const nextSearch = normalizeSearchParams(location.state?.searchParams);
    setSearchForm(nextSearch);
    setSearchMeta({
      departure: nextSearch.origin,
      arrival: nextSearch.destination,
      date: new Date(nextSearch.departureDate).toLocaleDateString("vi-VN"),
      time: "Cả ngày",
      passengers: nextSearch.passengers,
    });
    setPreferredAirlines(nextSearch.selectedAirlines || []);

    const fetchFlights = async () => {
      try {
        setLoading(true);
        const [airportsRes, flightsRes] = await Promise.all([
          flightService.getAirports(),
          flightService.searchFlights({
            origin: nextSearch.origin,
            destination: nextSearch.destination,
            departureDate: nextSearch.departureDate,
            returnDate: nextSearch.tripType === "round_trip" ? nextSearch.returnDate || undefined : undefined,
            passengers: {
              adults: Number(nextSearch.passengers || 1),
              children: 0,
              infants: 0,
            },
            tripType: nextSearch.tripType,
          }),
        ]);

        const airportItems = Array.isArray(airportsRes?.data || airportsRes?.airports) ? (airportsRes.data || airportsRes.airports) : [];
        setAirports(airportItems);

        const flights = Array.isArray(flightsRes?.data?.outboundFlights) ? flightsRes.data.outboundFlights : [];
        const mapped = flights.map((item) => ({
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
          durationMinutes: Number(item.duration || 150),
          durationLabel: getDurationLabel(item.duration),
          price: Number(item.fareClasses?.[0]?.basePrice || 900000),
          stops: Number(item.stops || 0),
          baggage: "15Kg",
          meal: "Bữa ăn",
        }));

        setAllFlights(mapped);
        if (mapped.length) {
          const maxInData = Math.max(...mapped.map((item) => item.price));
          setMaxPrice(maxInData);
          const airlineSet = [...new Set(mapped.map((item) => item.airline))];
          const preferred = (nextSearch.selectedAirlines || []).filter((item) => airlineSet.includes(item));
          setSelectedAirlines(preferred.length ? preferred : airlineSet);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Không tải được chuyến bay");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [location.state]);

  const handleSearch = async () => {
    if (!searchForm.origin || !searchForm.destination || !searchForm.departureDate) {
      toast.error("Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày đi");
      return;
    }

    try {
      setSearching(true);
      const response = await flightService.searchFlights({
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

      const flights = Array.isArray(response?.data?.outboundFlights) ? response.data.outboundFlights : [];
      const mapped = flights.map((item) => ({
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
        passengers: Number(searchForm.passengers || 1),
      });
      setTimeRange("all");
      setSelectedStops(["0", "1", "2+"]);
      if (mapped.length) {
        const airlineSet = [...new Set(mapped.map((item) => item.airline))];
        const preferred = preferredAirlines.filter((item) => airlineSet.includes(item));
        setSelectedAirlines(preferred.length ? preferred : airlineSet);
      } else {
        setSelectedAirlines([]);
      }
      if (mapped.length) {
        setMaxPrice(Math.max(...mapped.map((item) => item.price)));
      }
      setEditMode(false);

      if (!mapped.length) {
        toast("Không tìm thấy chuyến bay phù hợp", { icon: "ℹ️" });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Không tìm được chuyến bay");
    } finally {
      setSearching(false);
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
  const airportDisplay = (code) => {
    const airport = airports.find((item) => item.code === code);
    return airport ? airportLabel(airport) : code;
  };

  const airlineOptions = useMemo(() => [...new Set(allFlights.map((item) => item.airline))], [allFlights]);

  const filteredFlights = useMemo(() => {
    let flights = [...allFlights];

    flights = flights.filter((item) => item.price <= maxPrice);

    if (selectedAirlines.length) {
      flights = flights.filter((item) => selectedAirlines.includes(item.airline));
    }

    if (selectedStops.length) {
      flights = flights.filter((item) => {
        if (item.stops === 0) return selectedStops.includes("0");
        if (item.stops === 1) return selectedStops.includes("1");
        return selectedStops.includes("2+");
      });
    }

    if (timeRange !== "all") {
      flights = flights.filter((item) => {
        const hour = Number(item.departureTime.split(":")[0]);
        if (timeRange === "sang") return hour >= 6 && hour < 12;
        if (timeRange === "chieu") return hour >= 12 && hour < 18;
        if (timeRange === "toi") return hour >= 18 && hour < 22;
        if (timeRange === "khuya") return hour >= 22 || hour < 6;
        return true;
      });
    }

    const sorter = QUICK_SORTS.find((item) => item.key === quickSort) || QUICK_SORTS[0];
    return flights.sort((a, b) => sorter.getValue(a) - sorter.getValue(b));
  }, [allFlights, maxPrice, selectedAirlines, selectedStops, timeRange, quickSort]);

  const sortNotes = useMemo(() => {
    const result = {};
    QUICK_SORTS.forEach((sort) => {
      if (!filteredFlights.length) {
        result[sort.key] = "--";
      } else {
        const best = [...filteredFlights].sort((a, b) => sort.getValue(a) - sort.getValue(b))[0];
        result[sort.key] = sort.note(best);
      }
    });
    return result;
  }, [filteredFlights]);

  const toggleStops = (value) => {
    setSelectedStops((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const toggleAirline = (value) => {
    setSelectedAirlines((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

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
    <div className="min-h-screen bg-[#ececec] pb-10 font-sans text-slate-900 antialiased">
      <div className="mx-auto w-full max-w-[1280px]">
        <section className="border-y border-slate-300 bg-[#f6f6f6] px-4 py-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <InfoPill icon={Plane} title="Chuyến bay" value={`${airportDisplay(searchMeta.departure)} > ${airportDisplay(searchMeta.arrival)}`} />
            <InfoPill icon={CalendarDays} title="Thời gian" value={`${searchMeta.time} ${searchMeta.date}`} />
            <InfoPill icon={Users} title="Số lượng" value={`${searchMeta.passengers} Khách hàng`} />
            <button
              type="button"
              onClick={() => setEditMode((value) => !value)}
              className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-[#d9ecea] text-sm font-bold text-teal-700 transition hover:bg-[#cde5e2]"
            >
              <SlidersHorizontal size={16} />
              {editMode ? "Đóng chỉnh sửa" : "Chỉnh sửa tìm kiếm"}
            </button>
          </div>

          {editMode ? (
            <div className="mt-3 rounded-[18px] border border-slate-300 bg-white p-4 shadow-[0_4px_10px_rgba(15,23,42,0.08)]">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
                <SearchField
                  label="Điểm đi"
                  value={searchForm.origin}
                  onChange={(value) => setSearchForm((current) => ({ ...current, origin: value.toUpperCase() }))}
                  placeholder="SGN"
                />
                <SearchField
                  label="Điểm đến"
                  value={searchForm.destination}
                  onChange={(value) => setSearchForm((current) => ({ ...current, destination: value.toUpperCase() }))}
                  placeholder="HAN"
                />
                <SearchField
                  label="Ngày đi"
                  type="date"
                  value={searchForm.departureDate}
                  onChange={(value) => setSearchForm((current) => ({ ...current, departureDate: value }))}
                />
                <SearchField
                  label="Loại chuyến"
                  type="select"
                  value={searchForm.tripType}
                  onChange={(value) => setSearchForm((current) => ({ ...current, tripType: value }))}
                  options={[
                    { value: "one_way", label: "Một chiều" },
                    { value: "round_trip", label: "Khứ hồi" },
                  ]}
                />
                <SearchField
                  label="Hành khách"
                  type="number"
                  value={String(searchForm.passengers)}
                  onChange={(value) => setSearchForm((current) => ({ ...current, passengers: Math.max(1, Number(value || 1)) }))}
                  min="1"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={searching}
                  className="flex h-[54px] items-center justify-center rounded-2xl bg-[#159c90] px-5 text-base font-bold text-white transition hover:bg-[#10897f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {searching ? "Đang tìm..." : "Tìm chuyến bay"}
                </button>
              </div>

              {searchForm.tripType === "round_trip" ? (
                <div className="mt-3 max-w-xs">
                  <SearchField
                    label="Ngày về"
                    type="date"
                    value={searchForm.returnDate}
                    onChange={(value) => setSearchForm((current) => ({ ...current, returnDate: value }))}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="grid grid-cols-1 gap-5 px-4 pt-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[28px] font-bold tracking-tight">Lọc</h3>
              <button
                type="button"
                onClick={() => {
                  setTimeRange("all");
                  setSelectedStops(["0", "1", "2+"]);
                  setSelectedAirlines(airlineOptions);
                  if (allFlights.length) {
                    setMaxPrice(Math.max(...allFlights.map((item) => item.price)));
                  }
                }}
                className="text-xl font-black text-teal-500"
              >
                Xóa
              </button>
            </div>

            <FilterPanel title="Lọc theo giá vé">
              <input
                type="range"
                min={0}
                max={allFlights.length ? Math.max(...allFlights.map((item) => item.price)) : 5000000}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d7e8e6] accent-[#4fbba0]"
              />
              <div className="mt-3 flex items-center justify-between text-sm font-black text-slate-900">
                <span>900vnd</span>
                <span>{new Intl.NumberFormat("vi-VN").format(maxPrice)}vnd</span>
              </div>
            </FilterPanel>

            <FilterPanel title="Thời gian">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["sang", "Sáng", sangIcon],
                  ["chieu", "Chiều", chieuIcon],
                  ["toi", "Tối", toiIcon],
                  ["khuya", "Khuya", khuyaIcon],
                ].map(([key, label, icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTimeRange(key)}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 font-semibold ${
                      timeRange === key
                        ? "border-[#7fd2c3] bg-[#d9efeb] text-teal-700"
                        : "border-slate-300 bg-[#f6f6f6] text-slate-700"
                    }`}
                  >
                    <img src={icon} alt={label} className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </FilterPanel>

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
            <FilterPanel title="Trạm dừng">
              <div className="space-y-2 text-sm font-semibold text-slate-800">
                {[
                  ["0", "Số điểm dừng"],
                  ["1", "Điểm dừng 1"],
                  ["2+", "Điểm dừng 2"],
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedStops.includes(value)}
                      onChange={() => toggleStops(value)}
                      className="h-4 w-4 rounded accent-[#4fbba0]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </FilterPanel>

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
            <FilterPanel title="Hãng máy bay">
              <div className="space-y-2 text-xs text-slate-800">
                {airlineOptions.map((airline) => (
                  <label key={airline} className="flex items-center gap-2 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                      className="h-4 w-4 rounded accent-[#4fbba0]"
                    />
                    {airline}
                  </label>
                ))}
              </div>
            </FilterPanel>
          </aside>

          <div className="space-y-4">
            <div>
              <h1 className="text-[32px] font-black leading-[1.15] tracking-tight">Chọn chuyến bay đến Sài Gòn</h1>
              <p className="mt-1 text-sm text-slate-500">Tìm thấy {filteredFlights.length} chuyến bay phù hợp</p>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[18px] bg-[#e8e8e8]">
              {QUICK_SORTS.map((sort) => (
                <button
                  key={sort.key}
                  type="button"
                  onClick={() => setQuickSort(sort.key)}
                  className={`flex flex-col items-center justify-center px-3 py-3 text-sm font-bold ${
                    quickSort === sort.key ? "bg-[#12988f] text-white" : "text-slate-700"
                  }`}
                >
                  <span>{sort.label}</span>
                  <span className="text-sm leading-tight">{sortNotes[sort.key]}</span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="rounded-[20px] border border-slate-300 bg-white p-6 text-center text-slate-500">Đang tải chuyến bay...</div>
            ) : filteredFlights.length === 0 ? (
              <div className="rounded-[20px] border border-slate-300 bg-white p-6 text-center text-slate-500">Không có chuyến bay phù hợp với bộ lọc.</div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <article key={flight.id} className="rounded-[22px] border border-slate-300 bg-white px-5 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.25fr_1fr_0.55fr] lg:items-center">
                      <div className="flex items-center gap-2 text-sky-500">
                        <Plane size={22} className="-rotate-12" />
                        <span className="text-[11px] font-bold text-slate-400">{flight.airlineCode}</span>
                      </div>

                      <div className="grid grid-cols-[1.2fr_auto_1.2fr] items-center gap-3">
                        <div>
                          <p className="text-[20px] font-bold leading-tight">{flight.airline}</p>
                          <p className="mt-1 text-xs text-slate-500">{flight.airline} {flight.flightNumber}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-[32px] font-extrabold leading-none">{flight.departureTime}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-600">{flight.departureCity}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-500">{flight.durationLabel}</p>
                          <div className="mx-auto my-1 h-px w-full max-w-[94px] bg-slate-300" />
                          <p className="text-[32px] font-extrabold leading-none">{flight.arrivalTime}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-600">{flight.arrivalCity}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/flight-seats/${flight.id}`, { state: { flight } })}
                          className="h-12 w-full rounded-full bg-[#159c90] px-4 text-base font-bold leading-none text-white transition hover:bg-[#10897f]"
                        >
                          Đặt vé
                        </button>
                        <div className="flex items-center justify-center gap-2">
                          <span className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{flight.baggage}</span>
                          <span className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{flight.meal}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
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
        </section>
      </div>
    </div>
  );
};

function InfoPill({ icon: Icon, title, value }) {
  return (
    <div className="inline-flex h-[54px] items-center gap-3 rounded-full bg-[#d9ecea] px-5 text-sm">
      <Icon size={16} className="text-slate-700" />
      <div className="leading-tight">
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <p className="font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function FilterPanel({ title, children }) {
  return (
    <div className="rounded-[18px] border border-slate-300 bg-[#f6f6f6] p-3 shadow-[0_4px_10px_rgba(15,23,42,0.08)]">
      <p className="mb-3 text-lg font-bold text-slate-900">{title}</p>
      {children}
    </div>
  );
}

function SearchField({ label, type = "text", value, onChange, options = [], min, placeholder = "" }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</span>
      {type === "select" ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[54px] w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#4fbba0]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          min={min}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-[54px] w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#4fbba0]"
        />
      )}
    </label>
  );
}

export default FlightSearchPage;
