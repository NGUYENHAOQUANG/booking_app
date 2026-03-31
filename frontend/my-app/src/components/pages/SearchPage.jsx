import { useState } from "react";
import { Search as SearchIcon, MapPin, Star, Heart, SlidersHorizontal, ChevronDown, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [activeFilters, setActiveFilters] = useState(["Toàn bộ"]);

  const rooms = [
    {
      id: 1,
      name: "Luxury Ocean Suite",
      location: "Đà Nẵng",
      price: 2500000,
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600",
      type: "Resort",
      amenities: ["Wifi", "Hồ bơi", "Ăn sáng"]
    },
    {
      id: 2,
      name: "Mountain Retreat",
      location: "Sapa",
      price: 1800000,
      rating: 4.8,
      reviews: 86,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600",
      type: "Boutique",
      amenities: ["Bếp", "Ban công", "Tivi"]
    },
    {
      id: 3,
      name: "Urban Boutique Hotel",
      location: "Hà Nội",
      price: 1200000,
      rating: 4.7,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1517840901100-8179e982ad93?auto=format&fit=crop&q=80&w=600",
      type: "Hotel",
      amenities: ["Wifi", "Gym", "Bar"]
    },
    {
      id: 4,
      name: "Green Valley Villa",
      location: "Đà Lạt",
      price: 3200000,
      rating: 4.9,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600",
      type: "Villa",
      amenities: ["Sân vườn", "BBQ", "Karaoke"]
    },
    {
      id: 5,
      name: "Sunset Beach House",
      location: "Phan Thiết",
      price: 2100000,
      rating: 4.6,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600",
      type: "House",
      amenities: ["Gần biển", "Bếp", "Máy giặt"]
    },
    {
      id: 6,
      name: "Royal Palace Hotel",
      location: "Huế",
      price: 1500000,
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
      type: "Hotel",
      amenities: ["Hồ bơi", "Spa", "Lịch sử"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Kết quả tìm kiếm</h1>
          <p className="text-sm text-slate-400">Tìm thấy {rooms.length} phòng trống tại khu vực của bạn.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Sorting */}
          <div className="relative group">
            <button className="h-12 px-6 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
              Sắp xếp theo: Phổ biến nhất <ChevronDown size={16} />
            </button>
          </div>

          {/* View Toggle */}
          <div className="h-12 p-1 bg-slate-100 rounded-2xl flex items-center shadow-inner">
            <button 
              onClick={() => setViewMode("grid")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={18} />
            </button>
          </div>

          {/* mobile filter button */}
          <button className="lg:hidden h-12 px-6 bg-blue-600 text-white rounded-2xl text-sm font-bold flex items-center gap-3 shadow-lg shadow-blue-200 active:scale-95 transition-all">
            <SlidersHorizontal size={18} /> Bộ lọc
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* --- Sidebar Filters (Hidden on small screens) --- */}
        <aside className="hidden lg:block space-y-10 sticky top-32">
          {/* Search bar mini */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <SearchIcon size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Vị trí, tên khách sạn..." 
              className="w-full h-14 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Loại chỗ ở</h3>
            <div className="space-y-4">
              {["Toàn bộ", "Khách sạn", "Căn hộ", "Resort", "Biệt thự"].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked={type === "Toàn bộ"} />
                    <div className="w-full h-full bg-white border-2 border-slate-200 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all group-hover:border-blue-400"></div>
                    <svg className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Khoảng giá (đêm)</h3>
             <input type="range" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
             <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
               <span>0 VNĐ</span>
               <span>10M VNĐ</span>
             </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Tiện nghi</h3>
            <div className="flex flex-wrap gap-2">
              {["Wifi", "Hồ bơi", "Ăn sáng", "Gần biển", "Gym", "Spa"].map((tag) => (
                <button key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* --- Main Content: Room List --- */}
        <div className="lg:col-span-3">
          <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
            {rooms.map((room) => (
              <Link 
                to={`/rooms/${room.id}`} 
                key={room.id} 
                className={`group bg-white rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden ${
                  viewMode === "list" ? "flex flex-col md:flex-row h-auto md:h-64" : ""
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-full md:w-2/5 h-64 md:h-full" : "h-64"}`}>
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-white hover:text-red-500 transition-all">
                    <Heart size={18} />
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-slate-800 uppercase tracking-wider">{room.type}</span>
                  </div>
                </div>

                {/* Content Container */}
                <div className={`p-6 flex flex-col justify-between ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight uppercase tracking-tight">{room.name}</h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Star size={14} className="text-yellow-400" fill="currentColor" />
                        <span className="text-sm font-bold text-slate-800">{room.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                      <MapPin size={14} /> <span>{room.location}, Việt Nam</span>
                    </div>
                    {/* Amenities indicators */}
                    <div className="flex items-center gap-3 pt-2">
                       {room.amenities.map(a => (
                         <span key={a} className="text-[10px] text-slate-500 font-bold border-r border-slate-200 pr-3 last:border-0">{a}</span>
                       ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">Giá chỉ từ</span>
                      <p className="text-2xl font-black text-blue-600 tracking-tighter">
                        {new Intl.NumberFormat('vi-VN').format(room.price)}
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1 self-center underline decoration-blue-600/30"> / đêm</span>
                      </p>
                    </div>
                    <button className="h-12 px-6 bg-slate-900 text-white rounded-2xl text-sm font-bold active:scale-95 transition-all group-hover:bg-blue-600">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-16 flex justify-center gap-3">
             <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold">1</button>
             <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 hover:border-blue-600 transition-all font-bold">2</button>
             <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 hover:border-blue-600 transition-all font-bold">3</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
