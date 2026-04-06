import { Check, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

function formatDate(value) {
  if (!value) return "--/--/----";
  return new Date(value).toLocaleDateString("vi-VN");
}

function formatTime(value) {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value || 0)} VND`;
}

const BookingConfirmationPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const busBooking = location.state?.busBooking;
  const activeBooking = busBooking || booking;
  const busTrip = location.state?.busTrip || {};
  const flightInfo = location.state?.flightInfo || {};
  const selectedSeats = location.state?.selectedSeats || [];
  const outboundFlight = booking?.outboundFlight?.flight || {};
  const passengerSeats = booking?.passengers?.map((item) => item.seatOutbound).filter(Boolean) || [];
  const displaySeats = selectedSeats.length ? selectedSeats : passengerSeats;

  const flightServiceName = [
    outboundFlight?.airline?.name,
    outboundFlight?.flightNumber,
  ]
    .filter(Boolean)
    .join(" - ");

  const fallbackServiceName = [
    flightInfo?.airline?.name,
    flightInfo?.flightNumber,
  ]
    .filter(Boolean)
    .join(" - ");

  const durationMinutes = outboundFlight?.duration;
  const formattedDuration = durationMinutes
    ? `${Math.floor(durationMinutes / 60)}h${String(durationMinutes % 60).padStart(2, "0")}m`
    : "--";

  const ticket = {
    code: activeBooking?.bookingCode || "UNKNOWN",
    date: formatDate(activeBooking?.createdAt),
    customerName: activeBooking?.contactInfo?.fullName || "--",
    phone: activeBooking?.contactInfo?.phone || "--",
    email: activeBooking?.contactInfo?.email || "--",
    service: busTrip.service || busBooking?.trip?.provider || flightServiceName || fallbackServiceName || "VivaVivu",
    seat: displaySeats.length ? displaySeats.join(", ") : "--",
    departTime: busTrip.departureTime || formatTime(outboundFlight?.departureTime || flightInfo?.departureTime),
    departPlace:
      busTrip.departurePoint ||
      busBooking?.trip?.pickupPoint ||
      outboundFlight?.origin?.name ||
      flightInfo?.origin?.name ||
      flightInfo?.origin?.city ||
      "--",
    arriveTime: busTrip.arrivalTime || formatTime(outboundFlight?.arrivalTime || flightInfo?.arrivalTime),
    arrivePlace:
      busTrip.arrivalPoint ||
      busBooking?.trip?.dropoffPoint ||
      outboundFlight?.destination?.name ||
      flightInfo?.destination?.name ||
      flightInfo?.destination?.city ||
      "--",
    duration: busTrip.duration || (busBooking?.trip?.durationMinutes ? `${busBooking.trip.durationMinutes} phút` : formattedDuration),
    paymentMethod: activeBooking?.payment?.method || "--",
    transactionId: activeBooking?.payment?.transactionId || "--",
    paidAt: formatDate(activeBooking?.payment?.paidAt),
    total: formatMoney(activeBooking?.pricing?.total),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-12">
      <div className="w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center">
        {/* Success header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8 w-full">
          <span className="bg-[#22c55e] text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            Thành công
          </span>
          <div className="w-12 h-12 bg-[#22c55e] rounded-full flex items-center justify-center">
            <Check size={28} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase flex items-center justify-center flex-wrap gap-2 pt-2">
            CẢM ƠN VÌ ĐÃ ĐẶT VÉ TRÊN
            <span className="flex items-center gap-1.5 text-slate-800 ml-1">
              <span className="text-[#10967d] border border-[#10967d] rounded-full w-7 h-7 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              VivaVivu<sup className="text-[10px]">&trade;</sup>
            </span>
          </h1>
        </div>

        {/* Ticket Information Container */}
        <div className="w-full max-w-3xl border border-[#10967d] rounded-[2rem] p-8 sm:p-10 bg-white mb-20">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-slate-900">
            Thông tin vé
          </h2>

          <div className="flex justify-between items-center text-[13px] font-medium mb-6 text-slate-800 tracking-wide">
            <span>Mã vé: {ticket.code}</span>
            <span>Ngày đặt vé: {ticket.date}</span>
          </div>

          <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            <p>Tổng thanh toán: {ticket.total}</p>
            <p>Phương thức: {ticket.paymentMethod}</p>
            <p>Mã giao dịch: {ticket.transactionId}</p>
            <p>Thời gian thanh toán: {ticket.paidAt}</p>
          </div>

          <h3 className="font-bold text-[14px] mb-2 text-slate-900 tracking-wide">
            Thông tin khách hàng
          </h3>
          <hr className="border-slate-800 mb-6" />

          <div className="space-y-4 mb-10 text-[13px]">
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
              <span className="text-slate-800 font-medium tracking-wide">
                Tên khách hàng:
              </span>
              <span className="font-bold text-slate-900 tracking-wide">
                {ticket.customerName}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
              <span className="text-slate-800 font-medium tracking-wide">
                Số điện thoại:
              </span>
              <span className="font-bold text-slate-900 tracking-wide">
                {ticket.phone}
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4">
              <span className="text-slate-800 font-medium tracking-wide">
                Email:
              </span>
              <span className="font-bold text-slate-900 tracking-wide">
                {ticket.email}
              </span>
            </div>
          </div>

          <h3 className="font-bold text-[14px] mb-2 text-slate-900 tracking-wide">
            Vé
          </h3>
          <hr className="border-slate-800 mb-6" />

          <div className="border border-[#10967d] rounded-2xl p-6 shadow-sm bg-white">
            <h4 className="font-bold text-slate-900 text-[14px]">
              {ticket.service}
            </h4>
            <p className="text-[11px] font-medium text-slate-600 mb-5">
              {ticket.seat}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
              <div className="w-full sm:w-[130px]">
                <p className="font-black text-sm text-slate-900 mb-1">
                  {ticket.departTime}
                </p>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  {ticket.departPlace}
                </p>
              </div>

              <div className="hidden sm:flex flex-shrink-0 items-center justify-center">
                <ArrowRight
                  size={20}
                  className="text-slate-700 font-light"
                  strokeWidth={1}
                />
              </div>

              <div className="w-full sm:w-[150px]">
                <p className="font-black text-sm text-slate-900 mb-1">
                  {ticket.arriveTime}
                </p>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  {ticket.arrivePlace}
                </p>
              </div>

              <div className="w-full h-px sm:h-10 sm:w-px bg-slate-400 mt-2 sm:mt-0 flex-shrink-0"></div>

              <div className="text-[13px] font-bold text-slate-900 tracking-wide truncate">
                {ticket.duration}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bỏ footer do MainLayout đã chứa footer chung */}
    </div>
  );
};

export default BookingConfirmationPage;
