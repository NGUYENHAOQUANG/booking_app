import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  X,
  Plane,
} from "lucide-react";

/* ────────── helper ────────── */
const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
const SEAT_PRICE = 200000; // price per seat

const FlightSeatsPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── fetch flight ── */
  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const { default: api } = await import("../../services/Axiosinstance");
        const res = await api.get(`/flights/${flightId}`);
        const dbFlight = res.data.flight || res.data;

        setFlightData({
          flightNumber: dbFlight.flightNumber,
          departure: dbFlight.origin?.code || "SGN",
          departureCity: dbFlight.origin?.city || "Ho Chi Minh City, VN",
          arrival: dbFlight.destination?.code || "HAN",
          arrivalCity: dbFlight.destination?.city || "Da Lat, VN",
          departTime: new Date(dbFlight.departureTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          arriveTime: new Date(dbFlight.arrivalTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          date: new Date(dbFlight.departureTime).toLocaleDateString("vi-VN"),
          airline: dbFlight.airline?.name || "Vietnam Airlines",
          price: dbFlight.fareClasses?.[0]?.basePrice || 200000,
          raw: dbFlight,
        });
      } catch (err) {
        console.error("Lỗi lấy thông tin chuyến bay:", err);
      } finally {
        setLoading(false);
      }
    };
    if (flightId) fetchFlight();
  }, [flightId]);

  /* ── seat map config ── */
  const ROWS = 10;
  const COLS = ["A", "B", "C", "D"];
  const occupiedSeats = [
    "1C", "1D", "2A", "2B", "2C", "2D",
    "3C", "3D", "4A", "4B", "4C",
    "5C", "5D", "6A", "6B",
    "7C", "7D", "8A", "8C",
    "9B", "9D", "10A", "10C",
  ];

  const getSeatStatus = (seatId) => {
    if (selectedSeats.includes(seatId)) return "selected";
    if (occupiedSeats.includes(seatId)) return "occupied";
    return "available";
  };

  const toggleSeat = (seatId) => {
    const status = getSeatStatus(seatId);
    if (status === "occupied") return;
    if (status === "selected") {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  const removeSeat = (seatId) => {
    setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }
    navigate("/flight-payment", {
      state: { selectedSeats, flightId, flight: flightData },
    });
  };

  /* ── loading ── */
  if (loading || !flightData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm font-medium">Đang tải thông tin chuyến bay...</p>
        </div>
      </div>
    );
  }

  const totalSeats = 4; // max selectable
  const seatPrice = flightData.price || SEAT_PRICE;
  const subtotal = selectedSeats.length * seatPrice;
  const serviceFee = 50000;
  const totalCost = subtotal + serviceFee;

  /* ────────── RENDER ────────── */
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ━━━━ Progress Stepper ━━━━ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5">
          {/* Title */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 font-heading">
              Chọn vị trí ngồi
            </h1>
            <span className="text-primary font-semibold text-sm">
              {selectedSeats.length} trong {totalSeats} lựa chọn
            </span>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-0">
            {[
              { step: 1, label: "Chỗ ngồi", active: true },
              { step: 2, label: "Thông tin", active: false },
              { step: 3, label: "Thanh toán", active: false },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <span
                    className={`text-sm font-semibold ${
                      s.active ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                  <div
                    className={`mt-2 w-28 h-1 rounded-full ${
                      s.active ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                {i < 2 && <div className="w-8"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━━ Main Content ━━━━ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Seat Map (Left) ── */}
          <div className="lg:col-span-2">
            {/* Legend */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
              <div className="flex items-center gap-8 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border-2 border-primary/40 bg-primary/5 flex items-center justify-center">
                    <span className="text-primary text-xs font-bold">1A</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Có sẵn</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1A</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Đã chọn</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs font-bold">1A</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Đang trống</span>
                </div>
              </div>
            </div>

            {/* Airplane Seat Map */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Cockpit indicator */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 border border-gray-200 rounded-xl px-6 py-2">
                  <span className="text-sm text-gray-400 font-medium">
                    Phía trước/ Buồng lái
                  </span>
                </div>
              </div>

              {/* Column Headers */}
              <div className="flex justify-center mb-4">
                <div className="w-14 mr-2"></div> {/* spacer for row label */}
                <div className="flex gap-3">
                  {COLS.map((col) => (
                    <div
                      key={col}
                      className="w-16 h-8 flex items-center justify-center text-sm font-bold text-gray-600"
                    >
                      {col}
                    </div>
                  ))}
                </div>
              </div>

              {/* Seat Rows */}
              <div className="flex flex-col items-center gap-3">
                {Array.from({ length: ROWS }).map((_, rowIdx) => {
                  const rowNum = rowIdx + 1;
                  // Add a divider after row 2 and row 5 (like in the Figma design)
                  const showDivider = rowNum === 3 || rowNum === 6;

                  return (
                    <div key={rowNum}>
                      {showDivider && (
                        <div className="w-full border-t border-dashed border-primary/30 my-3"></div>
                      )}
                      <div className="flex items-center gap-0">
                        {/* Row Number */}
                        <div className="w-14 mr-2 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-500 italic">
                            {rowNum}
                          </span>
                        </div>

                        {/* Seats */}
                        <div className="flex gap-3">
                          {COLS.map((col) => {
                            const seatId = `${rowNum}${col}`;
                            const status = getSeatStatus(seatId);

                            return (
                              <button
                                key={seatId}
                                onClick={() => toggleSeat(seatId)}
                                disabled={status === "occupied"}
                                className={`w-16 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                                  status === "available"
                                    ? "bg-primary/8 border-2 border-primary/30 text-primary hover:bg-primary/15 cursor-pointer"
                                    : status === "selected"
                                    ? "bg-primary text-white shadow-md cursor-pointer hover:bg-secondary"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                                title={
                                  status === "occupied"
                                    ? "Ghế đã được đặt"
                                    : `Ghế ${seatId}`
                                }
                              >
                                {seatId}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Sidebar (Right) ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h3 className="text-lg font-bold text-primary mb-5 font-heading">
                Lựa chọn của bạn
              </h3>

              {/* Flight Info */}
              <div className="space-y-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Từ</div>
                    <div className="text-base font-bold text-gray-900">
                      {flightData.departureCity}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin size={14} className="text-red-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Tới</div>
                    <div className="text-base font-bold text-gray-900">
                      {flightData.arrivalCity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-4 py-4 border-y border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-gray-700">
                    {flightData.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-gray-700">
                    {flightData.departTime} Sáng
                  </span>
                </div>
              </div>

              {/* Selected Seats */}
              <div className="py-4 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  SEATS
                </h4>
                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.sort().map((seat) => (
                      <div
                        key={seat}
                        className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/30 rounded-full px-3 py-1.5 text-sm font-semibold"
                      >
                        {seat}
                        <button
                          onClick={() => removeSeat(seat)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Chưa chọn ghế nào</p>
                )}
              </div>

              {/* Pricing */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Tổng phụ ({selectedSeats.length} chỗ ngồi)
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {fmt(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Phí dịch vụ</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {fmt(serviceFee)}
                  </span>
                </div>
                <div className="border-t border-dashed border-primary/30 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">
                      Tổng chi phí
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {fmt(totalCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-4">
                <button
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${
                    selectedSeats.length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-secondary shadow-lg shadow-primary/25"
                  }`}
                >
                  Tiến hành thanh toán
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Quay lại
                </button>
              </div>

              {/* Split payment hint */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  Chia nhỏ theo nhóm — Chỉ cần thanh toán phần của bạn ngay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSeatsPage;
