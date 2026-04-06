import { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  X,
  Plane,
  CalendarDays,
  Hourglass,
  ShieldCheck,
  Users
} from "lucide-react";
import api from "@/services/Axiosinstance";
import toast from "react-hot-toast";
import { ROUTES } from "@/constants/routes";

/* ────────── helper ────────── */
const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

function formatTime(value) {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(value) {
  if (!value) return "--/--/----";
  return new Date(value).toLocaleDateString("vi-VN");
}

const LegendDot = ({ className, label }) => (
  <div className="inline-flex items-center gap-3">
    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center ${className}`}>
      <div className="w-2 h-2 rounded-full bg-white opacity-20"></div>
    </div>
    <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{label}</span>
  </div>
);

const COLS = ["A", "B", "C", "D"];

const FlightSeatsPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();

  const [flightData, setFlightData] = useState(null);
  const [layout, setLayout] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isGroupPayment, setIsGroupPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ROWS = 10;

  /* ── fetch data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [flightRes, seatRes] = await Promise.all([
          api.get(`/flights/${flightId}`),
          api.get(`/flights/${flightId}/seats`),
        ]);

        const dbFlight = flightRes?.data?.data || flightRes?.data?.flight || flightRes?.data;
        const seats = Array.isArray(seatRes?.data?.data) ? seatRes.data.data : [];

        // Map flight data to local structure
        setFlightData({
          id: dbFlight._id,
          flightNumber: dbFlight.flightNumber,
          departure: dbFlight.origin?.code || "SGN",
          departureCity: dbFlight.origin?.city || "Ho Chi Minh City, VN",
          arrival: dbFlight.destination?.code || "HAN",
          arrivalCity: dbFlight.destination?.city || "Hanoi, VN",
          departureTime: dbFlight.departureTime,
          arrivalTime: dbFlight.arrivalTime,
          departTime: formatTime(dbFlight.departureTime),
          arriveTime: formatTime(dbFlight.arrivalTime),
          date: formatDate(dbFlight.departureTime),
          airline: dbFlight.airline?.name || "Airline",
          price: Number(dbFlight.fareClasses?.[0]?.basePrice || 900000),
          raw: dbFlight,
        });

        // Group seats by row for layout
        const rowsMap = seats.reduce((acc, seat) => {
          const key = Number(seat.row);
          if (!acc[key]) acc[key] = [];
          acc[key].push(seat);
          return acc;
        }, {});

        const sortedRows = Object.keys(rowsMap)
          .map(Number)
          .sort((a, b) => a - b)
          .map((row) => {
            const sortedCols = COLS.map((col) => {
              const seat = rowsMap[row].find((s) => s.column === col);
              return seat ? seat.seatNumber : `${row}${col}`;
            });
            return sortedCols;
          });

        setLayout(sortedRows.length ? sortedRows : Array.from({ length: ROWS }, (_, i) => COLS.map(c => `${i+1}${c}`)));
        
        const unavailable = new Set(
          seats.filter((seat) => seat.status !== "available").map((seat) => seat.seatNumber)
        );
        setBookedSeats(unavailable);

      } catch (err) {
        console.error("Error fetching flight/seats:", err);
        setError(err.response?.data?.message || "Không tải được sơ đồ ghế chuyến bay");
        toast.error("Không tải được dữ liệu chuyến bay!");
      } finally {
        setLoading(false);
      }
    };

    if (flightId) fetchData();
  }, [flightId]);

  /* ── interaction ── */
  const toggleSeat = (seatId) => {
    if (bookedSeats.has(seatId)) return;
    
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= 4) {
        toast.error("Không thể chọn quá 4 ghế");
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const removeSeat = (seatId) => {
    setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế");
      return;
    }
    navigate(ROUTES.FLIGHT_PAYMENT || "/flight-payment", {
      state: { selectedSeats, flightId, flight: flightData.raw },
    });
  };

  const seatPrice = flightData?.price || 0;
  const subtotal = selectedSeats.length * seatPrice;
  const serviceFee = 50000;
  const totalCost = subtotal + serviceFee;

  /* ────────── RENDER ────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#159c90]/20 border-t-[#159c90] rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-400 font-black uppercase tracking-widest text-xs">Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  if (error || !flightData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={32} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Opps! Có lỗi xảy ra</h2>
          <p className="text-gray-500 text-sm mb-8">{error || "Không tìm thấy dữ liệu chuyến bay"}</p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-[#159c90] text-white rounded-2xl font-bold hover:bg-[#10897f] transition-all uppercase tracking-widest text-sm shadow-lg shadow-[#159c90]/20"
          >
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10">
      {/* Header Progress */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-[40px] font-black text-gray-900 leading-none tracking-tight">Chọn vị trí ngồi</h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Dự kiến máy bay {flightData.airline}</p>
            </div>
            <div className="flex items-center gap-3 bg-[#e0f2f1] px-6 py-2 rounded-full">
              <Users size={16} className="text-[#159c90]" />
              <span className="text-[#159c90] font-black text-sm uppercase tracking-tighter">
                {selectedSeats.length} / 4 Ghế đã chọn
              </span>
            </div>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#159c90] transition-all duration-500" style={{ width: "35%" }}></div>
          </div>
          <div className="flex justify-between mt-3 px-1">
             {["Chọn chỗ", "Thông tin", "Thanh toán", "Hoàn tất"].map((step, idx) => (
               <span key={step} className={`text-[10px] font-black uppercase tracking-widest ${idx === 0 ? "text-[#159c90]" : "text-gray-300"}`}>{step}</span>
             ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Seat Map */}
          <div className="space-y-6">
            {/* Status Legend */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap gap-10">
              <LegendDot className="border-[#159c90]/20 bg-[#e0f2f1] text-[#159c90]" label="Có sẵn" />
              <LegendDot className="border-[#159c90] bg-[#159c90]" label="Đã chọn" />
              <LegendDot className="border-gray-200 bg-gray-100" label="Đã đặt" />
            </div>

            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
               {/* Airplane Nose Decoration */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-gray-50 rounded-b-[300px] border-b border-gray-100 -z-0 opacity-50"></div>
               
               <div className="relative z-10 max-w-md mx-auto">
                 <div className="text-center mb-10">
                   <div className="inline-block px-8 py-2 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     Phía trước / Buồng lái
                   </div>
                 </div>

                 {/* Seat Grid */}
                 <div className="space-y-4">
                   <div className="grid grid-cols-[50px_repeat(4,1fr)] gap-4 text-center">
                     <span className="text-[10px] font-black text-gray-300 uppercase self-center">Hàng</span>
                     {COLS.map(c => <span key={c} className="text-[14px] font-black text-gray-900 uppercase">{c}</span>)}
                   </div>

                   {layout.map((row, rIdx) => (
                     <div key={rIdx} className="grid grid-cols-[50px_repeat(4,1fr)] gap-4">
                       <div className="flex items-center justify-center">
                         <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-xs font-black text-gray-400 italic">
                           {rIdx + 1}
                         </span>
                       </div>
                       
                       {row.map((seatId) => {
                         const isOccupied = bookedSeats.has(seatId);
                         const isSelected = selectedSeats.includes(seatId);
                         
                         return (
                           <button
                             key={seatId}
                             onClick={() => toggleSeat(seatId)}
                             disabled={isOccupied}
                             className={`h-16 rounded-2xl border-2 font-black text-base transition-all duration-200 ${
                               isSelected
                               ? "border-[#159c90] bg-[#159c90] text-white shadow-lg shadow-[#159c90]/20 scale-105"
                               : isOccupied
                               ? "border-gray-100 bg-gray-50 text-gray-200 cursor-not-allowed"
                               : "border-[#159c90]/10 bg-[#e0f2f1]/30 text-[#159c90] hover:bg-[#e0f2f1] hover:border-[#159c90]/30"
                             }`}
                           >
                             {seatId}
                           </button>
                         );
                       })}
                     </div>
                   ))}
                 </div>

                 <div className="mt-16 text-center">
                   <div className="inline-block px-8 py-2 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     Phía sau máy bay
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden sticky top-32">
              <div className="bg-[#159c90] p-6 text-white">
                <h3 className="text-xl font-black uppercase tracking-tight">Chi tiết đặt chỗ</h3>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">Mã chuyến: {flightData.flightNumber}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Route */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#159c90] shadow-[0_0_0_4px_rgba(21,156,144,0.1)]"></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Điểm khởi hành</p>
                      <h4 className="text-lg font-black text-gray-900 leading-tight">{flightData.departureCity}</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="text-rose-500" size={18} />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Điểm đến</p>
                      <h4 className="text-lg font-black text-gray-900 leading-tight">{flightData.arrivalCity}</h4>
                    </div>
                  </div>
                </div>

                {/* Time & Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      <CalendarDays size={12} className="text-[#159c90]" /> Ngày đi
                    </div>
                    <div className="font-black text-gray-900">{flightData.date}</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      <Hourglass size={12} className="text-[#159c90]" /> Giờ bay
                    </div>
                    <div className="font-black text-gray-900">{flightData.departTime}</div>
                  </div>
                </div>

                {/* Selected Seats List */}
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ghế đã chọn</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.map((seat) => (
                        <div key={seat} className="group relative">
                          <div className="px-5 py-2 bg-[#e0f2f1] text-[#159c90] border-2 border-[#159c90]/20 rounded-2xl font-black text-sm flex items-center gap-3">
                            {seat}
                            <button onClick={() => removeSeat(seat)} className="text-[#159c90]/40 hover:text-rose-500 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-gray-300 italic py-2">Bạn chưa chọn vị trí nào...</p>
                    )}
                  </div>
                </div>

                {/* Payment Split Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase">Chia sẻ thanh toán</p>
                    <p className="text-[10px] font-bold text-gray-400">Thanh toán theo nhóm - {isGroupPayment ? "Bật" : "Tắt"}</p>
                  </div>
                  <button 
                    onClick={() => setIsGroupPayment(!isGroupPayment)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isGroupPayment ? "bg-[#159c90]" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isGroupPayment ? "left-7" : "left-1"}`}></div>
                  </button>
                </div>

                {/* Pricing Summary */}
                <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                   <div className="flex justify-between text-sm">
                     <span className="font-bold text-gray-400">Tạm tính ({selectedSeats.length} ghế)</span>
                     <span className="font-black text-gray-900">{fmt(subtotal)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="font-bold text-gray-400">Phí dịch vụ</span>
                     <span className="font-black text-gray-900">{fmt(serviceFee)}</span>
                   </div>
                   <div className="flex justify-between items-end pt-2">
                     <span className="font-black text-[#159c90] uppercase text-xs tracking-widest">Tổng cộng</span>
                     <span className="text-3xl font-black text-[#159c90] leading-none">{fmt(totalCost)}</span>
                   </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 text-center">
                  <button
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                    className="w-full h-16 bg-[#159c90] text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-[#10897f] disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-[#159c90]/20 transition-all flex items-center justify-center gap-3"
                  >
                    Tiếp tục thanh toán
                    <ArrowRight size={20} />
                  </button>
                  <Link to={ROUTES.FLIGHT_SEARCH} className="inline-block text-xs font-black text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
                    ← Quay lại tìm kiếm
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Trust badge */}
            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <ShieldCheck className="text-[#159c90]" size={24} />
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase">Thanh toán an toàn</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Bảo mật thông tin 100%</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default FlightSeatsPage;
