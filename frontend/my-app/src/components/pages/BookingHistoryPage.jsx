// src/components/pages/BookingHistoryPage.jsx
import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Clock, Plane, Bus, ChevronRight, X, Loader2,
  AlertCircle, History, ChevronDown, LogOut
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import useBookingStore from "@/store/bookingStore";
import { ROUTES } from "@/constants/routes";
import styles from "./BookingHistoryPage.module.css";

const STATUS_LABELS = {
  pending:          { label: "Chờ xác nhận", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmed:        { label: "Đã xác nhận",  color: "bg-green-50 text-green-700 border-green-200" },
  cancelled:        { label: "Đã hủy",        color: "bg-red-50 text-red-700 border-red-200" },
  completed:        { label: "Hoàn thành",    color: "bg-blue-50 text-blue-700 border-blue-200" },
  refund_requested: { label: "Yêu cầu hoàn tiền", color: "bg-orange-50 text-orange-700 border-orange-200" },
  refunded:         { label: "Đã hoàn tiền",  color: "bg-purple-50 text-purple-700 border-purple-200" },
};

const sideMenu = [
  { label: "Tài khoản", to: "/profile" },
  { label: "Đặt vé của tôi", to: "/booking-history", active: true },
  { label: "Danh sách giao dịch", to: "#" },
  { label: "Thông báo", to: "#" },
  { label: "Hoàn trả", to: "#" },
];

const vnd = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "—";
const formatTime = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "—";

const FILTER_TABS = [
  { value: "",          label: "Tất cả" },
  { value: "pending",   label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const BookingHistoryPage = () => {
  const { user, logout } = useAuthStore();
  const { bookings, pagination, loading, error, fetchMyBookings, cancelBooking } = useBookingStore();

  const [activeFilter, setActiveFilter] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchMyBookings({ status: activeFilter || undefined });
  }, [activeFilter]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đặt vé này không?")) return;
    setCancellingId(bookingId);
    await cancelBooking(bookingId, "Hủy theo yêu cầu khách hàng");
    setCancellingId(null);
  };

  const displayName = user?.fullName || user?.email?.split("@")[0] || "Người dùng";
  const displayEmail = user?.email || "";
  const roleName = user?.role?.displayName || "Thành viên";

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.userHeader}>
            <div className={`${styles.userAvatar} w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg`}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userEmail}>{displayEmail}</h2>
              <p className={styles.userNickname}>{displayName}</p>
            </div>
          </div>

          <div className={styles.memberBadge}>
            <span>🌟 {roleName}</span>
            <ChevronRight size={14} />
          </div>

          <ul className={styles.menuList}>
            {sideMenu.map((item) => (
              <li
                key={item.label}
                className={`${styles.menuItem} ${item.active ? styles.activeItem : ""}`}
              >
                <span className={styles.menuIcon} aria-hidden="true">●</span>
                {item.to === "#" ? (
                  <span>{item.label}</span>
                ) : (
                  <NavLink to={item.to} className={styles.menuLink}>
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
            <li className={styles.menuItem}>
              <span className={styles.menuIcon}>●</span>
              <button
                type="button"
                onClick={() => logout()}
                className={`${styles.menuLink} text-red-500 hover:text-red-600 flex items-center gap-2`}
              >
                <LogOut size={14} />
                Đăng xuất
              </button>
            </li>
          </ul>
        </aside>

        {/* ── Content ── */}
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <History size={22} className="text-teal-500" />
            <h1 className={styles.title}>Lịch sử đặt vé</h1>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeFilter === tab.value
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-teal-500" />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && bookings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <History size={48} className="mb-4 opacity-30" />
              <p className="font-semibold">Chưa có đặt vé nào</p>
              <p className="text-sm mt-1">Hãy khám phá các chuyến bay và xe khách ngay!</p>
              <Link
                to={ROUTES.HOME}
                className="mt-6 px-6 py-2 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors"
              >
                Đặt vé ngay
              </Link>
            </div>
          )}

          {/* Booking list */}
          {!loading && bookings.length > 0 && (
            <div className={styles.listPanel}>
              {bookings.map((booking, index) => {
                const flight = booking.outboundFlight?.flight;
                const isCancelling = cancellingId === booking._id;
                const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;

                return (
                  <article
                    key={booking._id}
                    className={styles.ticketCard}
                    style={{ "--card-delay": `${index * 60}ms` }}
                  >
                    {/* Flight info block */}
                    <div className={styles.transportBlock}>
                      <div className="flex items-center gap-2 mb-1">
                        <Plane size={16} className="text-teal-500" />
                        <h3 className={styles.operatorName}>
                          {flight?.airline?.name || "Chuyến bay"}
                        </h3>
                      </div>
                      <p className={styles.vehicleInfo}>
                        {flight?.flightNumber} —
                        {booking.outboundFlight?.fareClass}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Mã vé:{" "}
                        <span className="font-mono font-bold text-slate-600">
                          {booking.bookingCode}
                        </span>
                      </p>
                    </div>

                    {/* Departure */}
                    <div className={styles.tripBlock}>
                      <p className={styles.metaTime}>
                        {formatTime(flight?.departureTime)}
                      </p>
                      <p className={styles.metaPlace}>
                        {flight?.origin?.code} · {flight?.origin?.city}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className={styles.durationBlock}>
                      <span className="text-xs text-slate-400">
                        {flight?.duration
                          ? `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`
                          : "—"}
                      </span>
                      <span className={styles.durationLine} aria-hidden="true" />
                    </div>

                    {/* Arrival */}
                    <div className={styles.tripBlock}>
                      <p className={styles.metaTime}>
                        {formatTime(flight?.arrivalTime)}
                      </p>
                      <p className={styles.metaPlace}>
                        {flight?.destination?.code} · {flight?.destination?.city}
                      </p>
                    </div>

                    {/* Price + actions */}
                    <div className={styles.priceBlock}>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                      <p className="font-bold text-slate-800 mt-1.5">
                        {vnd(booking.pricing?.total || 0)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatDate(booking.createdAt)}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Link
                          to={`/booking/${booking._id}`}
                          className={styles.detailBtn}
                        >
                          Xem chi tiết
                        </Link>
                        {["pending", "confirmed"].includes(booking.status) && (
                          <button
                            type="button"
                            onClick={() => handleCancel(booking._id)}
                            disabled={isCancelling}
                            className="px-3 py-1.5 text-[11px] font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {isCancelling ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              "Hủy vé"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchMyBookings({ status: activeFilter || undefined, page: p })}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    pagination.page === p
                      ? "bg-teal-500 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingHistoryPage;