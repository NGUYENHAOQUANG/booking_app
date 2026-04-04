import { 
  Users, 
  CreditCard, 
  History, 
  Settings, 
  LayoutDashboard, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const DashboardPage = () => {
  const { user } = useAuthStore();

  const stats = [
    { name: "Tổng đặt phòng", value: "12", icon: <History className="text-blue-600" />, trend: "+2 tháng này" },
    { name: "Điểm thưởng", value: "2,450", icon: <TrendingUp className="text-green-600" />, trend: "Hạng Vàng" },
    { name: "Đánh giá", value: "8", icon: <StarIcon className="text-yellow-400" />, trend: "4.8 trung bình" },
    { name: "Số dư ví", value: "1.200k", icon: <CreditCard className="text-purple-600" />, trend: "VNĐ" }
  ];

  const recentBookings = [
    { id: 1, name: "Luxury Ocean Suite", date: "12/04/2024", status: "Hoàn thành", price: "2.500.000đ" },
    { id: 2, name: "Mountain Retreat", date: "20/05/2024", status: "Chờ xác nhận", price: "1.800.000đ" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Chào mừng quay lại, {user?.fullName}! 👋</h1>
          <p className="text-slate-400 text-sm">Đây là tổng quan về hoạt động của bạn trong 30 ngày qua.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          <Link to="/profile" className="h-12 px-6 bg-slate-900 border border-slate-800 text-white rounded-2xl text-sm font-bold flex items-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
             Cài đặt tài khoản <Settings size={18} />
          </Link>
        </div>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 group relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm border border-slate-100">
                {stat.icon}
             </div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.name}</p>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</h3>
             <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* --- Main Content --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Đặt phòng gần đây</h3>
              <Link to="/booking" className="text-sm font-bold text-blue-600 hover:underline">Xem tất cả</Link>
           </div>
           <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Phòng / Chỗ ở</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày đặt</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{b.name}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm text-slate-500 font-medium">{b.date}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                             b.status === "Hoàn thành" ? "bg-green-50 text-green-600 border-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"
                           }`}>
                             {b.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="text-sm font-black text-slate-900">{b.price}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-8">
           <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Thanh toán & Ưu đãi</h3>
           <div className="bg-blue-600 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-blue-200">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <h4 className="text-xl font-bold mb-4 relative z-10">Tích điểm nhận quà</h4>
              <p className="text-blue-100 text-sm font-light mb-8 relative z-10 leading-relaxed">Sử dụng điểm thưởng để đổi lấy mã giảm giá lên tới 300,000 VNĐ cho lần đặt tiếp theo.</p>
              <button className="w-full h-14 bg-white text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-900/20 relative z-10">Đổi ngay</button>
           </div>
           
           <div className="bg-white rounded-[3rem] p-8 border border-slate-50 shadow-sm space-y-6">
              <h4 className="font-bold text-slate-900 flex items-center gap-3"><MessageSquare size={20} className="text-blue-600" /> Hỗ trợ nhanh</h4>
              <div className="space-y-4">
                 <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                    <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Hỏi về đặt phòng cũ</span>
                    <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                    <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Báo cáo vấn đề</span>
                    <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon for consistency
const StarIcon = (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

export default DashboardPage;
