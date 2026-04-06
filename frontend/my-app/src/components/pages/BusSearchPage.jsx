import { createElement, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Bus,
  CalendarDays,
  ChevronDown,
  Filter,
  Heart,
  MapPin,
  PenSquare,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import busService from "@/services/busService";

const QUICK_SORT_OPTIONS = [
  { value: "recommended", label: "Phù hợp nhất" },
  { value: "price_asc", label: "Giá thấp nhất" },
  { value: "price_desc", label: "Giá cao nhất" },
  { value: "time_asc", label: "Khởi hành sớm" },
  { value: "seats_desc", label: "Nhiều chỗ trống" },
];

function formatTime(value) {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value) {
  if (!value) return "--/--/----";
  return new Date(value).toLocaleDateString("vi-VN");
}

function formatPrice(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value || 0)} VND`;
}

function formatDuration(minutes) {
  if (!Number.isFinite(minutes)) return "--";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} phút`;
  if (!m) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

function ResultCard({ trip }) {
  return (
    <article className="group rounded-[22px] border border-emerald-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(16,24,40,0.08)] sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 lg:pr-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Bus size={16} className="text-emerald-500" />
                <h3 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">{trip.provider}</h3>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{trip.subtitle}</p>
            </div>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-600">
              {trip.providerBadge}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
            <div>
              <p className="text-sm font-extrabold text-slate-900 sm:text-[15px]">{trip.departureTime}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{trip.departurePoint}</p>
            </div>
            <div className="flex flex-col items-center gap-2 px-1 text-slate-400">
              <ArrowRight size={22} className="hidden sm:block" />
              <ArrowRight size={18} className="sm:hidden" />
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-slate-900 sm:text-[15px]">{trip.arrivalTime}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{trip.arrivalPoint}</p>
            </div>
          </div>
        </div>

        <div className="hidden w-px bg-slate-200 lg:block" />

        <div className="flex flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:min-w-[190px] lg:flex-col lg:items-end lg:justify-center lg:border-t-0 lg:pt-0">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900 sm:text-sm">{trip.duration}</p>
            <p className="mt-1 text-[11px] text-slate-400">{trip.seatType}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-orange-500 sm:text-xl">{trip.price}</p>
            <p className="text-[11px] text-slate-400">/ chỗ ngồi</p>
          </div>
          <Link
            to={ROUTES.BUS_SEATS}
            state={{
              tripId: trip.id,
              farePrice: trip.farePrice,
              passengerCount: trip.passengerCount,
              busTrip: {
                route: `${trip.departureCity} → ${trip.arrivalCity}`,
                service: trip.provider,
                departureDate: trip.departureDate,
                departureTime: trip.departureTime,
                departurePoint: trip.departurePoint,
                arrivalPoint: trip.arrivalPoint,
                arrivalTime: trip.arrivalTime,
                duration: trip.duration,
              },
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
          >
            Đặt ngay
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {trip.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function BusSearchPage() {
  const location = useLocation();
  const searchCriteria = location.state?.searchCriteria || {};
  const [activeFilter, setActiveFilter] = useState("");
  const [passengerCount, setPassengerCount] = useState(
    Math.max(1, Number(searchCriteria.passengers) || 2),
  );
  const [selectedProviders, setSelectedProviders] = useState(
    Array.isArray(searchCriteria.selectedProviders) ? searchCriteria.selectedProviders : [],
  );
  const [selectedBusTypes, setSelectedBusTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [departureRange, setDepartureRange] = useState("all");
  const [maxPriceFilter, setMaxPriceFilter] = useState(0);
  const [quickSort, setQuickSort] = useState("recommended");
  const [showQuickSort, setShowQuickSort] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await busService.getBusTrips({
          origin: searchCriteria.origin,
          destination: searchCriteria.destination,
          date: searchCriteria.rawDate,
          passengers: passengerCount,
        });
        let trips = Array.isArray(res.data) ? res.data : [];

        // If strict filters return no results (e.g. user typed airport code), fallback to broad query.
        if (!trips.length) {
          const relaxed = await busService.getBusTrips({
            date: searchCriteria.rawDate,
            passengers: passengerCount,
          });
          trips = Array.isArray(relaxed.data) ? relaxed.data : [];
        }

        const mapped = trips.map((trip) => {
          return {
            id: trip._id,
            provider: trip.provider || "Nhà xe",
            subtitle: `${trip.busType || "Ghế ngồi"} - ${trip.availableSeats ?? 0} chỗ trống`,
            departureTime: formatTime(trip.departureTime),
            departurePoint: trip.pickupPoint || "Điểm đi",
            arrivalTime: formatTime(trip.arrivalTime),
            arrivalPoint: trip.dropoffPoint || "Điểm đến",
            duration: formatDuration(trip.durationMinutes),
            price: formatPrice(trip.pricePerSeat || 0),
            seatType: `/ ${trip.availableSeats ?? 0} chỗ`,
            tags: [trip.busType || "BUS", ...(trip.amenities || []).slice(0, 2), "BUS API"],
            providerBadge: (trip.availableSeats || 0) > 10 ? "Sẵn chỗ" : "Sắp hết",
            departureCity: trip.origin || "N/A",
            arrivalCity: trip.destination || "N/A",
            departureDate: formatDate(trip.departureTime),
            farePrice: trip.pricePerSeat || 0,
            passengerCount,
            departureTs: new Date(trip.departureTime).getTime(),
            departureHour: new Date(trip.departureTime).getHours(),
            availableSeats: Number(trip.availableSeats || 0),
            busType: trip.busType || "Ghế ngồi",
            amenities: trip.amenities || [],
          };
        });

        setResults(mapped);
      } catch (err) {
        setError(err.response?.data?.message || "Không tải được danh sách chuyến từ API");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [passengerCount, searchCriteria.destination, searchCriteria.origin, searchCriteria.rawDate]);

  const providerOptions = useMemo(
    () => [...new Set(results.map((item) => item.provider))],
    [results],
  );

  const busTypeOptions = useMemo(
    () => [...new Set(results.map((item) => item.busType))],
    [results],
  );

  const amenityOptions = useMemo(
    () => [...new Set(results.flatMap((item) => item.amenities || []))],
    [results],
  );

  const maxPriceInData = useMemo(
    () => results.reduce((max, item) => Math.max(max, Number(item.farePrice || 0)), 0),
    [results],
  );

  useEffect(() => {
    if (!maxPriceInData) {
      setMaxPriceFilter(0);
      return;
    }
    if (!maxPriceFilter || maxPriceFilter > maxPriceInData) {
      setMaxPriceFilter(maxPriceInData);
    }
  }, [maxPriceInData, maxPriceFilter]);

  const toggleInList = (value, list, setter) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
      return;
    }
    setter([...list, value]);
  };

  const resetFilters = () => {
    setSelectedProviders([]);
    setSelectedBusTypes([]);
    setSelectedAmenities([]);
    setDepartureRange("all");
    setQuickSort("recommended");
    setActiveFilter("");
    setMaxPriceFilter(maxPriceInData || 0);
  };

  const filteredResults = useMemo(() => {
    let list = [...results];

    if (activeFilter) {
      const f = activeFilter.toLowerCase();
      list = list.filter(
        (item) =>
          item.arrivalPoint.toLowerCase().includes(f) ||
          item.arrivalCity?.toLowerCase().includes(f),
      );
    }

    if (selectedProviders.length) {
      list = list.filter((item) => selectedProviders.includes(item.provider));
    }

    if (selectedBusTypes.length) {
      list = list.filter((item) => selectedBusTypes.includes(item.busType));
    }

    if (selectedAmenities.length) {
      list = list.filter((item) =>
        selectedAmenities.every((amenity) => (item.amenities || []).includes(amenity)),
      );
    }

    if (departureRange !== "all") {
      list = list.filter((item) => {
        const h = item.departureHour;
        if (departureRange === "morning") return h >= 5 && h < 12;
        if (departureRange === "afternoon") return h >= 12 && h < 18;
        if (departureRange === "evening") return h >= 18 && h <= 22;
        return h >= 23 || h < 5;
      });
    }

    if (maxPriceFilter > 0) {
      list = list.filter((item) => Number(item.farePrice || 0) <= maxPriceFilter);
    }

    list = list.filter((item) => Number(item.availableSeats || 0) >= passengerCount);

    if (quickSort === "price_asc") {
      list.sort((a, b) => a.farePrice - b.farePrice);
    } else if (quickSort === "price_desc") {
      list.sort((a, b) => b.farePrice - a.farePrice);
    } else if (quickSort === "time_asc") {
      list.sort((a, b) => a.departureTs - b.departureTs);
    } else if (quickSort === "seats_desc") {
      list.sort((a, b) => b.availableSeats - a.availableSeats);
    }

    return list;
  }, [
    activeFilter,
    departureRange,
    maxPriceFilter,
    passengerCount,
    quickSort,
    results,
    selectedAmenities,
    selectedBusTypes,
    selectedProviders,
  ]);

  return (
    <div className="min-h-screen bg-[#f7fbfa] text-slate-900">
      <section className="border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Bus size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">VivaVivu</p>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Tìm xe khách</h1>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-3 shadow-[0_12px_30px_rgba(16,24,40,0.04)] lg:grid-cols-[1.1fr_1fr_0.9fr_auto] lg:items-center">
            <SearchPill icon={Bus} label="Xe khách" value={`${searchCriteria.origin || "Sài Gòn"} → ${searchCriteria.destination || "Đà Lạt"}`} />
            <SearchPill icon={CalendarDays} label="Thời gian" value={searchCriteria.departureDate || "29/1/2025"} />
            <SearchPill
              icon={Users}
              label="Số lượng"
              value={`${passengerCount} khách hàng`}
              extra={(
                <div className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setPassengerCount((v) => Math.max(1, v - 1))}
                    className="h-6 w-6 rounded-full bg-white text-slate-700 hover:bg-slate-50"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassengerCount((v) => Math.min(9, v + 1))}
                    className="h-6 w-6 rounded-full bg-white text-slate-700 hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>
              )}
            />
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition-transform hover:-translate-y-0.5"
            >
              <PenSquare size={16} />
              Chỉnh sửa tìm kiếm
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-white shadow-[0_10px_28px_rgba(16,24,40,0.06)]">
              <div className="flex items-center justify-between border-b border-emerald-100 px-4 py-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Lọc</h2>
                  <p className="mt-1 text-xs text-slate-500">Hiển thị kết quả dựa trên danh mục của bạn</p>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
              <div className="space-y-4 p-4">
                <FilterBlock title="Hãng xe">
                  {providerOptions.map((provider) => (
                    <label key={provider} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedProviders.includes(provider)}
                        onChange={() => toggleInList(provider, selectedProviders, setSelectedProviders)}
                        className="accent-emerald-600"
                      />
                      {provider}
                    </label>
                  ))}
                </FilterBlock>

                <FilterBlock title="Loại xe">
                  {busTypeOptions.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedBusTypes.includes(type)}
                        onChange={() => toggleInList(type, selectedBusTypes, setSelectedBusTypes)}
                        className="accent-emerald-600"
                      />
                      {type}
                    </label>
                  ))}
                </FilterBlock>

                <FilterBlock title="Tiện ích">
                  {amenityOptions.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleInList(amenity, selectedAmenities, setSelectedAmenities)}
                        className="accent-emerald-600"
                      />
                      {amenity}
                    </label>
                  ))}
                </FilterBlock>

                <FilterBlock title="Giờ khởi hành">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="radio" name="departureRange" checked={departureRange === "all"} onChange={() => setDepartureRange("all")} className="accent-emerald-600" />
                    Tất cả
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="radio" name="departureRange" checked={departureRange === "morning"} onChange={() => setDepartureRange("morning")} className="accent-emerald-600" />
                    Sáng (05:00 - 11:59)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="radio" name="departureRange" checked={departureRange === "afternoon"} onChange={() => setDepartureRange("afternoon")} className="accent-emerald-600" />
                    Chiều (12:00 - 17:59)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="radio" name="departureRange" checked={departureRange === "evening"} onChange={() => setDepartureRange("evening")} className="accent-emerald-600" />
                    Tối (18:00 - 22:59)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="radio" name="departureRange" checked={departureRange === "night"} onChange={() => setDepartureRange("night")} className="accent-emerald-600" />
                    Khuya (23:00 - 04:59)
                  </label>
                </FilterBlock>

                <FilterBlock title="Giá tối đa">
                  <input
                    type="range"
                    min={0}
                    max={maxPriceInData || 0}
                    value={Math.min(maxPriceFilter, maxPriceInData || 0)}
                    onChange={(event) => setMaxPriceFilter(Number(event.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <p className="text-xs font-semibold text-slate-500">
                    Đến {new Intl.NumberFormat("vi-VN").format(maxPriceFilter || 0)} đ
                  </p>
                </FilterBlock>
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <Heart size={19} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">Tốt nhất cho tìm kiếm của bạn</h2>
                  <p className="mt-1 text-sm text-slate-500">{filteredResults.length} chuyến xe phù hợp đang hiển thị</p>
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowQuickSort((v) => !v)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-emerald-200 hover:text-emerald-600"
                >
                  <SlidersHorizontal size={16} />
                  Bộ lọc nhanh
                  <ChevronDown size={16} />
                </button>
                {showQuickSort && (
                  <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    {QUICK_SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setQuickSort(option.value);
                          setShowQuickSort(false);
                        }}
                        className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${quickSort === option.value ? "bg-emerald-50 font-bold text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(16,24,40,0.05)] sm:p-5">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  <MapPin size={15} /> {activeFilter || "Tất cả điểm đến"}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveFilter("Sài Gòn")}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100"
                >
                  <Filter size={15} />
                  Lọc nhanh khu vực
                </button>
              </div>

              <div className="space-y-4">
                {loading && <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500">Đang tải dữ liệu chuyến từ API...</p>}
                {!loading && !!error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm font-semibold text-red-600">{error}</p>}
                {!loading && !error && !filteredResults.length && <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500">Không có chuyến phù hợp từ API.</p>}
                {!loading && !error && filteredResults.map((trip) => (
                  <ResultCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SearchPill({ icon, label, value, extra = null }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3 shadow-sm ring-1 ring-emerald-100">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        {icon ? createElement(icon, { size: 18 }) : null}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <div className="flex items-center">
          <p className="text-sm font-bold text-slate-900">{value}</p>
          {extra}
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }) {
  return (
    <section className="space-y-2 border-b border-slate-100 pb-3 last:border-b-0">
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <div className="space-y-1">{children}</div>
    </section>
  );
}