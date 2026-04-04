import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  MapPin, 
  Wifi, 
  Coffee, 
  Utensils, 
  Tv, 
  Wind, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  Users, 
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2
} from "lucide-react";

const RoomDetailPage = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  // Mock data for the room
  const room = {
    id: id,
    name: "Luxury Ocean Suite",
    location: "Sơn Trà, Đà Nẵng",
    price: 2500000,
    rating: 4.9,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200"
    ],
    description: "Tận hưởng không gian sống đẳng cấp với tầm nhìn toàn cảnh biển Mỹ Khê. Suite sang trọng này được trang bị đầy đủ tiện nghi hiện đại, thiết kế tinh tế kết hợp giữa phong cách hiện đại và nét kiến trúc truyền thống Việt Nam. Với ban công rộng rãi và hồ bơi vô cực riêng, đây là sự lựa chọn hoàn hảo cho kỳ nghỉ dưỡng trọn vẹn của bạn.",
    amenities: [
      { name: "Wifi miễn phí", icon: <Wifi size={18} /> },
      { name: "Bữa sáng", icon: <Coffee size={18} /> },
      { name: "Điều hòa", icon: <Wind size={18} /> },
      { name: "Smart TV", icon: <Tv size={18} /> },
      { name: "Nhà hàng", icon: <Utensils size={18} /> },
      { name: "An ninh 24/7", icon: <ShieldCheck size={18} /> }
    ],
    policies: [
      "Nhận phòng sau 14:00",
      "Trả phòng trước 12:00",
      "Không hút thuốc trong phòng",
      "Hủy phòng miễn phí trước 48h"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-32">
      {/* --- Breadcrumbs & Actions --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to="/search" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeft size={18} /> Quay lại tìm kiếm
        </Link>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-blue-600 transition-all shadow-sm active:scale-95">
            <Share2 size={16} /> Chia sẻ
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-red-500 hover:text-red-500 transition-all shadow-sm active:scale-95">
            <Heart size={16} /> Lưu lại
          </button>
        </div>
      </div>

      {/* --- Image Gallery --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[400px] lg:h-[600px]">
        <div className="lg:col-span-3 rounded-[3rem] overflow-hidden group relative">
          <img 
            src={room.images[activeImage]} 
            alt={room.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
        <div className="hidden lg:grid grid-cols-1 gap-4 h-full">
          {room.images.map((img, index) => (
            <div 
              key={index} 
              onClick={() => setActiveImage(index)}
              className={`rounded-[2rem] overflow-hidden cursor-pointer relative group border-4 transition-all ${activeImage === index ? "border-blue-600" : "border-transparent"}`}
            >
              <img src={img} alt={`View ${index}`} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-blue-600/10 transition-opacity ${activeImage === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* --- Left Side: Info --- */}
        <div className="lg:col-span-2 space-y-12">
          {/* Main Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] uppercase font-black tracking-widest rounded-lg border border-blue-100">Khách sạn 5 sao</div>
               <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold text-slate-800">{room.rating}</span>
                  <span className="text-sm text-slate-400">({room.reviews} đánh giá)</span>
               </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{room.name}</h1>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
               <MapPin size={18} className="text-blue-600" /> {room.location}
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Mô tả chi tiết</h3>
            <p className="text-slate-500 leading-relaxed font-light text-lg">
              {room.description}
            </p>
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Tiện nghi có sẵn</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
               {room.amenities.map((item, i) => (
                 <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100 shadow-sm shadow-slate-50">
                       {item.icon}
                    </div>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-6">
             <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Chính sách & Quy định</h3>
             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.policies.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-500 font-medium italic">
                     <CheckCircle2 size={18} className="text-green-500 shrink-0" /> {p}
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* --- Right Side: Booking Card --- */}
        <aside className="lg:col-span-1 sticky top-32">
           <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-100/50 border border-slate-100 space-y-8 relative overflow-hidden group hover:shadow-blue-200/50 transition-all">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-blue-100 transition-all"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Giá mỗi đêm</span>
                    <p className="text-4xl font-black text-blue-600 tracking-tighter">
                      {new Intl.NumberFormat('vi-VN').format(room.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-xl border border-green-100">
                    <Zap size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">-15% OFF</span>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar size={14} /> <span className="text-[10px] uppercase font-bold tracking-wider">Ngày nhận - Trả</span>
                      </div>
                      <input type="text" value="12/04/2024 - 15/04/2024" className="w-full bg-transparent border-none outline-none text-slate-900 text-sm font-bold" readOnly />
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Users size={14} /> <span className="text-[10px] uppercase font-bold tracking-wider">Số lượng khách</span>
                      </div>
                      <select className="w-full bg-transparent border-none outline-none text-slate-900 text-sm font-bold appearance-none">
                        <option>2 Người lớn, 1 trẻ em</option>
                        <option>4 Người lớn</option>
                      </select>
                   </div>
                </div>

                <div className="pt-10 space-y-4">
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>3 đêm x {new Intl.NumberFormat('vi-VN').format(room.price)}</span>
                    <span className="text-slate-800 font-bold">{new Intl.NumberFormat('vi-VN').format(room.price * 3)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>Phí dịch vụ ưu đãi</span>
                    <span className="text-green-600 font-bold">-0 VNĐ</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center group/total">
                    <span className="text-lg font-bold text-slate-900">Tổng cộng</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter group-hover/total:text-blue-600 transition-colors">{new Intl.NumberFormat('vi-VN').format(room.price * 3)}</span>
                  </div>
                </div>

                <Link to="/booking" className="w-full h-16 mt-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-blue-200 transition-all active:scale-95 group/btn">
                  Đặt ngay bây giờ <ArrowLeft size={20} className="rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                <p className="mt-6 text-center text-[10px] text-slate-400 font-medium leading-relaxed">
                   Bạn sẽ không bị trừ tiền ở bước này. Một mã xác nhận sẽ được gửi đến email sau khi hoàn tất.
                </p>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default RoomDetailPage;
