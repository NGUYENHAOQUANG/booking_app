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
import { ROUTES } from "@/constants/routes";

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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* --- Navbar --- */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3" : "bg-white py-4 border-b border-slate-50"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center">
                <span className="text-2xl font-bold tracking-tight text-slate-800">
                  <span className="text-[#10967d]">Viva</span>Vivu
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold text-[#10967d]">Trang chủ</Link>
              <div className="flex items-center gap-1 cursor-pointer">
                <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-4 object-cover" />
                <span className="text-sm font-semibold text-slate-700 uppercase">VN</span>
                <Menu size={14} className="text-slate-400 rotate-90" />
              </div>
              
              {!user ? (
                <>
                  <Link to={ROUTES.LOGIN} className="text-sm font-semibold text-slate-700 hover:text-[#10967d] transition-colors">Đăng nhập</Link>
                  <Link to={ROUTES.REGISTER} className="text-sm font-semibold text-slate-700 hover:text-[#10967d] transition-colors">Đăng ký</Link>
                </>
              ) : (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span>{user.fullName}</span>
                    <User size={18} />
                  </button>
                </div>
              )}
            </div>
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
                    location.pathname === link.path ? "bg-blue-50 text-blue-600" : "text-slate-600 active:bg-slate-50"
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
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center text-white font-medium bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">Tham gia ngay</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />

      {/* --- Main Content --- */}
      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
            {/* Brand and Social */}
            <div className="space-y-6">
              <Link to="/" className="text-2xl font-bold text-[#10967d]">VivaVivu</Link>
              <p className="text-slate-400 text-sm leading-relaxed">
                We are vuyp pro hehehehehehehe heheheheheheheh
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110">
                  <img src="https://img.icons8.com/color/48/instagram-new--v1.png" className="w-full h-full" alt="IG" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110">
                  <img src="https://img.icons8.com/color/48/facebook-new.png" className="w-full h-full" alt="FB" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-slate-100 overflow-hidden bg-white">
                  <img src="https://img.icons8.com/color/48/google-logo.png" className="w-full h-full p-1" alt="G" />
                </a>
              </div>
            </div>

            {/* Company Link */}
            <div>
              <h4 className="text-sm font-bold text-[#10967d] uppercase tracking-wider mb-6">Công ty</h4>
              <ul className="space-y-4">
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#10967d] transition-colors">Về chúng tôi</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#10967d] transition-colors">Tuyển dụng</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#10967d] transition-colors">Thông báo</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-sm font-bold text-[#10967d] uppercase tracking-wider mb-6">Support</h4>
              <ul className="space-y-4">
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#10967d] transition-colors">Trung tâm hỗ trợ</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#10967d] transition-colors">Thông tin an toàn</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-[#10967d] transition-colors">Chính sách</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-bold text-[#10967d] uppercase tracking-wider mb-6">Bản tin</h4>
              <p className="text-xs text-slate-400 mb-6">Đăng ký để nhận ưu đãi đặc quyền và thông tin cập nhật</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Tải khoản email của bạn" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#10967d] transition-colors"
                />
                <button className="w-full py-4 bg-[#10967d] text-white rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#10967d]/20 active:scale-[0.98]">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-300">© 2024 VivaVivu. All rights reserved.</p>
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
