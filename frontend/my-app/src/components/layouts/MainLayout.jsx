import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  User, 
  Menu, 
  X, 
  Home, 
  Compass, 
  History, 
  LogOut, 
  Settings,
  Briefcase,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Trang chủ", path: "/", icon: Home },
    { name: "Tìm kiếm", path: "/search", icon: Compass },
    { name: "Chuyến đi", path: "/booking", icon: History, private: true },
    { name: "Quản lý", path: "/dashboard", icon: Briefcase, private: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 selection:text-teal-700">
      {/* --- Navbar --- */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-teal-600 p-2 rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-teal-200">
                <Briefcase size={22} strokeWidth={2.5} />
              </div>
              <span className={`text-xl font-bold tracking-tight ${scrolled ? "text-slate-800" : "text-slate-900"}`}>
                Viva<span className="text-teal-600">Vivu</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.filter(link => !link.private || (link.private && user)).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                    location.pathname === link.path ? "text-teal-600" : "text-slate-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-teal-600 transition-colors">
                <Search size={20} />
              </button>
              
              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-slate-800">{user.fullName}</span>
                    <span className="text-xs text-slate-400 capitalize">{user.role?.displayName || 'User'}</span>
                  </div>
                  <div className="relative group">
                    <button className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden transform group-hover:scale-105 transition-transform">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600">
                          <User size={20} />
                        </div>
                      )}
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <Settings size={16} /> Thông tin cá nhân
                      </Link>
                      <button onClick={() => setIsPasswordModalOpen(true)} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50">
                        <Lock size={16} /> Đổi mật khẩu
                      </button>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50">
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-800 hover:text-teal-600 transition-colors">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg shadow-teal-200 transition-all active:scale-95">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-[60] bg-white transform transition-transform duration-300 md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-bold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-medium transition-colors ${
                    location.pathname === link.path ? "bg-teal-50 text-teal-600" : "text-slate-600 active:bg-slate-50"
                  }`}
                >
                  <link.icon size={22} />
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-slate-100">
              {user ? (
                <button onClick={handleLogout} className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-500 font-medium active:bg-red-50">
                  <LogOut size={22} /> Đăng xuất
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center text-slate-600 font-medium bg-slate-100 rounded-2xl">Đăng nhập</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center text-white font-medium bg-teal-600 rounded-2xl shadow-lg shadow-teal-200">Đăng ký</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />

      {/* --- Main Content --- */}
      <main className="pt-24 pb-20">
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="bg-teal-600 p-2 rounded-xl text-white">
                  <Briefcase size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight">Viva<span className="text-teal-600">Vivu</span></span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">
                Nền tảng đặt phòng khách sạn hàng đầu Việt Nam. Mang đến cho bạn kỳ nghỉ tuyệt vời với giá cả ưu đãi nhất.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Dịch vụ</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/search" className="hover:text-blue-600 transition-colors">Tìm phòng khách sạn</Link></li>
                <li><Link to="/" className="hover:text-blue-600 transition-colors">Ưu đãi hôm nay</Link></li>
                <li><Link to="/" className="hover:text-blue-600 transition-colors">Đặc quyền VIP</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Hỗ trợ</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-blue-600 transition-colors">Trung tâm trợ giúp</Link></li>
                <li><Link to="/" className="hover:text-blue-600 transition-colors">Chính sách hoàn tiền</Link></li>
                <li><Link to="/" className="hover:text-blue-600 transition-colors">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Kết nối</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Facebook size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Instagram size={18} /></a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© 2024 Booking App. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600 transition-colors">Điều khoản dịch vụ</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple Icon wrappers for convenience
const Facebook = (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const Twitter = (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
const Instagram = (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;

export default MainLayout;
