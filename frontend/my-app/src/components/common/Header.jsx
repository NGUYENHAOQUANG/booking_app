import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Globe, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import logo from "@/assets/logo/vivavivu-logo.svg";

const Header = ({ onOpenPasswordModal }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className={`fixed top-0 z-50 w-full border-b border-black/5 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
      <div className="max-w-[1400px] mx-auto h-[64px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="VivaVivu logo" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-slate-900">
          <Link to="/" className="text-teal-500">Trang chủ</Link>
          <button className="flex items-center gap-1 text-slate-700">
            <Globe size={14} className="text-red-500" />
            <span>VN</span>
            <ChevronDown size={14} />
          </button>
          <Link to="/login" className="hover:text-teal-500 transition-colors">Đăng nhập</Link>
          <Link to="/register" className="hover:text-teal-500 transition-colors">Đăng ký</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="w-9 h-9 rounded-full grid place-items-center text-slate-600 hover:bg-slate-100 transition-colors">
            <Search size={18} />
          </button>
          {user ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 font-bold grid place-items-center">
                {String(user.fullName || user.email || "U").slice(0, 1).toUpperCase()}
              </button>
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden">
                <Link to="/profile" className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">Thông tin cá nhân</Link>
                <Link to="/booking-history" className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-50">Lịch sử đặt vé</Link>
                <button onClick={onOpenPasswordModal} className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-50">Đổi mật khẩu</button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 border-t border-slate-50">Đăng xuất</button>
              </div>
            </div>
          ) : null}
        </div>

        <button className="md:hidden p-2 text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`md:hidden fixed inset-0 bg-white transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-full p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-semibold">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="w-9 h-9 rounded-full bg-slate-100 grid place-items-center">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-3 text-base">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-teal-50 text-teal-600">Trang chủ</Link>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-700">Đăng nhập</Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-teal-600 text-white">Đăng ký</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
