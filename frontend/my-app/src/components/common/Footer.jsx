import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

// Simple Icon wrappers for convenience
const Facebook = (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const Twitter = (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
const Instagram = (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 mt-20">
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
          <p>© 2025 hahaha Booking App. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
