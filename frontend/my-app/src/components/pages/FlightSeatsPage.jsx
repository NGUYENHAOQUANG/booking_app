import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, Hourglass, MapPin, Plane, ShieldCheck, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import api from "@/services/Axiosinstance";
import toast from "react-hot-toast";

function formatTime(value) {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(value) {
  if (!value) return "--/--/----";
  return new Date(value).toLocaleDateString("vi-VN");
}

const FlightSeatsPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [layout, setLayout] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isGroupPayment, setIsGroupPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [flightRes, seatRes] = await Promise.all([
          api.get(`/flights/${flightId}`),
          api.get(`/flights/${flightId}/seats`),
        ]);

        const flightData = flightRes?.data?.data || flightRes?.data;
        const seats = Array.isArray(seatRes?.data?.data) ? seatRes.data.data : [];

        const rowsMap = seats.reduce((acc, seat) => {
          const key = Number(seat.row);
          if (!acc[key]) acc[key] = [];
          acc[key].push(seat);
          return acc;
        }, {});

        const rows = Object.keys(rowsMap)
          .map(Number)
          .sort((a, b) => a - b)
          .slice(0, 5)
          .map((row) => {
            const sorted = rowsMap[row].sort((a, b) => String(a.column).localeCompare(String(b.column)));
            const visibleCols = ["A", "B", "C", "D"];
            return visibleCols.map((col) => sorted.find((item) => item.column === col)?.seatNumber || `${row}${col}`);
          });

        const unavailable = new Set(
          seats.filter((seat) => seat.status !== "available").map((seat) => seat.seatNumber),
        );

        setFlight(flightData);
        setLayout(rows.length ? rows : [["1A", "1B", "1C", "1D"], ["2A", "2B", "2C", "2D"], ["3A", "3B", "3C", "3D"], ["4A", "4B", "4C", "4D"], ["5A", "5B", "5C", "5D"]]);
        setBookedSeats(unavailable);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Không tải được sơ đồ ghế chuyến bay");
      } finally {
        setLoading(false);
      }
    };

    if (flightId) fetchData();
  }, [flightId]);

  const statusOfSeat = useMemo(() => {
    const map = {};
    layout.flat().forEach((seat) => {
      if (!seat) return;
      if (bookedSeats.has(seat)) {
        map[seat] = "booked";
      } else if (selectedSeats.includes(seat)) {
        map[seat] = "selected";
      } else {
        map[seat] = "available";
      }
    });
    return map;
  }, [bookedSeats, layout, selectedSeats]);

  const farePrice = Number(flight?.fareClasses?.[0]?.basePrice || 500000);
  const subtotal = selectedSeats.length * farePrice;
  const serviceFee = 100000;
  const total = subtotal + serviceFee;

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.has(seatNumber)) return;
    setSelectedSeats((current) =>
      current.includes(seatNumber) ? current.filter((item) => item !== seatNumber) : [...current, seatNumber],
    );
  };

  const departureCity = flight?.origin?.city || "Ho Chi Minh City, VN";
  const arrivalCity = flight?.destination?.city || "Da Lat, VN";

  return (
    <div className="min-h-screen bg-[#efefef] pb-10 font-sans text-slate-900 antialiased">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#77cdbf] bg-white px-6 py-5">
              <div className="mb-3 flex items-end justify-between">
                <h1 className="text-[42px] font-extrabold tracking-tight">Chọn vị trí ngồi</h1>
                <span className="text-base font-bold text-[#37a996]">{selectedSeats.length} trong 4 lựa chọn</span>
              </div>
              <div className="mb-3 h-2 w-full rounded-full bg-[#dbe8e7]">
                <div className="h-2 rounded-full bg-[#4fbba0]" style={{ width: "35%" }} />
              </div>
              <div className="grid grid-cols-4 text-center text-sm font-semibold text-[#4fbba0]">
                <span>Chọn</span>
                <span>Chỗ ngồi</span>
                <span>Thông tin</span>
                <span>Thanh toán</span>
              </div>
            </div>

            <div className="rounded-[20px] border border-[#77cdbf] bg-white px-6 py-4">
              <div className="flex flex-wrap gap-8 text-[15px] font-semibold">
                <LegendDot className="border-[#56c0ac] bg-[#d9ebe8]" label="Có sẵn" />
                <LegendDot className="border-[#56c0ac] bg-[#4fbba0]" label="Đã chọn" />
                <LegendDot className="border-[#cfd4d8] bg-[#dedede]" label="Đang trống" />
              </div>
            </div>

            {loading ? (
              <div className="rounded-[24px] border border-[#77cdbf] bg-white p-6 text-center text-slate-500">Đang tải sơ đồ ghế...</div>
            ) : error ? (
              <div className="rounded-[24px] border border-rose-300 bg-rose-50 p-6 text-center font-semibold text-rose-700">{error}</div>
            ) : (
              <div className="rounded-[24px] border border-[#77cdbf] bg-white p-6">
                <div className="mx-auto max-w-[640px]">
                  <div className="mb-4 text-center text-sm font-bold text-slate-400">Phía trước/ Buồng lái</div>

                  <div className="grid grid-cols-[54px_repeat(4,minmax(0,1fr))] gap-3 text-center text-sm font-black text-slate-700">
                    <span className="self-end">Row</span>
                    {["A", "B", "C", "D"].map((col) => (
                      <span key={col}>{col}</span>
                    ))}

                    {layout.map((row, rowIndex) => (
                      <Fragment key={`row-${rowIndex}`}>
                        <span key={`row-${rowIndex}`} className="flex items-center justify-center text-base font-bold text-slate-700">
                          {rowIndex + 1}
                        </span>
                        {row.map((seat) => {
                          const status = statusOfSeat[seat];
                          return (
                            <button
                              key={seat}
                              type="button"
                              onClick={() => toggleSeat(seat)}
                              disabled={status === "booked"}
                              className={`h-14 rounded-[16px] border text-base font-bold transition ${
                                status === "selected"
                                  ? "border-[#56c0ac] bg-[#4fbba0] text-white"
                                  : status === "booked"
                                    ? "cursor-not-allowed border-[#cfd4d8] bg-[#dedede] text-slate-400"
                                    : "border-[#8fd1c8] bg-[#d9ebe8] text-[#14998e] hover:bg-[#d2e5e1]"
                              }`}
                            >
                              {seat}
                            </button>
                          );
                        })}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-[24px] border border-[#77cdbf] bg-white shadow-[0_10px_26px_rgba(15,23,42,0.09)]">
              <div className="border-b border-[#77cdbf] px-4 py-4 text-xl font-black text-[#3fb79d]">Lựa chọn của bạn</div>

              <div className="space-y-5 p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400"><span className="h-3 w-3 rounded-full bg-[#4fbba0]" />Từ</div>
                  <p className="text-2xl font-bold">{departureCity}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400"><MapPin size={14} className="text-rose-500" />Tới</div>
                  <p className="text-2xl font-bold">{arrivalCity}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#77cdbf] p-3">
                  <div className="flex items-center gap-2 rounded-xl bg-[#f4fbf8] px-3 py-2 text-sm font-semibold"><CalendarDays size={16} className="text-[#4fbba0]" />{formatDate(flight?.departureTime)}</div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#f4fbf8] px-3 py-2 text-sm font-semibold"><Hourglass size={16} className="text-[#4fbba0]" />{formatTime(flight?.departureTime)}</div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-slate-400">SEATS</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.length ? (
                      selectedSeats.map((seat) => (
                        <span key={seat} className="inline-flex items-center gap-1 rounded-full border border-[#77cdbf] bg-[#e7f6f2] px-3 py-1 text-xs font-black text-[#14998e]">
                          {seat}
                          <button type="button" onClick={() => toggleSeat(seat)}>x</button>
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">Chưa chọn ghế</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 border-t border-dashed border-slate-300 pt-3">
                  <div className="flex items-center justify-between text-sm text-slate-500"><span>Tổng phụ ({selectedSeats.length} chỗ ngồi)</span><span className="font-black text-slate-900">{new Intl.NumberFormat("vi-VN").format(subtotal)} VND</span></div>
                  <div className="flex items-center justify-between text-sm text-slate-500"><span>Phí dịch vụ</span><span className="font-black text-slate-900">{new Intl.NumberFormat("vi-VN").format(serviceFee)}VND</span></div>
                  <div className="flex items-center justify-between pt-1 text-[30px] font-extrabold text-[#4fbba0]"><span>Tổng chi phí</span><span>{new Intl.NumberFormat("vi-VN").format(total)}VND</span></div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[#77cdbf] px-4 py-3">
                  <div>
                    <p className="text-sm font-black text-slate-900">Chia nhỏ theo nhóm</p>
                    <p className="text-xs text-slate-400">Chỉ cần thanh toán phần của bạn ngay</p>
                  </div>
                  <button type="button" onClick={() => setIsGroupPayment((value) => !value)} className={`relative h-7 w-12 rounded-full transition ${isGroupPayment ? "bg-[#4fbba0]" : "bg-slate-300"}`}>
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${isGroupPayment ? "left-6" : "left-1"}`} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!selectedSeats.length) {
                      toast.error("Vui lòng chọn ít nhất 1 ghế");
                      return;
                    }
                    navigate(ROUTES.FLIGHT_PAYMENT, { state: { selectedSeats, flightId, flight } });
                  }}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#159c90] text-lg font-bold text-white transition hover:bg-[#10897f]"
                >
                  Tiến hành thanh toán
                  <ArrowRight size={20} />
                </button>

                <Link to={ROUTES.FLIGHT_SEARCH} className="block text-center text-sm font-bold text-slate-400 hover:text-slate-700">Quay lại</Link>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

function LegendDot({ className, label }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`h-8 w-8 rounded-full border ${className}`} />
      <span>{label}</span>
    </div>
  );
}

export default FlightSeatsPage;
