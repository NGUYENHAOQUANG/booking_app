import { useState } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, Lock, ShieldCheck, Trash2 } from "lucide-react";
import useAuthStore from "@/store/authStore";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Cài đặt tài khoản</h1>
        <p className="text-slate-400 text-sm">Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 shadow-xl shadow-slate-100">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                        <User size={48} />
                      </div>
                    )}
                 </div>
                 <button className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 active:scale-95 transition-all">
                    <Camera size={16} />
                 </button>
              </div>
              <div>
                 <h3 className="text-xl font-bold text-slate-900 leading-tight uppercase tracking-tight">{user?.username}</h3>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 italic">{user?.role || "Member"}</p>
              </div>
              <div className="pt-6 border-t border-slate-50 w-full">
                 <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span>Trạng thái tài khoản</span>
                    <span className="text-green-600">Đã xác minh</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-blue-600 rounded-full shadow-sm shadow-blue-200"></div>
                 </div>
                 <p className="text-[10px] text-slate-400 mt-2 font-medium">Hoàn thiện 85% hồ sơ của bạn.</p>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <ShieldCheck size={32} className="text-blue-400 mb-2" />
              <h4 className="text-lg font-bold">Bảo mật đa lớp</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-light">Kích hoạt xác thực 2 lớp để bảo vệ tài khoản và lịch sử giao dịch của bạn.</p>
              <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">Thiết lập ngay →</button>
           </div>
        </div>

        {/* Right: Detailed Settings Form */}
        <div className="md:col-span-2 space-y-12">
           <form className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-50 shadow-sm space-y-10 group">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tên hiển thị</label>
                    <div className="relative">
                       <User size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <input type="text" defaultValue={user?.username} className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email liên lạc</label>
                    <div className="relative">
                       <Mail size={18} className="absolute left-4 top-4 text-slate-400" />
                       <input type="email" defaultValue={user?.email || "quang@example.com"} className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none" readOnly />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Số điện thoại</label>
                    <div className="relative">
                       <Phone size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <input type="tel" defaultValue="0987 *** ***" className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Vị trí hiện tại</label>
                    <div className="relative">
                       <MapPin size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <input type="text" placeholder="Thành phố của bạn" className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all" />
                    </div>
                 </div>
              </div>

              <div className="pt-10 border-t border-slate-50">
                 <h4 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight leading-tight"><Lock size={20} className="text-blue-600" /> Đổi mật khẩu</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Mật khẩu mới</label>
                       <input type="password" placeholder="••••••••" className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Xác nhận mật khẩu</label>
                       <input type="password" placeholder="••••••••" className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all" />
                    </div>
                 </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-slate-50">
                 <button type="button" className="text-red-500 font-bold text-sm flex items-center gap-2 hover:underline p-2">
                    <Trash2 size={18} /> Vô hiệu hóa tài khoản
                 </button>
                 <button type="submit" className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-blue-200 active:scale-95 transition-all">
                    Lưu các thay đổi <Save size={20} />
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
