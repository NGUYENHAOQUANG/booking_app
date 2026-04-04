import { useState } from "react";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  AlertCircle,
  X,
  Ticket,
  ChevronRight,
  Star,
  Check,
  Users,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";

const BusPaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isGroupPayment, setIsGroupPayment] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-700 font-sans bg-slate-50/50">
      
      {/* --- Stepper Block (Refined) --- */}
      <div className="max-w-4xl mx-auto w-full mb-20 pt-10">
        <div className="relative px-4 md:px-10 h-1">
           {/* Background Grey Bar */}
           <div className="absolute inset-x-10 h-[6px] bg-slate-200 rounded-full">
              {/* Active Teal Bar */}
              <div className="h-full bg-teal-600 rounded-full w-[66.66%] transition-all duration-1000 shadow-sm"></div>
           </div>
           
           <div className="flex items-center justify-between relative w-full -top-[14px]">
             {[
               { step: 1, label: "Tìm kiếm", status: "completed" },
               { step: 2, label: "Chọn ghế ngồi", status: "completed" },
               { step: 3, label: "Bổ sung", status: "active" },
               { step: 4, label: "Thanh toán", status: "waiting" }
             ].map((s, i) => (
               <div key={i} className="flex flex-col items-center group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                    s.status === "completed" ? "bg-teal-600 text-white" :
                    s.status === "active" ? "bg-white border-2 border-teal-500 text-slate-800 ring-4 ring-teal-50" :
                    "bg-white border border-slate-200 text-slate-300"
                  }`}>
                     {s.status === "completed" ? <Check size={14} strokeWidth={3} /> : s.step}
                  </div>
                  <span className={`text-[11px] font-bold mt-4 transition-colors uppercase tracking-tight ${
                    s.status === "completed" || s.status === "active" ? "text-teal-600" : "text-slate-400"
                  }`}>
                     {s.label}
                  </span>
               </div>
             ))}
           </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between items-end gap-6 px-4">
           <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Thông tin thanh toán</h1>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/80 backdrop-blur-sm self-start px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                 <span className="flex items-center gap-2"><MapPin size={14} className="text-teal-600" /> Bus 402 - Hướng tới Đà Nẵng</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                 <span>Tháng 6, 2025</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                 <span>08:00 Sáng</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm text-xs font-bold text-slate-600">
              <Users size={16} className="text-teal-600" />
              <span>Ghế trống đang hiển thị cho: <span className="text-teal-600">2 hành khách</span></span>
              <ChevronDown size={14} className="text-slate-400" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* --- Left Column: Info Form --- */}
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-100/50">
              <h2 className="text-xl font-black text-slate-900 border-l-4 border-teal-500 pl-6 uppercase tracking-tighter mb-12">Thông tin khách hàng</h2>
              
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ <span className="text-red-500 font-bold">*</span></label>
                       <input type="text" placeholder="Nguyễn" className="w-full h-12 px-5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold text-slate-800" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên đệm và Tên <span className="text-red-500 font-bold">*</span></label>
                       <input type="text" placeholder="Văn A" className="w-full h-12 px-5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold text-slate-800" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày sinh <span className="text-red-500 font-bold">*</span></label>
                       <div className="relative group">
                          <input type="text" placeholder="dd/mm/YYYY" className="w-full h-12 px-12 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold text-slate-800" />
                          <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại <span className="text-red-500 font-bold">*</span></label>
                          <input type="text" placeholder="0123456789" className="w-full h-12 px-5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold text-slate-800" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Quốc gia <span className="text-red-500 font-bold">*</span></label>
                          <input type="text" placeholder="Việt Nam" className="w-full h-12 px-5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold text-slate-800" />
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-10 py-4 px-2 border-y border-dashed border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center transition-all group-hover:border-teal-500">
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 scale-100"></div>
                       </div>
                       <span className="text-xs font-black text-slate-700 uppercase tracking-tight group-hover:text-teal-600 transition-colors">Sử dụng CCCD</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center transition-all group-hover:border-teal-500"></div>
                       <span className="text-xs font-black text-slate-700 uppercase tracking-tight group-hover:text-teal-600 transition-colors">Sử dụng hộ chiếu</span>
                    </label>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Số CCCD <span className="text-red-500 font-bold">*</span></label>
                    <input type="text" placeholder="Nhập mã số 12 chữ số" className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-black text-slate-800 tracking-[0.1em]" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày cấp <span className="text-red-500 font-bold">*</span></label>
                       <div className="relative group">
                          <input type="text" placeholder="dd/mm/YYYY" className="w-full h-12 px-12 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold" />
                          <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nơi cấp <span className="text-red-500 font-bold">*</span></label>
                       <input type="text" placeholder="Vd: Công an Thành Phố..." className="w-full h-12 px-5 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-semibold" />
                    </div>
                 </div>
              </div>
           </section>
        </div>

        {/* --- Sidebar: Recap Panel --- */}
        <aside className="lg:col-span-1 space-y-6 sticky top-10">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-teal-900/5 overflow-hidden">
              <div className="p-8 space-y-8">
                 <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Tóm tắt đặt chỗ</h3>
                 
                 {/* Main Trip Card */}
                 <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 group">
                    <div className="h-40 overflow-hidden relative">
                       <img src="https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="trip" />
                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-teal-600 uppercase tracking-widest border border-teal-100 shadow-sm">Hot Pick</div>
                    </div>
                    <div className="p-5 space-y-3">
                       <div className="flex justify-between items-start">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Hồ Chí Minh → Đà Lạt</p>
                          <div className="flex items-center gap-1 text-teal-600 font-black text-xs">
                             <Star size={12} fill="currentColor" /> 4.8
                          </div>
                       </div>
                       <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar size={12} /> 24/8/2025</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} /> 08:00 AM</span>
                       </div>
                    </div>
                 </div>

                 {/* Selected Seats Cards */}
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">CÁC GHẾ ĐÃ CHỌN</p>
                    <div className="space-y-3">
                       {[
                         { id: "1C", passenger: "Hành khách 1", type: "Ghế tiêu chuẩn", price: "100.000" },
                         { id: "3C", passenger: "Hành khách 2", type: "Ghế tiêu chuẩn", price: "100.000" }
                       ].map((seat, i) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-50 rounded-2xl hover:bg-teal-50/30 transition-colors group">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black text-sm border border-teal-100 transition-transform group-hover:scale-110">
                                  {seat.id}
                               </div>
                               <div>
                                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{seat.passenger}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{seat.type}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <span className="text-sm font-black text-slate-900">{seat.price} đ</span>
                               <button className="text-slate-200 hover:text-red-500 transition-colors"><X size={14} /></button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50 text-[11px] text-teal-700 italic font-medium leading-relaxed animate-pulse">
                    💡 Ghế 1C và 3C nằm ở phía lối đi. Rất thoải mái để để chân.
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="space-y-0.5">
                       <p className="text-xs font-black text-slate-900 uppercase">Chia tiền theo nhóm</p>
                       <p className="text-[10px] text-slate-400 font-medium">Chia sẻ chi phí với bạn bè</p>
                    </div>
                    <button onClick={() => setIsGroupPayment(!isGroupPayment)} className={`w-12 h-6 rounded-full transition-all relative ${isGroupPayment ? 'bg-teal-500 shadow-lg shadow-teal-100' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isGroupPayment ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-slate-50">
                    <div className="flex gap-2">
                       <div className="relative flex-1 group">
                          <input type="text" placeholder="Nhập mã khuyến mãi" className="w-full h-11 px-5 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-bold focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all" />
                          <Ticket size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                       </div>
                       <button className="px-6 bg-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-tight hover:bg-teal-600 transition-all shadow-md shadow-teal-100">ÁP DỤNG</button>
                    </div>
                 </div>

                 {/* Grand Totals */}
                 <div className="space-y-3 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                       <span className="uppercase tracking-widest">Tạm Tính</span>
                       <span className="text-slate-800">200.000 đ</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 pb-2">
                       <span className="uppercase tracking-widest">Thuế & Phí dịch vụ</span>
                       <span className="text-slate-800">10.000 đ</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-slate-100">
                       <span className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Tổng cộng</span>
                       <span className="text-3xl font-black text-teal-600 tracking-tighter">210.000<span className="text-base font-normal ml-1">đ</span></span>
                    </div>
                 </div>

                 {/* Payment Selection */}
                 <div className="space-y-3 pt-6">
                    {['momo', 'counter'].map((method) => (
                      <div 
                        key={method}
                        onClick={() => setPaymentMethod(method)} 
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          paymentMethod === method ? "border-slate-800 bg-slate-50 shadow-inner" : "border-slate-100 hover:border-teal-500/30"
                        }`}
                      >
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                           paymentMethod === method ? "border-slate-800 border-4 bg-white" : "border-slate-300"
                         }`}></div>
                         <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                           {method === 'momo' ? "Thanh toán qua MOMO" : "Thanh toán tại quầy"}
                         </span>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-4 pt-4">
                    <button className="w-full h-14 bg-teal-600 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-teal-600/30 active:scale-[0.98] transition-all hover:bg-teal-700">
                      TIẾP TỤC THANH TOÁN
                    </button>
                    <div className="flex justify-center items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">An toàn & Bảo mật bởi VivaVivu</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Reward/Up-sell Card */}
           <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-8 flex items-center gap-5 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer shadow-lg shadow-orange-100/50">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform"><Ticket size={100} /></div>
              <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xl shadow-orange-200 shrink-0 group-hover:rotate-12 transition-all">
                 <Ticket size={28} />
              </div>
              <div className="relative z-10">
                 <p className="text-sm font-black text-orange-900 uppercase italic tracking-tighter">Ưu đãi chuyến tiếp theo</p>
                 <p className="text-[11px] text-orange-700 font-medium mt-1 leading-tight">Tiết kiệm 10% khi hoàn tất đặt chỗ này.</p>
              </div>
           </div>
           
           <Link to="/search" className="flex items-center justify-center gap-2 text-slate-400 hover:text-teal-600 font-bold uppercase tracking-[0.2em] text-[10px] py-4 transition-colors">
              <ChevronRight size={14} className="rotate-180" /> Quay lại tìm kiếm
           </Link>
        </aside>
      </div>
    </div>
  );
};

export default BusPaymentPage;

