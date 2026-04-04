import { Link } from "react-router-dom";
import { MoveLeft, HelpCircle, Briefcase } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-12 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
      
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">
           Lỗi 404
        </div>
        <h1 className="text-8xl sm:text-[12rem] font-black text-slate-900 tracking-tighter leading-none italic select-none">
           Oops!
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight uppercase">Không tìm thấy trang yêu cầu</h2>
        <p className="text-slate-400 text-sm sm:text-lg max-w-md mx-auto font-light leading-relaxed px-4">
           Có vẻ như địa chỉ bạn nhập không tồn tại hoặc đã bị gỡ bỏ. Hãy quay lại trang chủ và thử lại nhé.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <Link to="/" className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 transition-all active:scale-95 group">
           <MoveLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Quay lại trang chủ
        </Link>
        <button className="h-16 px-12 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95">
           Trung tâm trợ giúp <HelpCircle size={20} />
        </button>
      </div>

      <div className="pt-20">
         <Link to="/" className="flex items-center gap-2 group grayscale hover:grayscale-0 transition-all">
            <div className="bg-slate-900 p-2 rounded-xl text-white">
              <Briefcase size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Booking <span className="text-blue-600">App</span></span>
          </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
