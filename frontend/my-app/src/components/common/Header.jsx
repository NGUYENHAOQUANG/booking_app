import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bus, ChevronDown, Globe, Menu, Plane, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { ROUTES } from "@/constants/routes";
import logo from "@/assets/logo/vivavivu-logo.svg";

const Header = ({ onOpenPasswordModal }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");
  const [locale, setLocale] = useState(() => localStorage.getItem("app_locale") || "VN");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenusTimer = window.setTimeout(() => {
      setIsMenuOpen(false);
      setIsLanguageOpen(false);
      setIsQuickSearchOpen(false);
    }, 0);

    return () => window.clearTimeout(closeMenusTimer);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsLanguageOpen(false);
        setIsQuickSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem("app_locale", locale);
  }, [locale]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const handleQuickSearch = (event) => {
    event.preventDefault();
    const q = quickQuery.trim();
    if (!q) return;

    if (q.toLowerCase().startsWith("bus:")) {
      navigate(`${ROUTES.BUS_SEARCH}?q=${encodeURIComponent(q.replace(/^bus:/i, "").trim())}`);
      return;
    }

    if (q.toLowerCase().startsWith("flight:")) {
      navigate(`${ROUTES.FLIGHT_SEARCH}?q=${encodeURIComponent(q.replace(/^flight:/i, "").trim())}`);
      return;
    }

    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`);
  };

  const isActive = (path) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  const navClass = (path) =>
    isActive(path)
      ? "text-teal-500"
      : "text-slate-700 hover:text-teal-500 transition-colors";

  return (
    <header className={`fixed top-0 z-50 w-full border-b border-black/5 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
      <div className="max-w-[1400px] mx-auto h-[64px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="shrink-0">
          <img src={logo} alt="VivaVivu logo" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-slate-900">
          <Link to={ROUTES.HOME} className={navClass(ROUTES.HOME)}>Trang chủ</Link>
          <Link to={ROUTES.FLIGHT_SEARCH} className={`flex items-center gap-1 ${navClass(ROUTES.FLIGHT_SEARCH)}`}>
            <Plane size={14} />
            <span>Vé máy bay</span>
          </Link>
          <Link to={ROUTES.BUS_SEARCH} className={`flex items-center gap-1 ${navClass(ROUTES.BUS_SEARCH)}`}>
            <Bus size={14} />
            <span>Vé xe khách</span>
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLanguageOpen((prev) => !prev)}
              className="flex items-center gap-1 text-slate-700 hover:text-teal-500 transition-colors"
            >
              <Globe size={14} className="text-red-500" />
              <span>{locale}</span>
              <ChevronDown size={14} />
            </button>
            {isLanguageOpen && (
              <div className="absolute top-full mt-2 w-28 rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                <button type="button" onClick={() => setLocale("VN")} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${locale === "VN" ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`}>
                  VN
                </button>
                <button type="button" onClick={() => setLocale("EN")} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${locale === "EN" ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`}>
                  EN
                </button>
              </div>
            )}
          </div>
          {!user && (
            <>
              <Link to={ROUTES.LOGIN} className="hover:text-teal-500 transition-colors">Đăng nhập</Link>
              <Link to={ROUTES.REGISTER} className="hover:text-teal-500 transition-colors">Đăng ký</Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsQuickSearchOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full grid place-items-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Search size={18} />
          </button>
          {isQuickSearchOpen && (
            <form onSubmit={handleQuickSearch} className="absolute right-28 top-[72px] z-50 w-80 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
              <p className="mb-2 text-xs font-semibold text-slate-400">Tìm nhanh: bus:Da Lat hoặc flight:HAN-SGN</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(event) => setQuickQuery(event.target.value)}
                  placeholder="Nhập từ khoá tìm kiếm..."
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-500"
                />
                <button type="submit" className="h-10 rounded-xl bg-teal-600 px-3 text-sm font-semibold text-white hover:bg-teal-700">Tìm</button>
              </div>
            </form>
          )}
          {user ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 font-bold grid place-items-center">
                {String(user.fullName || user.email || "U").slice(0, 1).toUpperCase()}
              </button>
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden">
                <Link to={ROUTES.PROFILE} className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">Thông tin cá nhân</Link>
                <Link to={ROUTES.BOOKING_HISTORY} className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-t border-slate-50">Lịch sử đặt vé</Link>
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
            <Link to={ROUTES.HOME} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-teal-50 text-teal-600">Trang chủ</Link>
            <Link to={ROUTES.FLIGHT_SEARCH} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-700">Vé máy bay</Link>
            <Link to={ROUTES.BUS_SEARCH} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-700">Vé xe khách</Link>
            <div className="flex items-center gap-2 px-2 py-1">
              <button type="button" onClick={() => setLocale("VN")} className={`rounded-xl px-3 py-2 text-sm ${locale === "VN" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"}`}>VN</button>
              <button type="button" onClick={() => setLocale("EN")} className={`rounded-xl px-3 py-2 text-sm ${locale === "EN" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"}`}>EN</button>
            </div>
            {!user && (
              <>
                <Link to={ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-700">Đăng nhập</Link>
                <Link to={ROUTES.REGISTER} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-teal-600 text-white">Đăng ký</Link>
              </>
            )}
            {user && (
              <>
                <Link to={ROUTES.PROFILE} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-700">Thông tin cá nhân</Link>
                <Link to={ROUTES.BOOKING_HISTORY} onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-700">Lịch sử đặt vé</Link>
                <button onClick={async () => { await handleLogout(); setIsMenuOpen(false); }} className="px-4 py-3 rounded-2xl bg-rose-50 text-rose-600 text-left">Đăng xuất</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
