// src/components/auth/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import AuthSidePanel from "./AuthSidePanel";
import { ROUTES } from "@/constants/routes";
import { isValidEmail } from "@/utils/validators";
import { authService } from "@/services/authService";

const SIDE_IMAGE = "src/assets/banner/b3.png";

export default function ForgotPasswordPage() {
  const [email,    setEmail]    = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email)               return setError("Vui lòng nhập email");
    if (!isValidEmail(email)) return setError("Email không hợp lệ");
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      // Chuyển sang trang nhập OTP, truyền email qua state
      navigate(ROUTES.VERIFY_OTP, { state: { email } });
    } catch (err) {
      setError(err?.response?.data?.message || "Gửi yêu cầu thất bại, thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AuthSidePanel image={SIDE_IMAGE} />

      <div className="flex-1 flex items-center justify-center bg-white px-8 py-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-3">Quên mật khẩu?</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Vui lòng nhập thông tin bên dưới để đặt lại mật khẩu của bạn!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Email đã đăng ký tài khoản</label>
              <div className={[
                "flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white transition-all",
                error
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100",
              ].join(" ")}>
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  placeholder="Nhập email đã đăng ký"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white font-bold text-base transition-all shadow-lg shadow-teal-100 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Đặt Lại Mật Khẩu
            </button>

            {/* Back */}
            <div className="flex justify-center mt-1">
              <Link
                to={ROUTES.LOGIN}
                className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:underline"
              >
                <ArrowLeft size={15} /> Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}