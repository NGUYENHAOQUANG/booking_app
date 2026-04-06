import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Ticket,
  Users,
  Bus,
  Star,
  MapPinned,
  Headphones,
  BadgeCheck,
  Plus,
  Minus,
} from "lucide-react";
import api from "@/services/Axiosinstance";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";

const AIRLINE_LOGOS = ["VietJet Air", "VNA", "Bamboo", "Vietravel"];
const BUS_PROVIDERS = ["Phương Trang", "Kumho", "Thành Bưởi", "Hoàng Long"];

const DEFAULT_FLASH_DEALS = [
  {
    title: "TP. HỒ CHÍ MINH",
    subtitle: "Roundtrip Economy",
    price: "100.000VND",
    oldPrice: "120.000VND",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "TP. HỒ CHÍ MINH",
    subtitle: "Roundtrip Economy",
    price: "100.000VND",
    oldPrice: "120.000VND",
    image:
      "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "TP. HỒ CHÍ MINH",
    subtitle: "Roundtrip Economy",
    price: "100.000VND",
    oldPrice: "120.000VND",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "TP. HỒ CHÍ MINH",
    subtitle: "Roundtrip Economy",
    price: "100.000VND",
    oldPrice: "120.000VND",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=900",
  },
];

const DEFAULT_COMBOS = [
  {
    tag: "Xu hướng",
    title: "Chuyến tham gia di sản văn hoá",
    subtitle: "Khám phá vẻ đẹp của miền Trung Việt Nam",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
  },
  {
    tag: "",
    title: "Cuộc chạy trốn cuối tuần",
    subtitle: "Chuyến đi ngắn ngày cho người bận",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200",
  },
  {
    tag: "",
    title: "Du lịch một mình",
    subtitle: "Tìm lại chính bạn thân mình",
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200",
  },
  {
    tag: "Thịnh hành",
    title: "Đêm nhạc & buổi hoà nhạc",
    subtitle: "Trải nghiệm cuộc sống sôi động của thành phố",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200",
  },
];

const FEATURE_CARDS = [
  {
    icon: ShieldCheck,
    title: "Bảo mật thanh toán",
    text: "100% bảo mật chuyển đổi",
  },
  {
    icon: Headphones,
    title: "24/7 Hỗ trợ",
    text: "Chúng tôi ở đây để hỗ trợ",
  },
  {
    icon: BadgeCheck,
    title: "Đối tác tin cậy",
    text: "Chỉ đặt phòng chính thức",
  },
];

const DEAL_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=900",
];

const COMBO_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200",
];

function formatVnd(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Math.max(0, Number(value || 0)))}VND`;
}

function formatDurationMinutes(minutes) {
  const total = Number(minutes || 0);
  if (!total) return "Thời lượng linh hoạt";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} phút`;
  if (!m) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

function SearchTab({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2.5 h-14 font-semibold transition-all ${active ? "bg-white text-slate-900 shadow-sm" : "text-white/95 hover:bg-white/10"}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function DealCard({ deal, onBook }) {
  return (
    <article className="w-[260px] shrink-0 rounded-[22px] overflow-hidden bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] border border-black/5">
      <div className="h-[160px] overflow-hidden">
        <img src={deal.image} alt={deal.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4 space-y-1.5">
        <p className="text-[11px] font-semibold text-teal-500">Chuyến bay</p>
        <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">{deal.title}</h3>
        <p className="text-xs text-slate-400">{deal.subtitle}</p>
        <div className="flex items-end gap-2 pt-1">
          <span className="text-[15px] font-bold text-orange-500">{deal.price}</span>
          <span className="text-[12px] text-slate-300 line-through">{deal.oldPrice}</span>
        </div>
        <button
          type="button"
          onClick={onBook}
          className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg bg-teal-600 px-3 text-xs font-bold text-white transition-colors hover:bg-teal-700"
        >
          Chọn và đặt ngay
        </button>
      </div>
    </article>
  );
}

function ComboCard({ combo, onBook }) {
  const isTrending = combo.tag === "Thịnh hành";

  return (
    <article className="relative h-[210px] md:h-[230px] overflow-hidden rounded-[32px] text-white shadow-[0_18px_42px_rgba(15,23,42,0.16)]">
      <img src={combo.image} alt={combo.title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        {combo.tag ? (
          <span
            className={`mb-2 inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-sm ${
              isTrending ? "bg-orange-600 text-white" : "bg-white/35 text-white"
            }`}
          >
            {combo.tag}
          </span>
        ) : null}
        <h3 className="text-[16px] md:text-[18px] font-semibold leading-tight tracking-tight text-white drop-shadow-sm">
          {combo.title}
        </h3>
        <p className="mt-1 text-[14px] md:text-[15px] text-white/85 font-semibold leading-tight drop-shadow-sm">
          {combo.subtitle}
        </p>
        <button
          type="button"
          onClick={onBook}
          className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-white"
        >
          Đặt chuyến này
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [tab, setTab] = useState("flight");
  const [tripType, setTripType] = useState("round");
  const [origin, setOrigin] = useState("HAN");
  const [destination, setDestination] = useState("SGN");
  const [departDate, setDepartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [returnDate, setReturnDate] = useState(() => {
    const nextDay = new Date(Date.now() + 86400000);
    return nextDay.toISOString().slice(0, 10);
  });
  const [passengers, setPassengers] = useState(2);
  const [airports, setAirports] = useState([]);
  const [airportLoading, setAirportLoading] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState(AIRLINE_LOGOS);
  const [selectedBusProviders, setSelectedBusProviders] = useState(BUS_PROVIDERS);
  const [flashDeals, setFlashDeals] = useState([]);
  const [comboTrips, setComboTrips] = useState([]);

  const deals = useMemo(
    () => (flashDeals.length ? flashDeals : DEFAULT_FLASH_DEALS),
    [flashDeals],
  );

  const combos = useMemo(() => {
    const source = comboTrips.length ? comboTrips : DEFAULT_COMBOS;
    const normalized = [...source];
    while (normalized.length < 4) {
      normalized.push(DEFAULT_COMBOS[normalized.length % DEFAULT_COMBOS.length]);
    }
    return normalized.slice(0, 4);
  }, [comboTrips]);

  const providers = tab === "flight" ? AIRLINE_LOGOS : BUS_PROVIDERS;

  const buildFlightSeatPath = (flightId) => ROUTES.FLIGHT_SEATS.replace(":flightId", flightId);

  const requireLoginThenNavigate = (path, state) => {
    if (!isLoggedIn) {
      toast("Vui lòng đăng nhập để tiếp tục đặt vé", { icon: "🔐" });
      navigate(ROUTES.LOGIN, {
        state: {
          redirectTo: {
            path,
            state,
          },
        },
      });
      return;
    }
    navigate(path, { state });
  };

  useEffect(() => {
    const loadAirports = async () => {
      try {
        setAirportLoading(true);
        const response = await api.get("/flights/airports");
        const items = Array.isArray(response.data?.data) ? response.data.data : [];
        const mapped = items.map((airport) => ({
          value: airport.code,
          label: `${airport.city} (${airport.code})`,
        }));
        setAirports(mapped);
      } catch {
        setAirports([
          { value: "HAN", label: "Hà Nội (HAN)" },
          { value: "SGN", label: "TP.HCM (SGN)" },
          { value: "DAD", label: "Đà Nẵng (DAD)" },
          { value: "CXR", label: "Nha Trang (CXR)" },
          { value: "DLI", label: "Đà Lạt (DLI)" },
        ]);
      } finally {
        setAirportLoading(false);
      }
    };

    loadAirports();
  }, []);

  useEffect(() => {
    const loadHomeHighlights = async () => {
      try {
        const [flightRes, busRes] = await Promise.all([
          api.get("/flights"),
          api.get("/buses", { params: { passengers: 1 } }),
        ]);

        const flights = Array.isArray(flightRes.data?.flights || flightRes.data?.data)
          ? (flightRes.data.flights || flightRes.data.data)
          : [];
        const buses = Array.isArray(busRes.data?.data) ? busRes.data.data : [];

        const mappedDeals = flights.slice(0, 8).map((flight, index) => {
          const basePrice = Number(flight?.fareClasses?.[0]?.basePrice || 0);
          const oldPrice = Math.round(basePrice * 1.2);
          const toCity = flight?.destination?.city || flight?.destination?.name || "Điểm đến";
          const fromCode = flight?.origin?.code || "---";
          const toCode = flight?.destination?.code || "---";
          return {
            id: flight?._id,
            title: toCity.toUpperCase(),
            subtitle: `${fromCode} → ${toCode} • ${flight?.airline?.name || "Chuyến bay"}`,
            price: formatVnd(basePrice),
            oldPrice: formatVnd(oldPrice),
            image: DEAL_IMAGES[index % DEAL_IMAGES.length],
            bookingType: "flight",
            bookingPath: flight?._id ? buildFlightSeatPath(flight._id) : ROUTES.FLIGHT_SEARCH,
            bookingState: {
              searchParams: {
                departure: fromCode,
                arrival: toCode,
                departDate: new Date().toISOString().slice(0, 10),
                passengers: 1,
                tripType: "one_way",
              },
            },
          };
        });

        const mappedBusCombos = buses.slice(0, 2).map((trip, index) => ({
          id: trip?._id,
          tag: (trip?.availableSeats || 0) > 10 ? "Xu hướng" : "Thịnh hành",
          title: `${trip?.origin || "Điểm đi"} - ${trip?.destination || "Điểm đến"}`,
          subtitle: `${trip?.provider || "Nhà xe"} • ${formatDurationMinutes(trip?.durationMinutes)}`,
          image: COMBO_IMAGES[index % COMBO_IMAGES.length],
          bookingType: "bus",
          bookingPath: ROUTES.BUS_SEATS,
          bookingState: {
            tripId: trip?._id,
            farePrice: Number(trip?.pricePerSeat || 0),
            passengerCount: 1,
            busTrip: {
              route: `${trip?.origin || "Điểm đi"} → ${trip?.destination || "Điểm đến"}`,
              service: trip?.provider || "VivaVivu",
              departureDate: trip?.departureTime ? new Date(trip.departureTime).toLocaleDateString("vi-VN") : "",
              departureTime: trip?.departureTime ? new Date(trip.departureTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "",
              departurePoint: trip?.pickupPoint || "Điểm đi",
              arrivalPoint: trip?.dropoffPoint || "Điểm đến",
              arrivalTime: trip?.arrivalTime ? new Date(trip.arrivalTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "",
              duration: formatDurationMinutes(trip?.durationMinutes),
            },
          },
        }));

        const mappedFlightCombos = flights.slice(0, 2).map((flight, index) => ({
          id: flight?._id,
          tag: "Thịnh hành",
          title: `${flight?.origin?.city || flight?.origin?.code || "Điểm đi"} - ${flight?.destination?.city || flight?.destination?.code || "Điểm đến"}`,
          subtitle: `${flight?.airline?.name || "Hãng bay"} • ${formatDurationMinutes(flight?.duration)}`,
          image: COMBO_IMAGES[(index + mappedBusCombos.length) % COMBO_IMAGES.length],
          bookingType: "flight",
          bookingPath: flight?._id ? buildFlightSeatPath(flight._id) : ROUTES.FLIGHT_SEARCH,
          bookingState: {
            searchParams: {
              departure: flight?.origin?.code || "",
              arrival: flight?.destination?.code || "",
              departDate: new Date().toISOString().slice(0, 10),
              passengers: 1,
              tripType: "one_way",
            },
          },
        }));

        if (mappedDeals.length) setFlashDeals(mappedDeals);
        const mergedCombos = [...mappedBusCombos, ...mappedFlightCombos];
        if (mergedCombos.length) setComboTrips(mergedCombos.slice(0, 4));
      } catch {
        // Keep fallback static data when highlight APIs are unavailable.
      }
    };

    loadHomeHighlights();
  }, []);

  const airportOptions = useMemo(() => airports.map((item) => item.value), [airports]);

  const toggleProvider = (provider) => {
    if (tab === "flight") {
      setSelectedAirlines((current) =>
        current.includes(provider) ? current.filter((item) => item !== provider) : [...current, provider],
      );
      return;
    }

    setSelectedBusProviders((current) =>
      current.includes(provider) ? current.filter((item) => item !== provider) : [...current, provider],
    );
  };

  const handleSearch = () => {
    const originCode = String(origin || "").trim().toUpperCase();
    const destinationCode = String(destination || "").trim().toUpperCase();
    const selectedProviders = tab === "flight" ? selectedAirlines : selectedBusProviders;

    if (!originCode || !destinationCode) {
      toast.error("Vui lòng nhập đầy đủ điểm đi và điểm đến");
      return;
    }

    if (originCode === destinationCode) {
      toast.error("Điểm đi và điểm đến không được trùng nhau");
      return;
    }

    if (!departDate) {
      toast.error("Vui lòng chọn ngày đi");
      return;
    }

    if (tripType === "round" && returnDate && new Date(returnDate) < new Date(departDate)) {
      toast.error("Ngày về phải lớn hơn hoặc bằng ngày đi");
      return;
    }

    if (!selectedProviders.length) {
      toast.error(tab === "flight" ? "Vui lòng chọn ít nhất 1 hãng bay" : "Vui lòng chọn ít nhất 1 nhà xe");
      return;
    }

    if (tab === "flight") {
      navigate(ROUTES.FLIGHT_SEARCH, {
        state: {
          searchParams: {
            departure: originCode,
            arrival: destinationCode,
            departDate,
            returnDate: tripType === "round" ? returnDate : "",
            passengers,
            tripType: tripType === "round" ? "round_trip" : "one_way",
            selectedAirlines,
          },
        },
      });
      return;
    }

    navigate(ROUTES.BUS_SEARCH, {
      state: {
        searchCriteria: {
          origin: originCode,
          destination: destinationCode,
          rawDate: departDate,
          departureDate: new Date(departDate).toLocaleDateString("vi-VN"),
          passengers,
          selectedProviders: selectedBusProviders,
        },
      },
    });
  };

  const swapDirection = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleBookDeal = (deal) => {
    if (deal?.bookingType === "flight" && deal?.id) {
      requireLoginThenNavigate(buildFlightSeatPath(deal.id), {});
      return;
    }

    navigate(ROUTES.FLIGHT_SEARCH, {
      state: {
        searchParams: {
          departure: origin,
          arrival: destination,
          departDate,
          passengers,
          tripType: tripType === "round" ? "round_trip" : "one_way",
          selectedAirlines,
        },
      },
    });
  };

  const handleBookCombo = (combo) => {
    if (combo?.bookingType === "bus") {
      if (!combo?.bookingState?.tripId) {
        navigate(ROUTES.BUS_SEARCH, {
          state: {
            searchCriteria: {
              origin,
              destination,
              rawDate: departDate,
              departureDate: new Date(departDate).toLocaleDateString("vi-VN"),
              passengers,
              selectedProviders: selectedBusProviders,
            },
          },
        });
        return;
      }
      requireLoginThenNavigate(ROUTES.BUS_SEATS, combo.bookingState);
      return;
    }

    if (combo?.bookingType === "flight" && combo?.id) {
      requireLoginThenNavigate(buildFlightSeatPath(combo.id), {});
      return;
    }

    navigate(ROUTES.FLIGHT_SEARCH, {
      state: {
        searchParams: {
          departure: origin,
          arrival: destination,
          departDate,
          passengers,
          tripType: tripType === "round" ? "round_trip" : "one_way",
          selectedAirlines,
        },
      },
    });
  };

  return (
    <div className="bg-[#f7f8fa] text-slate-900">
      <section className="relative pt-4">
        <div className="relative min-h-[560px] overflow-visible bg-slate-900 pb-[10rem]">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1800"
            alt="Khung cảnh núi và bầu trời"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-black/10 to-black/35" />

          <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
            <div className="mx-auto w-full max-w-[1320px] rounded-[10px] overflow-hidden shadow-[0_16px_50px_rgba(15,23,42,0.18)] translate-y-[330px]">
              <div className="flex flex-col lg:flex-row bg-[#2bb6a1]">
                <SearchTab active={tab === "flight"} icon={Plane} label="Tìm vé máy bay" onClick={() => setTab("flight")} />
                <SearchTab active={tab === "bus"} icon={Bus} label="Tìm vé xe khách" onClick={() => setTab("bus")} />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-14 px-8 flex items-center justify-center gap-2 bg-[#0d6d63] text-white font-semibold lg:w-[220px]"
                >
                  <Search size={18} />
                  Tìm kiếm
                </button>
              </div>

              <div className="bg-white/30 backdrop-blur-md px-5 sm:px-8 py-7 sm:py-8">
                <div className="flex items-center justify-center gap-8 text-[15px] font-medium text-slate-900 mb-7">
                  <button type="button" onClick={() => setTripType("round")} className="flex items-center gap-2 cursor-pointer">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      {tripType === "round" ? <span className="w-2 h-2 rounded-full bg-slate-900" /> : null}
                    </span>
                    Khứ hồi
                  </button>
                  <button type="button" onClick={() => setTripType("oneway")} className="flex items-center gap-2 cursor-pointer text-slate-800">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      {tripType === "oneway" ? <span className="w-2 h-2 rounded-full bg-slate-900" /> : null}
                    </span>
                    Một chiều
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 mb-8">
                  {providers.map((logo) => (
                    <div key={logo} className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={tab === "flight" ? selectedAirlines.includes(logo) : selectedBusProviders.includes(logo)}
                        onChange={() => toggleProvider(logo)}
                        className="accent-teal-600"
                      />
                      <div className={`h-8 w-24 rounded-sm bg-white border border-slate-200 grid place-items-center text-[10px] font-black leading-none ${tab === "flight" ? "text-rose-500" : "text-teal-700"}`}>
                        {logo}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_1fr_1fr_1fr] gap-3 items-end bg-[#eff4f5] p-4 rounded-[4px] shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
                  <SuggestField
                    label="Điểm đi"
                    icon={MapPin}
                    value={origin}
                    options={airportOptions}
                    onChange={setOrigin}
                    loading={airportLoading}
                    listId="origin-options"
                  />
                  <div className="hidden lg:flex items-center justify-center">
                    <button
                      type="button"
                      onClick={swapDirection}
                      className="w-10 h-10 rounded-lg bg-[#19a99f] text-white grid place-items-center shadow-sm"
                    >
                      ↔
                    </button>
                  </div>
                  <SuggestField
                    label="Điểm đến"
                    icon={MapPin}
                    value={destination}
                    options={airportOptions}
                    onChange={setDestination}
                    loading={airportLoading}
                    listId="destination-options"
                  />
                  <DateField label="Ngày đi" icon={CalendarDays} value={departDate} onChange={setDepartDate} />
                  <DateField
                    label="Ngày về"
                    icon={CalendarDays}
                    value={returnDate}
                    onChange={setReturnDate}
                    disabled={tripType !== "round"}
                  />
                  <PassengerField value={passengers} onChange={setPassengers} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 pb-20 pt-[15rem]">
        <section className="pt-3">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="text-[#f2b300] text-4xl leading-none">⚡</div>
              <h2 className="text-[34px] font-bold tracking-tight text-slate-900">Flash Deals</h2>
            </div>
            <button type="button" className="text-xs font-medium text-teal-600 flex items-center gap-1">
              View All Deals <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-3 hide-scrollbar">
            {deals.map((deal, index) => (
              <DealCard key={`${deal.title}-${index}`} deal={deal} onBook={() => handleBookDeal(deal)} />
            ))}
          </div>
        </section>

        <section className="mt-11">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-full bg-[#79c6ff] text-white grid place-items-center shadow-sm">
              <MapPinned size={23} />
            </div>
            <h2 className="text-[46px] md:text-[42px] font-bold tracking-tight text-slate-900">VivaVivu kết hợp</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <ComboCard combo={combos[0]} onBook={() => handleBookCombo(combos[0])} />
            </div>
            <div className="lg:col-span-4">
              <ComboCard combo={combos[1]} onBook={() => handleBookCombo(combos[1])} />
            </div>
            <div className="lg:col-span-4">
              <ComboCard combo={combos[2]} onBook={() => handleBookCombo(combos[2])} />
            </div>
            <div className="lg:col-span-8">
              <ComboCard combo={combos[3]} onBook={() => handleBookCombo(combos[3])} />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t border-black/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURE_CARDS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl bg-white px-5 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] border border-black/5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function SuggestField({ label, value, onChange, options, icon: Icon, loading, listId }) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[13px] font-medium text-slate-700 pl-2">{label}</span>
      <div className="flex items-center gap-2 h-12 rounded-md bg-white px-3 border border-slate-200 shadow-sm">
        <Icon size={16} className="text-slate-300 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          list={listId}
          className="w-full min-w-0 bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-300"
        />
        <datalist id={listId}>
          {options.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </div>
      {loading ? <span className="text-[11px] text-slate-400 pl-2">Đang tải gợi ý...</span> : null}
    </label>
  );
}

function DateField({ label, value, onChange, icon: Icon, disabled = false }) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[13px] font-medium text-slate-700 pl-2">{label}</span>
      <div className="flex items-center gap-2 h-12 rounded-md bg-white px-3 border border-slate-200 shadow-sm">
        <Icon size={16} className="text-slate-300 shrink-0" />
        <input
          type="date"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-w-0 bg-transparent outline-none text-sm text-slate-600 disabled:text-slate-300"
        />
      </div>
    </label>
  );
}

function PassengerField({ value, onChange }) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[13px] font-medium text-slate-700 pl-2">Số lượng</span>
      <div className="flex items-center gap-2 h-12 rounded-md bg-white px-3 border border-slate-200 shadow-sm">
        <Users size={16} className="text-slate-300 shrink-0" />
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="h-7 w-7 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <Minus size={14} className="mx-auto" />
        </button>
        <span className="min-w-[64px] text-center text-sm font-semibold text-slate-700">{value} khách</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(9, value + 1))}
          className="h-7 w-7 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <Plus size={14} className="mx-auto" />
        </button>
      </div>
    </label>
  );
}
