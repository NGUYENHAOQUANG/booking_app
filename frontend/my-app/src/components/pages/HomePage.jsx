import { Search, MapPin, Calendar, Users, Plane, Bus, Zap, ShieldCheck, Headphones, Handshake, ArrowRight, ArrowLeftRight, ChevronDown, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";

/* ─── Inline SVG logos ─────────────────────────────────────── */
const AirlineLogo = ({ name, bgColor, textColor = "white", fontSize = 10 }) => (
  <div
    className="h-7 px-3 flex items-center justify-center rounded font-black text-center leading-none whitespace-nowrap"
    style={{ background: bgColor, color: textColor, fontSize }}
  >
    {name}
  </div>
);

const FLIGHT_AIRLINES = [
  { id: "vj", label: "VietJet Air",        bg: "#E31837" },
  { id: "vn", label: "Vietnam Airlines",   bg: "#00205B" },
  { id: "qh", label: "Bamboo Airways",     bg: "#007C31" },
  { id: "vc", label: "Vietravel Airlines", bg: "#00A79D" },
];

const BUS_COMPANIES = [
  { id: "ft", label: "Phương Trang",  bg: "#E8281B" },
  { id: "kh", label: "Kumho Samco",   bg: "#003087" },
  { id: "tb", label: "Thành Bưởi",    bg: "#F7941D" },
  { id: "hl", label: "Hoàng Long",    bg: "#8B1A1A" },
];

/* ─── Deal data ─────────────────────────────────────────────── */
const FLIGHT_DEALS = [
  { id: 1, from: "Hà Nội",           to: "TP. Hồ Chí Minh", airline: "VietJet",  price: 99000,  oldPrice: 350000, img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=600" },
  { id: 2, from: "TP. Hồ Chí Minh", to: "Đà Nẵng",          airline: "Bamboo",   price: 149000, oldPrice: 420000, img: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80&w=600" },
  { id: 3, from: "Hà Nội",           to: "Phú Quốc",          airline: "VNA",      price: 199000, oldPrice: 580000, img: "https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?auto=format&fit=crop&q=80&w=600" },
  { id: 4, from: "TP. Hồ Chí Minh", to: "Nha Trang",          airline: "Vietravel",price: 129000, oldPrice: 390000, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" },
];
const BUS_DEALS = [
  { id: 1, from: "TP. Hồ Chí Minh", to: "Đà Lạt",    company: "Phương Trang", price: 160000, oldPrice: 220000, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600" },
  { id: 2, from: "Hà Nội",           to: "Sapa",       company: "Kumho",        price: 220000, oldPrice: 300000, img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600" },
  { id: 3, from: "TP. Hồ Chí Minh", to: "Vũng Tàu",  company: "Thành Bưởi",   price: 90000,  oldPrice: 150000, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600" },
  { id: 4, from: "Hà Nội",           to: "Ninh Bình",  company: "Hoàng Long",   price: 80000,  oldPrice: 130000, img: "https://images.unsplash.com/photo-1598449356475-b9f71db7d847?auto=format&fit=crop&q=80&w=600" },
];
const DESTINATIONS = [
  { id: 1, name: "Đà Nẵng",  price: 149000, tag: "Hot",      img: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Phú Quốc", price: 199000, tag: "Giảm 30%", img: "https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Hội An",   price: 109000, tag: null,        img: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Sapa",     price: 89000,  tag: "Xu hướng",  img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800" },
];

const vnd = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

/* ─── Sub-components ────────────────────────────────────────── */

/** Shared input wrapper */
function SearchField({ label, icon: Icon, children }) {
  return (
    <label className="flex flex-col gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-4 pt-3 pb-3 cursor-pointer hover:border-[#10967d]/50 focus-within:border-[#10967d] focus-within:ring-2 focus-within:ring-[#10967d]/15 transition-all">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-[#10967d] flex-shrink-0" />
        {children}
      </div>
    </label>
  );
}

/** Provider checkbox pill */
function ProviderPill({ item, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      aria-pressed={active}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all duration-200 ${
        active
          ? "border-[#10967d] bg-[#10967d]/5"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* Checkbox */}
      <span className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all ${active ? "bg-[#10967d] border-[#10967d]" : "border-slate-300"}`}>
        {active && (
          <svg viewBox="0 0 10 8" className="w-3 h-2.5" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <AirlineLogo name={item.label} bgColor={item.bg} fontSize={9.5} />
    </button>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  const [tab, setTab]           = useState("flight");
  const [tripType, setTripType] = useState("round");
  const [from, setFrom]         = useState("");
  const [to, setTo]             = useState("");
  const [date1, setDate1]       = useState("");
  const [date2, setDate2]       = useState("");
  const [pax, setPax]           = useState(1);
  const [cabinClass, setCabin]  = useState("economy");
  const [activeProviders, setActive] = useState(new Set(["vj", "vn", "ft"]));

  const toggleProvider = (id) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const swapLocations = () => { setFrom(to); setTo(from); };

  const providers   = tab === "flight" ? FLIGHT_AIRLINES : BUS_COMPANIES;
  const deals       = tab === "flight" ? FLIGHT_DEALS    : BUS_DEALS;
  const isRoundFlight = tab === "flight" && tripType === "round";

  return (
    <div className="flex flex-col min-h-screen">

      {/* ══════════════ HERO ══════════════ */}
      <section
        className="relative flex flex-col items-center justify-center w-full"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(155deg, #0a2540 0%, #0d6e5a 60%, #10967d 100%)",
          paddingTop: "80px",   /* height of fixed navbar */
          paddingBottom: "48px",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-[#10967d]/30 blur-3xl" />
        </div>

        {/* Headline */}
        <div className="relative z-10 text-center px-4 mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight drop-shadow-xl">
            Đặt vé dễ dàng,
            <br />
            <span className="text-[#4de8c2]">hành trình tuyệt vời</span>
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-xl mx-auto">
            Vé máy bay &amp; xe khách giá tốt nhất — nhanh chóng · an toàn · tiết kiệm
          </p>
        </div>

        {/* ── SEARCH CARD ── */}
        <div className="relative z-10 w-full max-w-4xl px-4">
          <div className="bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.25)] overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {[
                { key: "flight", Icon: Plane, label: "Vé máy bay" },
                { key: "bus",    Icon: Bus,   label: "Vé xe khách" },
              ].map(({ key, Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-4 text-sm font-bold transition-all duration-200 ${
                    tab === key
                      ? "text-[#10967d] border-b-[3px] border-[#10967d] bg-white"
                      : "text-slate-500 bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5">

              {/* Trip type (flight only) */}
              {tab === "flight" && (
                <div className="flex items-center gap-8">
                  {[["round", "Khứ hồi"], ["oneway", "Một chiều"]].map(([val, lbl]) => (
                    <label key={val} className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${tripType === val ? "border-[#10967d]" : "border-slate-300 group-hover:border-[#10967d]/60"}`}>
                        {tripType === val && <span className="w-2.5 h-2.5 rounded-full bg-[#10967d] block" />}
                      </span>
                      <input type="radio" className="sr-only" value={val} checked={tripType === val} onChange={() => setTripType(val)} />
                      <span className={`text-sm font-semibold ${tripType === val ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}>{lbl}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Provider filter */}
              <div className="flex flex-wrap gap-2.5">
                {providers.map((p) => (
                  <ProviderPill
                    key={p.id}
                    item={p}
                    active={activeProviders.has(p.id)}
                    onToggle={toggleProvider}
                  />
                ))}
              </div>

              {/* Row 1: From → Swap → To */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <SearchField label="Điểm đi" icon={MapPin}>
                    <input
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Chọn điểm đi"
                      className="w-full bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-300"
                    />
                  </SearchField>
                </div>

                <button
                  type="button"
                  onClick={swapLocations}
                  className="mt-3 w-10 h-10 flex-shrink-0 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-[#10967d] hover:border-[#10967d] hover:bg-[#10967d] hover:text-white hover:rotate-180 transition-all duration-500 shadow-sm"
                >
                  <ArrowLeftRight size={16} />
                </button>

                <div className="flex-1">
                  <SearchField label="Điểm đến" icon={MapPin}>
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Chọn điểm đến"
                      className="w-full bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-300"
                    />
                  </SearchField>
                </div>
              </div>

              {/* Row 2: Date fields + pax + cabin + Search btn */}
              <div className="flex flex-wrap items-end gap-3">
                {/* Ngày đi */}
                <div className="flex-1 min-w-[130px]">
                  <SearchField label="Ngày đi" icon={Calendar}>
                    <input
                      type="date"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700"
                    />
                  </SearchField>
                </div>

                {/* Ngày về — chỉ round trip flight */}
                {isRoundFlight && (
                  <div className="flex-1 min-w-[130px]">
                    <SearchField label="Ngày về" icon={Calendar}>
                      <input
                        type="date"
                        value={date2}
                        onChange={(e) => setDate2(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm font-semibold text-slate-700"
                      />
                    </SearchField>
                  </div>
                )}

                {/* Hành khách */}
                <SearchField label="Hành khách" icon={Users}>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setPax((p) => Math.max(1, p - 1))} className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center hover:bg-[#10967d] hover:text-white transition-colors">−</button>
                    <span className="w-5 text-center text-sm font-bold text-slate-800">{pax}</span>
                    <button type="button" onClick={() => setPax((p) => Math.min(9, p + 1))} className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center hover:bg-[#10967d] hover:text-white transition-colors">+</button>
                  </div>
                </SearchField>

                {/* Hạng ghế (flight only) */}
                {tab === "flight" && (
                  <SearchField label="Hạng ghế" icon={ChevronDown}>
                    <select
                      value={cabinClass}
                      onChange={(e) => setCabin(e.target.value)}
                      className="bg-transparent outline-none text-sm font-semibold text-slate-800 cursor-pointer pr-1"
                    >
                      <option value="economy">Phổ thông</option>
                      <option value="business">Thương gia</option>
                      <option value="first">Hạng nhất</option>
                    </select>
                  </SearchField>
                )}

                {/* Search button */}
                <button
                  type="button"
                  className="h-[68px] px-8 rounded-2xl flex items-center gap-2.5 font-extrabold text-base text-white flex-shrink-0 active:scale-95 transition-all duration-200 shadow-xl"
                  style={{ background: "linear-gradient(135deg,#ff6b35 0%,#f7931e 100%)", boxShadow: "0 8px 28px rgba(255,107,53,0.38)" }}
                >
                  <Search size={20} />
                  Tìm ngay
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FLASH DEALS ══════════════ */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold text-slate-800">
            <span className="text-2xl">⚡</span>
            Flash Deals
            <span className="text-lg font-semibold text-slate-400">— Ưu đãi hôm nay</span>
          </h2>
          <Link to={ROUTES.SEARCH} className="flex items-center gap-1.5 text-sm font-bold text-[#10967d] hover:gap-3 transition-all">
            Xem tất cả <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal) => (
            <article
              key={deal.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={deal.img}
                  alt={`Vé ${tab === "flight" ? "máy bay" : "xe"} ${deal.from} → ${deal.to}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <span>{deal.from}</span>
                    {tab === "flight" ? <Plane size={11} className="flex-shrink-0" /> : <Bus size={11} className="flex-shrink-0" />}
                    <span>{deal.to}</span>
                  </div>
                </div>
                {(deal.airline || deal.company) && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded-full border border-white/30">
                    {deal.airline || deal.company}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-xl font-extrabold text-orange-500">{vnd(deal.price)}</span>
                  <span className="text-xs text-slate-300 line-through">{vnd(deal.oldPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Tiết kiệm {Math.round((1 - deal.price / deal.oldPrice) * 100)}%
                  </span>
                  <span className="text-[11px] font-bold text-[#10967d]">Đặt ngay →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════ VIVAVIVU KẾT HỢP ══════════════ */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <img src="https://em-content.zobj.net/source/apple/354/globe-showing-asia-australia_1f30f.png" alt="" className="w-9 h-9" loading="lazy" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">VivaVivu kết hợp</h2>
        </div>

        {/* Asymmetrical grid — top row: wide-narrow | bottom row: narrow-wide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1 – wide left top */}
          <article className="group relative rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 cursor-pointer md:col-span-2" style={{ height: "300px" }}>
            <img
              src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200"
              alt="Chuyến tham gia di sản văn hóa Việt Nam"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block mb-3 px-3.5 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20 uppercase tracking-widest">
                Xu hướng
              </span>
              <h3 className="text-white font-extrabold text-2xl leading-tight">Chuyến tham gia di sản văn hoá</h3>
              <p className="text-white/75 text-sm mt-2 font-medium">Khám phá vẻ đẹp cổ kính của Việt Nam</p>
            </div>
          </article>

          {/* Card 2 – narrow right top */}
          <article className="group relative rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 cursor-pointer md:col-span-1" style={{ height: "300px" }}>
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200"
              alt="Cuộc chạy trốn cuối tuần"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-white font-extrabold text-2xl leading-tight">Cuộc chạy trốn cuối tuần</h3>
              <p className="text-white/75 text-sm mt-2 font-medium">Chuyến đi ngắn ngày cho người bận rộn</p>
            </div>
          </article>

          {/* Card 3 – narrow left bottom */}
          <article className="group relative rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 cursor-pointer md:col-span-1" style={{ height: "300px" }}>
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200"
              alt="Du lịch một mình"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-white font-extrabold text-2xl leading-tight">Du lịch một mình</h3>
              <p className="text-white/75 text-sm mt-2 font-medium">Tìm lại chính bản thân mình</p>
            </div>
          </article>

          {/* Card 4 – wide right bottom */}
          <article className="group relative rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 cursor-pointer md:col-span-2" style={{ height: "300px" }}>
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200"
              alt="Đêm nhạc và buổi hoà nhạc"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block mb-3 px-3.5 py-1 bg-orange-600 text-white text-[10px] font-bold rounded-full shadow-lg shadow-orange-600/30 uppercase tracking-widest">
                Thịnh hành
              </span>
              <h3 className="text-white font-extrabold text-2xl leading-tight">Đêm nhạc &amp; buổi hoà nhạc</h3>
              <p className="text-white/75 text-sm mt-2 font-medium">Trải nghiệm nhịp sống sôi động của thành phố</p>
            </div>
          </article>

        </div>
      </section>

      {/* ══════════════ TRUST ══════════════ */}
      <section className="w-full bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: ShieldCheck, color: "#10b981", bg: "#d1fae5", title: "Bảo mật thanh toán",   desc: "Giao dịch mã hoá SSL tiêu chuẩn ngân hàng, an toàn 100%." },
              { Icon: Headphones,  color: "#3b82f6", bg: "#dbeafe", title: "Hỗ trợ 24/7",           desc: "Đội ngũ luôn sẵn sàng tư vấn và giải quyết mọi vấn đề cho bạn." },
              { Icon: Handshake,   color: "#8b5cf6", bg: "#ede9fe", title: "Đối tác chính thức",   desc: "Kết nối trực tiếp các hãng bay và nhà xe uy tín hàng đầu." },
            ].map(({ Icon, color, bg, title, desc }, i) => (
              <div key={i} className="flex items-start gap-5 p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-400 bg-white group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform" style={{ background: bg }}>
                  <Icon size={28} style={{ color }} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
