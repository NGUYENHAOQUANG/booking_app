import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";
import logo from "@/assets/logo/vivavivu-logo.svg";

const Footer = () => {
  return (
    <footer className="bg-white pt-12 pb-16 border-t border-black/5">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr] gap-10 items-start">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="VivaVivu logo" className="h-12 w-auto" />
            </Link>
            <p className="max-w-xs text-sm text-slate-500 leading-6">
              We are your pro hehehehehehe heheheheheheh. Nền tảng đặt vé và dịch vụ du lịch với trải nghiệm nhanh, gọn và trực quan.
            </p>
            <div className="mt-6 flex items-center gap-4 text-slate-500">
              <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" aria-label="Youtube" className="hover:text-red-500 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-teal-600 mb-4">Công ty</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Về chúng tôi</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Tuyển dụng</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Thông báo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-teal-600 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Trung tâm hỗ trợ</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Thông tin an toàn</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Chính sách</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-teal-600 mb-4">Bản tin</h4>
            <p className="text-sm text-slate-500 leading-6 mb-4">
              Đăng ký để nhận ưu đãi độc quyền và thông tin cập nhật.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-400">
                <Mail size={16} />
                <span>Tài khoản email của bạn</span>
              </div>
              <button className="w-full rounded-full bg-[#14a39a] py-3 text-white font-semibold hover:bg-[#10948a] transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
