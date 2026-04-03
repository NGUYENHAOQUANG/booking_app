import { useState } from "react";
import { Lock, AlertCircle, CheckCircle2, X, Save } from "lucide-react";
import { authService } from "@/services/authService";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!isOpen) return null;

  const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!passwords.currentPassword) {
      return setMessage({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại!" });
    }
    if (passwords.newPassword.length < 8) {
      return setMessage({ type: "error", text: "Mật khẩu mới phải từ 8 ký tự!" });
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMessage({ type: "error", text: "Xác nhận mật khẩu không khớp!" });
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Đổi mật khẩu thất bại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">Đổi mật khẩu</h3>
              <p className="text-sm text-slate-500 mt-1">Bảo vệ tài khoản của bạn</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                {message.type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <CheckCircle2 size={20} className="shrink-0" />}
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Mật khẩu hiện tại</label>
              <input 
                type="password" name="currentPassword" 
                value={passwords.currentPassword} onChange={handleChange} 
                placeholder="••••••••" 
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Mật khẩu mới</label>
              <input 
                type="password" name="newPassword" 
                value={passwords.newPassword} onChange={handleChange} 
                placeholder="••••••••" 
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Xác nhận mật khẩu mới</label>
              <input 
                type="password" name="confirmPassword" 
                value={passwords.confirmPassword} onChange={handleChange} 
                placeholder="••••••••" 
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all" 
              />
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button 
                type="button" onClick={onClose}
                className="flex-1 h-12 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" disabled={loading} 
                className="flex-1 flex gap-2 justify-center items-center h-12 font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                {loading ? "Đang xử lý..." : "Lưu thay đổi"} <Save size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
