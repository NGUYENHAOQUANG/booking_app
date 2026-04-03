import { useState } from "react";
import { Calendar, MapPin, CreditCard, ChevronRight, History, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState("Sắp tới");

  const bookings = [
    {
      id: 1,
      hotelName: "Luxury Ocean Suite",
      location: "Đà Nẵng",
      checkIn: "12/04/2024",
      checkOut: "15/04/2024",
      status: "Sắp tới",
      price: "7.500.000",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400",
      type: "Resort"
    },
    {
      id: 2,
      hotelName: "Mountain Retreat",
      location: "Sapa",
      checkIn: "20/05/2024",
      checkOut: "22/05/2024",
      status: "Đang chờ",
      price: "3.600.000",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=400",
      type: "Boutique"
    },
    {
      id: 3,
      hotelName: "Urban Hotel",
      location: "Hà Nội",
      checkIn: "01/03/2024",
      checkOut: "03/03/2024",
      status: "Đã hoàn thành",
      price: "2.400.000",
      image: "https://images.unsplash.com/photo-1517840901100-8179e982ad93?auto=format&fit=crop&q=80&w=400",
      type: "Hotel"
    }
  ];

  const filteredBookings = bookings.filter(b => b.status === activeTab || (activeTab === "Lịch sử" && b.status === "Đã hoàn thành"));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Chuyến đi của bạn 🧳</h1>
          <p className="text-slate-400 text-sm">Quản lý và theo dõi các đặt phòng hiện tại và lịch sử.</p>
        </div>
        <div className="flex h-12 p-1 bg-slate-100 rounded-2xl shadow-inner w-full md:w-auto">
          {["Sắp tới", "Lịch sử"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:px-8 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Booking List */}
        <div className="lg:col-span-2 space-y-8">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => (
              <div key={b.id} className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row group">
                 <div className="w-full sm:w-1/3 h-48 sm:h-auto relative overflow-hidden">
                    <img src={b.image} alt={b.hotelName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm">{b.type}</div>
                 </div>
                 <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="flex justify-between items-start gap-4">
                       <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{b.hotelName}</h3>
                          <p className="flex items-center gap-1.5 text-slate-400 text-xs font-medium"><MapPin size={14} /> {b.location}, Việt Nam</p>
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                         b.status === "Sắp tới" ? "bg-blue-50 text-blue-600 border-blue-100" :
                         b.status === "Đang chờ" ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                         "bg-green-50 text-green-600 border-green-100"
                       }`}>
                         {b.status}
                       </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl">
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12} /> Nhận phòng</p>
                          <p className="text-sm font-bold text-slate-800">{b.checkIn}</p>
                       </div>
                       <div className="border-l border-slate-200 pl-4">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12} /> Trả phòng</p>
                          <p className="text-sm font-bold text-slate-800">{b.checkOut}</p>
                       </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tổng cộng</p>
                          <p className="text-xl font-black text-slate-900">{b.price} VNĐ</p>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm active:scale-95"><FileText size={18} /></button>
                          <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-100 group-hover:bg-blue-600 flex items-center gap-2">Chi tiết <ChevronRight size={14} /></button>
                       </div>
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[3rem] p-20 border border-slate-50 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <AlertCircle size={48} />
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy đặt phòng</h3>
                  <p className="text-slate-400 text-sm max-w-sm">Hiện tại bạn chưa có chuyến đi nào trong mục "{activeTab}". Bắt đầu chuyến hành trình của bạn ngay thôi!</p>
               </div>
               <Link to="/search" className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center shadow-xl shadow-blue-100 transition-all active:scale-95">Tìm phòng ngay</Link>
            </div>
          )}
        </div>

        {/* --- Sidebar: Summary & Tips --- */}
        <aside className="lg:col-span-1 space-y-8 sticky top-32">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
              <h3 className="text-2xl font-bold tracking-tight relative z-10 uppercase">Tóm tắt</h3>
              <div className="space-y-6 relative z-10 font-light">
                 <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-slate-400 text-sm flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Sắp tới</span>
                    <span className="font-bold">1</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-slate-400 text-sm flex items-center gap-2"><Clock size={16} className="text-yellow-500" /> Đang chờ</span>
                    <span className="font-bold">1</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm flex items-center gap-2"><History size={16} className="text-blue-500" /> Đã hoàn thành</span>
                    <span className="font-bold">1</span>
                 </div>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative z-10">
                 <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 mb-2">Tổng chi tiêu</p>
                 <p className="text-3xl font-black text-white tracking-tighter italic">13.500.000 <span className="text-xs font-light text-slate-500 not-italic">VNĐ</span></p>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm space-y-6">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight leading-tight"><CreditCard size={18} className="text-blue-600" /> Thông tin thanh toán</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Lưu trữ thẻ tín dụng giúp bạn đặt phòng nhanh hơn và nhận được nhiều ưu đãi hoàn tiền hơn từ đối tác của chúng tôi.</p>
              <button className="w-full py-4 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all uppercase tracking-widest">Thêm phương thức mới +</button>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingPage;
