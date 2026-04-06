import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bus, Calendar, Check, Clock, DoorOpen, ShieldCheck, Star, UserRound, Users, X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import busService from "@/services/busService";
import toast from "react-hot-toast";
import chairAvailableIcon from "@/assets/icon/chair.svg";
import chairBookedIcon from "@/assets/icon/chair2.svg";
import chairSelectedIcon from "@/assets/icon/chair3.svg";

const DEFAULT_TRIP = {
  route: "Hồ Chí Minh → Đà Lạt",
  service: "Xe Phương Trang",
  departureDate: "24/8/2025",
  departureTime: "08:00 AM",
  duration: "5 giờ 6 phút",
  departurePoint: "Văn phòng quận 1",
  arrivalPoint: "VP Đà Lạt - Bùi Thị Xuân",
};

const ICON_BY_STATUS = {
  available: chairAvailableIcon,
  selected: chairSelectedIcon,
  booked: chairBookedIcon,
  reserved: chairBookedIcon,
  unavailable: chairBookedIcon,
};

function money(value) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function SeatButton({ seatNumber, status, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "booked"}
      className={`flex h-[74px] w-[74px] items-center justify-center rounded-[20px] border transition-all ${
        status === "selected"
          ? "border-teal-400 bg-teal-50 shadow-[0_12px_26px_rgba(20,184,166,0.18)]"
          : status === "booked"
            ? "cursor-not-allowed border-orange-300 bg-orange-50"
            : "border-slate-300 bg-white hover:border-teal-300 hover:bg-slate-50"
      }`}
    >
      <img src={ICON_BY_STATUS[status]} alt={seatNumber} className="h-full w-full rounded-[18px] object-contain" draggable="false" />
    </button>
  );
}

function SummarySeat({ seatId, passenger }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-sm font-black text-teal-600 ring-1 ring-teal-100">
          {seatId}
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">{passenger}</p>
          <p className="text-[10px] font-medium text-slate-400">Ghế tiêu chuẩn</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-slate-900">100.000 đ</span>
        <button type="button" className="text-slate-200 transition-colors hover:text-red-500">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function BusSeatSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tripId = location.state?.tripId;
  const farePrice = Number(location.state?.farePrice || 0);
  const passengerCount = Math.max(1, Number(location.state?.passengerCount) || 2);
  const busTrip = location.state?.busTrip || DEFAULT_TRIP;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isGroupPayment, setIsGroupPayment] = useState(false);
  const [seatRows, setSeatRows] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSeats = async () => {
      if (!tripId) {
        setError("Thiếu mã chuyến. Vui lòng quay lại chọn chuyến.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const res = await busService.getBusSeatMap(tripId);
        const seats = Array.isArray(res.data) ? res.data : [];

        const byRow = seats.reduce((acc, seat) => {
          const rowKey = Number(seat.row || 0);
          if (!acc[rowKey]) {
            acc[rowKey] = [];
          }
          acc[rowKey].push(seat);
          return acc;
        }, {});

        const rows = Object.keys(byRow)
          .map(Number)
          .sort((a, b) => a - b)
          .map((rowNumber) => {
            const cols = byRow[rowNumber]
              .sort((a, b) => String(a.column).localeCompare(String(b.column)))
              .map((seat) => seat.seatNumber);
            if (cols.length === 3) {
              return [cols[0], cols[1], null, cols[2]];
            }
            return cols;
          });

        const unavailable = new Set(
          seats
            .filter((seat) => seat.status !== "available")
            .map((seat) => seat.seatNumber),
        );

        setSeatRows(rows);
        setBookedSeats(unavailable);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải sơ đồ ghế từ API");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [tripId]);

  const seatStatus = useMemo(() => {
    const map = {};
    seatRows.flat().forEach((seat) => {
      if (!seat) {
        return;
      }
      if (bookedSeats.has(seat)) {
        map[seat] = "booked";
        return;
      }
      map[seat] = selectedSeats.includes(seat) ? "selected" : "available";
    });
    return map;
  }, [bookedSeats, seatRows, selectedSeats]);

  const toggleSeat = (seat) => {
    if (bookedSeats.has(seat)) {
      return;
    }
    setSelectedSeats((current) => {
      if (current.includes(seat)) {
        return current.filter((item) => item !== seat);
      }
      if (current.length >= passengerCount) {
        toast.error(`Bạn chỉ có thể chọn tối đa ${passengerCount} ghế`);
        return current;
      }
      return [...current, seat];
    });
  };

  const seatPrice = farePrice > 0 ? farePrice : 100000;
  const subtotal = selectedSeats.length * seatPrice;
  const serviceFee = 10000;
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-[#efefef] pb-10 text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 px-2 sm:px-0">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-4 gap-4 text-center text-sm font-medium text-teal-600">
              {[
                [1, "Tìm kiếm", true],
                [2, "Chọn ghế ngồi", true],
                [3, "Bổ sung", false],
                [4, "Thanh toán", false],
              ].map(([step, label, active]) => (
                <div key={label} className="space-y-3">
                  <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${active ? "border-teal-500 bg-teal-500 text-white" : "border-slate-200 bg-white text-slate-500"}`}>
                    {active ? <Check size={14} /> : step}
                  </div>
                  <p className={active ? "text-teal-600" : "text-slate-400"}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-5xl font-black tracking-tight text-slate-950">Chọn Ghế Ngồi</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-2"><Bus size={15} /> {busTrip.service || "VivaVivu"}</span>
                <span>•</span>
                <span>{busTrip.departureDate}</span>
                <span>•</span>
                <span>{busTrip.departureTime}</span>
              </div>
            </div>

            {loading && <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">Đang tải ghế từ API...</p>}
            {!loading && !!error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}

            <div className="flex flex-col items-start justify-between gap-4 rounded-[24px] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-5 text-sm">
                <Legend color="border-slate-300 bg-white" label="Còn trống" />
                <Legend color="border-teal-500 bg-teal-500" label="Đã chọn" />
                <Legend color="border-orange-300 bg-orange-300" label="Đã được đặt" />
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
                <Users size={15} className="text-teal-600" />
                <span>Ghế trống đang hiển thị cho: <strong className="font-bold text-slate-900">{passengerCount} hành khách</strong></span>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
              <div className="mx-auto w-full max-w-[440px] rounded-[28px] border border-slate-200 bg-[#f9fbfd] p-5">
                <div className="mb-5 grid grid-cols-[1fr_1fr_1fr] items-center border-b border-slate-200 pb-4 text-sm font-bold text-slate-400">
                  <div className="flex items-center justify-center gap-2"><UserRound size={18} /> Tài xế</div>
                  <div className="flex items-center justify-center gap-2"><DoorOpen size={18} /> Lối vào</div>
                  <div />
                </div>

                <div className="grid grid-cols-[1fr_1fr_56px_1fr] gap-x-3 gap-y-4 px-2 pb-6">
                  {seatRows.flatMap((row, rowIdx) =>
                    row.map((seat, colIdx) => {
                      if (!seat) {
                        return <div key={`gap-${rowIdx}-${colIdx}`} className="h-[74px]" />;
                      }
                      return (
                        <SeatButton
                          key={seat}
                          seatNumber={seat}
                          status={seatStatus[seat]}
                          onClick={() => toggleSeat(seat)}
                        />
                      );
                    }),
                  )}
                </div>

                <div className="border-t border-slate-200 pt-4 text-center text-xs font-bold tracking-[0.25em] text-slate-300">REAR</div>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_16px_42px_rgba(15,23,42,0.12)]">
              <div className="bg-slate-100 px-5 py-4">
                <h3 className="text-4xl font-black tracking-tight text-slate-950">Tóm tắt đặt chỗ</h3>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex gap-3 rounded-2xl border-b border-slate-200 pb-4">
                  <img src="https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&q=80&w=500" alt="Bus trip" className="h-16 w-20 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900">{busTrip.route}</p>
                    <p className="mt-1 text-xs text-slate-500">{busTrip.departureDate} • {busTrip.departureTime}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-teal-600">
                      <Star size={12} fill="currentColor" /> 4.8 <span className="text-slate-400">(2.4k đánh giá)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Các ghế đã chọn</p>
                  <div className="space-y-3">
                    {selectedSeats.map((seatId, index) => (
                      <SummarySeat key={seatId} seatId={seatId} passenger={`Hành khách ${index + 1}`} />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4 text-[11px] leading-relaxed text-teal-700">
                  Ghế 1C và 3C nằm ở phía lối đi. Rất thoải mái để chân.
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-sm font-black text-slate-950">Chia tiền theo nhóm</p>
                    <p className="text-[11px] text-slate-400">Chia sẻ chi phí với bạn bè</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGroupPayment((current) => !current)}
                    className={`relative h-6 w-12 rounded-full transition-colors ${isGroupPayment ? "bg-teal-500" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${isGroupPayment ? "left-7" : "left-1"}`} />
                  </button>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Tạm Tính</span>
                    <span className="text-slate-900">{money(subtotal)} đ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Thuế & Phí</span>
                    <span className="text-slate-900">{money(serviceFee)} đ</span>
                  </div>
                  <div className="flex items-end justify-between border-t border-dashed border-slate-200 pt-4">
                    <span className="text-lg font-black text-slate-950">Tổng cộng</span>
                    <span className="text-2xl font-black tracking-tight text-slate-950">{money(total)} đ</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={selectedSeats.length !== passengerCount || !tripId || !!error || loading}
                  onClick={() => navigate(ROUTES.BUS_CUSTOMER_INFO, { state: { selectedSeats, busTrip, tripId, farePrice: seatPrice, pricing: { subtotal, serviceFee, total }, passengerCount } })}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition-colors ${selectedSeats.length === passengerCount && tripId && !error && !loading ? "bg-teal-600 text-white shadow-[0_16px_28px_rgba(13,148,136,0.28)] hover:bg-teal-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                >
                  Tiếp tục chọn thêm dịch vụ
                </button>
                {selectedSeats.length !== passengerCount && (
                  <p className="text-center text-xs font-semibold text-orange-500">
                    Vui lòng chọn đủ {passengerCount} ghế để tiếp tục
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck size={14} className="text-teal-600" /> Thanh toán được đảm bảo bởi VivaVivu
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-orange-200 bg-orange-50 p-5 text-center shadow-[0_10px_24px_rgba(249,115,22,0.14)]">
              <p className="text-sm font-black italic text-orange-500">Tiết kiệm 10% cho chuyến đi tiếp theo</p>
              <p className="mt-1 text-xs text-orange-700">Hoàn tất đặt chỗ để mở khoá ưu đãi.</p>
            </div>

            <Link to={ROUTES.BUS_SEARCH} className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400 transition-colors hover:text-teal-600">
              <ArrowLeft size={14} /> Quay lại chọn chuyến
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded-full border ${color}`} />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}