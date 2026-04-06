import { useEffect, useMemo, useState } from "react";
import { ArrowRight, History, LoaderCircle, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import AccountShell from "@/components/account/AccountShell";
import { ROUTES } from "@/constants/routes";
import useAuthStore from "@/store/authStore";
import bookingService from "@/services/bookingService";

const formatDateTime = (value) => {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const formatDuration = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) return "--";
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;
  if (!hours) return `${remainMinutes} phút`;
  if (!remainMinutes) return `${hours} giờ`;
  return `${hours} giờ ${remainMinutes} phút`;
};

const formatCurrency = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))} VND`;

const getRouteLabel = (booking) => {
  const flight = booking?.outboundFlight?.flight;
  const trip = booking?.trip;

  if (trip) {
    return {
      serviceName: trip.provider || trip.operator || "Xe khách",
      subtitle: `${trip.busType || "Giường nằm"} - ${booking?.passengers?.length || 1} hành khách`,
      departureTime: formatDateTime(trip.departureTime),
      departurePoint: trip.pickupPoint || trip.origin || "Điểm đón",
      arrivalTime: formatDateTime(trip.arrivalTime),
      arrivalPoint: trip.dropoffPoint || trip.destination || "Điểm đến",
      duration: formatDuration(trip.durationMinutes || trip.duration || 0),
      price: formatCurrency(booking?.pricing?.total),
      seatLabel: `${booking?.passengers?.length || 1} ghế`,
      statusLabel: booking?.status || "pending",
      routeLabel: `${trip.origin || ""} → ${trip.destination || ""}`.trim(),
    };
  }

  if (flight) {
    const origin = flight.origin?.city || flight.origin?.name || flight.origin?.code || "Điểm đi";
    const destination = flight.destination?.city || flight.destination?.name || flight.destination?.code || "Điểm đến";
    return {
      serviceName: flight.airline?.name || flight.flightNumber || "Chuyến bay",
      subtitle: `${flight.flightNumber || "Flight"} - ${booking?.passengers?.length || 1} hành khách`,
      departureTime: formatDateTime(flight.departureTime),
      departurePoint: origin,
      arrivalTime: formatDateTime(flight.arrivalTime),
      arrivalPoint: destination,
      duration: formatDuration(flight.duration || 0),
      price: formatCurrency(booking?.pricing?.total),
      seatLabel: `${booking?.passengers?.length || 1} chỗ`,
      statusLabel: booking?.status || "pending",
      routeLabel: `${origin} → ${destination}`,
    };
  }

  return {
    serviceName: booking?.bookingCode || "Đặt vé",
    subtitle: "Dữ liệu chuyến đi đang được cập nhật",
    departureTime: "--:--",
    departurePoint: "Điểm đi",
    arrivalTime: "--:--",
    arrivalPoint: "Điểm đến",
    duration: "--",
    price: formatCurrency(booking?.pricing?.total),
    seatLabel: `${booking?.passengers?.length || 1} chỗ`,
    statusLabel: booking?.status || "pending",
    routeLabel: "--",
  };
};

const STATUS_LABELS = {
  pending: { label: "Đang chờ", className: "bg-amber-50 text-amber-700 border-amber-100" },
  confirmed: { label: "Đã xác nhận", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  cancelled: { label: "Đã hủy", className: "bg-rose-50 text-rose-700 border-rose-100" },
  completed: { label: "Hoàn tất", className: "bg-sky-50 text-sky-700 border-sky-100" },
  refunded: { label: "Đã hoàn tiền", className: "bg-slate-100 text-slate-700 border-slate-200" },
};

const BookingCard = ({ booking }) => {
  const route = getRouteLabel(booking);
  const status = STATUS_LABELS[route.statusLabel] || STATUS_LABELS.pending;

  return (
    <article className="rounded-[20px] border border-emerald-300 bg-white px-4 py-4 shadow-[0_6px_16px_rgba(16,185,129,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(16,185,129,0.12)] sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 lg:pr-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Ticket size={16} className="text-[#4fbba0]" />
                <h3 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">{route.serviceName}</h3>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{route.subtitle}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] ${status.className}`}>
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
            <div>
              <p className="text-sm font-extrabold text-slate-900 sm:text-[15px]">{route.departureTime}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{route.departurePoint}</p>
            </div>

            <div className="flex flex-col items-center gap-2 px-1 text-slate-400">
              <ArrowRight size={22} className="hidden sm:block" />
              <ArrowRight size={18} className="sm:hidden" />
            </div>

            <div className="text-right">
              <p className="text-sm font-extrabold text-slate-900 sm:text-[15px]">{route.arrivalTime}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{route.arrivalPoint}</p>
            </div>
          </div>
        </div>

        <div className="hidden w-px bg-slate-200 lg:block" />

        <div className="flex flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:min-w-[190px] lg:flex-col lg:items-end lg:justify-center lg:border-t-0 lg:pt-0">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900 sm:text-sm">{route.duration}</p>
            <p className="mt-1 text-[11px] text-slate-400">{route.seatLabel}</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-black text-orange-500 sm:text-xl">{route.price}</p>
            <p className="text-[11px] text-slate-400">/ chỗ ngồi</p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#4fbba0] px-5 text-sm font-bold text-white transition-colors hover:bg-[#41aa90]"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
          {route.routeLabel}
        </span>
        {booking?.bookingCode ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
            {booking.bookingCode}
          </span>
        ) : null}
      </div>
    </article>
  );
};

const BookingHistoryPage = () => {
  const { user, logout } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await bookingService.getMyBookings({ limit: 20 });
        const items = Array.isArray(response?.data) ? response.data : [];

        if (mounted) setBookings(items);
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.response?.data?.message || "Không tải được lịch sử đặt vé.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center gap-3 rounded-[18px] border border-emerald-300 bg-white px-4 py-4 text-sm text-slate-500 shadow-[0_6px_16px_rgba(16,185,129,0.08)]">
          <LoaderCircle className="animate-spin" size={18} />
          Đang tải lịch sử đặt vé...
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
          {error}
        </div>
      );
    }

    if (!bookings.length) {
      return (
        <div className="rounded-[18px] border border-emerald-300 bg-white px-6 py-12 text-center shadow-[0_6px_16px_rgba(16,185,129,0.08)]">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-[#4fbba0]">
            <History size={30} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">Chưa có lịch sử đặt vé</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Khi bạn đặt vé xe hoặc vé máy bay, toàn bộ đơn sẽ xuất hiện ở đây theo đúng format như trong ảnh.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={ROUTES.BUS_SEARCH} className="inline-flex h-11 items-center justify-center rounded-xl bg-[#4fbba0] px-5 text-sm font-bold text-white transition hover:bg-[#41aa90]">
              Tìm vé xe
            </Link>
            <Link to={ROUTES.FLIGHT_SEARCH} className="inline-flex h-11 items-center justify-center rounded-xl border border-[#4fbba0] px-5 text-sm font-bold text-[#4fbba0] transition hover:bg-[#f1fbf8]">
              Tìm vé máy bay
            </Link>
          </div>
        </div>
      );
    }

    return <div className="space-y-4">{bookings.map((booking) => <BookingCard key={booking._id || booking.id} booking={booking} />)}</div>;
  }, [bookings, error, loading]);

  return (
    <AccountShell user={user} activeItem="history" onLogout={logout} title="Lịch sử đặt vé">
      <div className="overflow-hidden rounded-[18px] border border-emerald-300 bg-white p-3 shadow-[0_6px_16px_rgba(16,185,129,0.08)] sm:p-4">
        {content}
      </div>
    </AccountShell>
  );
};

export default BookingHistoryPage;