// src/components/pages/AdminPage.jsx
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Plane, TicketCheck, Settings,
  Search, ChevronRight, Loader2, AlertCircle, Plus,
  ToggleLeft, ToggleRight, TrendingUp, Activity, RefreshCw
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

const vnd = (n) => n != null ? new Intl.NumberFormat("vi-VN").format(n) + "đ" : "—";
const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "—";

const STATUS_PILL = {
  pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};
const STATUS_LABELS = {
  pending: "Chờ xác nhận", confirmed: "Đã xác nhận",
  completed: "Hoàn thành", cancelled: "Đã hủy",
};

export default function AdminPage() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Detect route
  useEffect(() => {
    if (location.pathname.includes("/users"))    setActiveTab("users");
    else if (location.pathname.includes("/bookings")) setActiveTab("bookings");
    else if (location.pathname.includes("/flights")) setActiveTab("flights");
    else setActiveTab("overview");
  }, [location.pathname]);

  useEffect(() => {
    if (activeTab === "users")    fetchUsers();
    if (activeTab === "bookings") fetchBookings();
  }, [activeTab]);

  const fetchUsers = async (q = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/users?limit=20${q ? `&q=${q}` : ""}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setUsers(data.data);
      else setError(data.message);
    } catch {
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      // Admin có thể thấy booking của mình, cần API riêng cho admin
      const res = await fetch("/api/bookings/my?limit=20", { credentials: "include" });
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch {
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}/toggle-active`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => u._id === userId ? { ...u, isActive: data.data.isActive } : u)
        );
      }
    } catch {
      setError("Không thể cập nhật trạng thái người dùng");
    }
  };

  const SIDEBAR_ITEMS = [
    { key: "overview",  icon: <LayoutDashboard size={18} />, label: "Tổng quan",   to: ROUTES.ADMIN },
    { key: "users",     icon: <Users size={18} />,           label: "Người dùng",  to: ROUTES.ADMIN_USERS },
    { key: "bookings",  icon: <TicketCheck size={18} />,     label: "Đặt vé",      to: ROUTES.ADMIN_BOOKINGS },
    { key: "flights",   icon: <Plane size={18} />,           label: "Chuyến bay",  to: ROUTES.ADMIN_FLIGHTS },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto flex">
        {/* ── Sidebar ── */}
        <aside className="w-64 flex-shrink-0 min-h-[calc(100vh-6rem)] bg-white border-r border-slate-100 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Settings size={18} className="text-white" />
              </div>
              <div>
                <p className="font-black text-slate-800 text-sm">Admin Panel</p>
                <p className="text-xs text-slate-400">{user?.fullName}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.icon}
                {item.label}
                {activeTab === item.key && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 p-8 space-y-8">
          {/* ─ Overview ─ */}
          {activeTab === "overview" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Tổng quan hệ thống</h1>
                  <p className="text-sm text-slate-400 mt-1">Xin chào, {user?.fullName}!</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 flex items-center gap-2 hover:border-blue-300 transition-colors"
                >
                  <RefreshCw size={15} /> Làm mới
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: <Users size={22} className="text-blue-600" />, label: "Người dùng", value: "—", bg: "bg-blue-50" },
                  { icon: <TicketCheck size={22} className="text-green-600" />, label: "Tổng đặt vé", value: "—", bg: "bg-green-50" },
                  { icon: <Plane size={22} className="text-purple-600" />, label: "Chuyến bay", value: "—", bg: "bg-purple-50" },
                  { icon: <TrendingUp size={22} className="text-orange-600" />, label: "Doanh thu", value: "—", bg: "bg-orange-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                      {stat.icon}
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                <Activity size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-800">Hướng dẫn sử dụng Admin Panel</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Sử dụng menu bên trái để quản lý Người dùng, Đặt vé và Chuyến bay.
                    Chọn tab <strong>Người dùng</strong> để xem và quản lý tài khoản,
                    <strong> Đặt vé</strong> để theo dõi booking,
                    <strong> Chuyến bay</strong> để quản lý lịch bay.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ─ Users tab ─ */}
          {activeTab === "users" && (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900">Quản lý người dùng</h1>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên / email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchUsers(userSearch)}
                      className="pl-9 pr-4 h-10 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-white w-64"
                    />
                  </div>
                  <button
                    onClick={() => fetchUsers(userSearch)}
                    className="h-10 px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
                  >
                    <RefreshCw size={14} /> Làm mới
                  </button>
                </div>
              </div>

              {loading && (
                <div className="flex justify-center py-16">
                  <Loader2 size={36} className="animate-spin text-blue-400" />
                </div>
              )}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle size={18} />{error}
                </div>
              )}
              {!loading && !error && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Người dùng</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày tạo</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {u.fullName?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{u.fullName}</p>
                                <p className="text-xs text-slate-400">{u.phoneNumber || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                              {u.role?.displayName || u.role?.name || "User"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">{formatDate(u.createdAt)}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleUser(u._id, u.isActive)}
                              title={u.isActive ? "Click để vô hiệu hóa" : "Click để kích hoạt"}
                              className="transition-all hover:scale-110"
                            >
                              {u.isActive ? (
                                <ToggleRight size={28} className="text-green-500" />
                              ) : (
                                <ToggleLeft size={28} className="text-slate-300" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && !loading && (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
                            Không tìm thấy người dùng nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ─ Bookings tab ─ */}
          {activeTab === "bookings" && (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900">Quản lý đặt vé</h1>
                <button
                  onClick={fetchBookings}
                  className="h-10 px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <RefreshCw size={14} /> Làm mới
                </button>
              </div>

              {loading && (
                <div className="flex justify-center py-16">
                  <Loader2 size={36} className="animate-spin text-blue-400" />
                </div>
              )}
              {!loading && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Mã vé</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Hành trình</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày đặt</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tổng tiền</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {bookings.map((b) => {
                        const f = b.outboundFlight?.flight;
                        return (
                          <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700">{b.bookingCode}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <Plane size={13} className="text-blue-400" />
                                {f ? `${f.origin?.code} → ${f.destination?.code}` : "—"}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{f?.flightNumber || "—"}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{formatDate(b.createdAt)}</td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{vnd(b.pricing?.total)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${STATUS_PILL[b.status] || STATUS_PILL.pending}`}>
                                {STATUS_LABELS[b.status] || b.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {bookings.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
                            Không có đặt vé nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ─ Flights tab ─ */}
          {activeTab === "flights" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900">Quản lý chuyến bay</h1>
                <button className="h-10 px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition">
                  <Plus size={15} /> Thêm chuyến bay
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                <Plane size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-800">Quản lý Chuyến Bay</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Tính năng quản lý chuyến bay sẽ được tích hợp hoàn chỉnh ở phiên bản tiếp theo.
                    Hiện tại, bạn có thể tạo chuyến bay qua API endpoint{" "}
                    <code className="bg-blue-100 px-1 rounded">POST /api/flights</code>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
