import { X, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

function formatDate(value) {
  if (!value) return "--/--/----";
  return new Date(value).toLocaleDateString("vi-VN");
}

const BookingFailurePage = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const busBooking = location.state?.busBooking;
  const activeBooking = busBooking || booking;
  const busTrip = location.state?.busTrip || {};
  const customer = location.state?.customer || {};
  const selectedSeats = location.state?.selectedSeats || [];

  const ticket = {
    code: activeBooking?.bookingCode || "PENDING",
    date: formatDate(activeBooking?.createdAt || Date.now()),
    customerName: customer.customerName || activeBooking?.contactInfo?.fullName || "--",
    phone: customer.phone || activeBooking?.contactInfo?.phone || "--",
    email: customer.email || activeBooking?.contactInfo?.email || "--",
    service: busTrip.service || busBooking?.trip?.provider || "VivaVivu",
    seat: selectedSeats.length ? selectedSeats.join(", ") : "--",
    departTime: busTrip.departureTime || "--:--",
    departPlace: busTrip.departurePoint || "--",
    arriveTime: busTrip.arrivalTime || "--:--",
    arrivePlace: busTrip.arrivalPoint || "--",
    duration: busTrip.duration || "--",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-12">
      <div className="w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center">
        {/* Failure header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8 w-full">
          <span className="bg-[#ef4444] text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            Thất bại
          </span>
          <div className="w-12 h-12 bg-[#ef4444] rounded-full flex items-center justify-center">
            <X size={28} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase flex items-center justify-center pt-2">
            THANH TOÁN THẤT BẠI
          </h1>
        </div>

        {/* Ticket Information Container */}
        <div className="w-full max-w-3xl border border-[#ef4444] rounded-[2rem] p-8 sm:p-10 bg-white mb-20">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-slate-900">
            Thông tin vé
          </h2>

          <div className="flex justify-between items-center text-[13px] font-medium mb-6 text-slate-800 tracking-wide">
            <span>Mã vé: {ticket.code}</span>
            <span>Ngày đặt vé: {ticket.date}</span>
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

          <div className="border border-[#ef4444] rounded-2xl p-6 shadow-sm bg-white">
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
    </div>
  );
};

export default BookingFailurePage;
