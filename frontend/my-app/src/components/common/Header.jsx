import { Link, useNavigate, useLocation } from "react-router-dom";
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

const Header = ({ onOpenPasswordModal }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const roleName = typeof user?.role === "object" ? user?.role?.name : null;
  const isAdmin  = ["admin", "superadmin"].includes(roleName);

  const navLinks = [
    { name: "Trang chủ",   path: "/",               icon: Home },
    { name: "Tìm kiếm",   path: "/search",          icon: Compass },
    { name: "Chuyến bay",  path: "/flights",         icon: Compass },
    { name: "Lịch sử vé", path: "/booking-history",  icon: History, private: true },
    { name: "Quản lý",    path: "/dashboard",        icon: Briefcase, private: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
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
                   <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                      <Settings size={16} /> Thông tin cá nhân
                    </Link>
                    <Link to="/booking-history" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50">
                      <History size={16} /> Lịch sử đặt vé
                    </Link>
                    <button onClick={onOpenPasswordModal} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-50">
                      <Lock size={16} /> Đổi mật khẩu
                    </button>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-50">
                        <Settings size={16} /> Admin Panel
                      </Link>
                    )}
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

          <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
              <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-medium transition-colors ${location.pathname === link.path ? "bg-teal-50 text-teal-600" : "text-slate-600 active:bg-slate-50"}`}>
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
  );
};

export default Header;
