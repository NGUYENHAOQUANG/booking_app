import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const featuredRooms = [
    {
      id: 1,
      name: "Luxury Ocean Suite",
      location: "Đà Nẵng",
      price: 2500000,
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000",
      tags: ["View biển", "Hồ bơi riêng", "Ăn sáng"]
    },
    {
      id: 2,
      name: "Mountain Retreat",
      location: "Sapa",
      price: 1800000,
      rating: 4.8,
      reviews: 86,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000",
      tags: ["Gần mây", "Ban công", "Bếp"]
    },
    {
      id: 3,
      name: "Urban Boutique Hotel",
      location: "Hà Nội",
      price: 1200000,
      rating: 4.7,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1517840901100-8179e982ad93?auto=format&fit=crop&q=80&w=1000",
      tags: ["Trung tâm", "Wifi mạnh", "Gym"]
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* --- Hero Section --- */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100 shadow-sm shadow-blue-50">
              <Zap size={16} /> <span>Ưu đãi cuối tuần: Giảm tới 30%</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif text-slate-900 leading-[1.1] mb-8">
              Khám phá <span className="text-blue-600 italic">điểm đến</span> mơ ước của bạn.
            </h1>
            <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed font-light">
              Tìm kiếm và đặt phòng khách sạn tốt nhất với trải nghiệm người dùng tuyệt vời và hàng ngàn lựa chọn đa dạng cho kỳ nghỉ của bạn.
            </p>
            
            {/* Search Card */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-2xl shadow-blue-100/50 border border-slate-100 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <MapPin size={14} /> <span className="text-[10px] uppercase font-bold tracking-wider">Địa điểm</span>
                  </div>
                  <input type="text" placeholder="Bạn muốn đi đâu?" className="w-full bg-transparent border-none outline-none text-slate-900 text-sm font-medium" />
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar size={14} /> <span className="text-[10px] uppercase font-bold tracking-wider">Ngày nhận</span>
                  </div>
                  <input type="date" className="w-full bg-transparent border-none outline-none text-slate-900 text-sm font-medium" />
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Users size={14} /> <span className="text-[10px] uppercase font-bold tracking-wider">Khách</span>
                  </div>
                  <select className="w-full bg-transparent border-none outline-none text-slate-900 text-sm font-medium appearance-none">
                    <option>2 Người lớn</option>
                    <option>4 Người lớn</option>
                    <option>Cả gia đình</option>
                  </select>
                </div>
              </div>
              <button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95 group">
                <Search size={20} className="group-hover:scale-110 transition-transform" /> Tìm kiếm ngay
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-blue-300 rounded-[3rem] rotate-3 opacity-20 scale-95 transition-transform group-hover:rotate-6"></div>
            <img 
              src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200" 
              alt="Holiday resort" 
              className="relative z-10 w-full h-[600px] object-cover rounded-[3rem] shadow-2xl transition-transform group-hover:scale-[1.02]"
            />
            <div className="absolute -bottom-8 -left-8 z-20 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 hidden sm:block animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200">
                       <img src={`https://i.pravatar.cc/150?u=${i}`} className="rounded-full w-full h-full" alt="User" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">50k+ Người tin dùng</p>
                  <div className="flex text-yellow-400 gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Featured Section --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Điểm đến hàng đầu</span>
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Lựa chọn cao cấp cho bạn.</h2>
          </div>
          <Link to="/search" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors group">
            Xem tất cả <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <div key={room.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-[2.5rem] mb-6">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-white hover:text-red-500 transition-all">
                  <Heart size={20} />
                </div>
                <div className="absolute bottom-4 left-4 bg-white py-2 px-4 rounded-xl shadow-lg border border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm font-bold text-slate-800">{room.rating}</span>
                    <span className="text-[10px] text-slate-400">({room.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="px-2 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{room.name}</h3>
                  <p className="text-blue-600 font-bold tracking-tight">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
                    <span className="text-xs text-slate-400 font-normal"> / đêm</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <MapPin size={14} /> <span>{room.location}, Việt Nam</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {room.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-700 rounded-full blur-[100px] opacity-20"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">Sẵn sàng để bắt đầu kỳ nghỉ của bạn?</h2>
               <p className="text-slate-400 text-lg mb-12 font-light">Nhận ưu đãi độc quyền lên tới 50% cho khách hàng mới đăng ký ngay hôm nay.</p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center shadow-2xl shadow-blue-900 transition-all active:scale-95">Tham gia miễn phí</Link>
                  <Link to="/search" className="h-14 px-10 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold flex items-center justify-center transition-all active:scale-95">Liên hệ tư vấn</Link>
               </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
