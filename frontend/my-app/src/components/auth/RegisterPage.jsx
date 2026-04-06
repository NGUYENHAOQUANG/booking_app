// src/components/auth/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import AuthSidePanel from "./AuthSidePanel";
import { ROUTES } from "@/constants/routes";
import { isValidEmail, isValidPhone, isStrongPassword } from "@/utils/validators";
import useAuthStore from "@/store/authStore";

// ─── Shared input ──────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, type = "text", placeholder, value, onChange, error, right }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div
        className={[
          "flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white transition-all",
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100",
        ].join(" ")}
      >
        {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        {right}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function PasswordField({ label, placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label}
      icon={Lock}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      right={
        <button type="button" onClick={() => setShow(!show)} className="text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}

const SIDE_IMAGE = "src/assets/banner/b4.png";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    password: "", confirmPassword: "",
    agreeTerms: false, agreeMarketing: false,
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())          e.fullName = "Vui lòng nhập họ và tên";
    if (!form.email)                    e.email    = "Vui lòng nhập email";
    else if (!isValidEmail(form.email)) e.email    = "Email không hợp lệ";
    if (!form.phone)                    e.phone    = "Vui lòng nhập số điện thoại";
    else if (!isValidPhone(form.phone)) e.phone    = "Số điện thoại không hợp lệ";
    if (!form.password)                              e.password = "Vui lòng nhập mật khẩu";
    else if (!isStrongPassword(form.password))       e.password = "Cần chữ hoa, thường, số và ký tự đặc biệt (≥8 ký tự)";
    if (!form.confirmPassword)                       e.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Mật khẩu không khớp";
    if (!form.agreeTerms) e.agreeTerms = "Bạn cần đồng ý điều khoản để tiếp tục";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await register({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password,
        acceptTerms: form.agreeTerms,
        allowPromotions: form.agreeMarketing,
      });
      if (res.success) {
        toast.success("Đăng ký tài khoản thành công!");
        navigate(ROUTES.LOGIN, { state: { registerSuccess: true } });
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      const response = err?.response?.data;
      const detailedError = response?.errors?.[0]?.message;
      const msg = detailedError || response?.message || "Đăng ký thất bại, vui lòng thử lại sau.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AuthSidePanel image={SIDE_IMAGE} />

      {/* Panel phải */}
      <div className="flex-1 flex flex-col justify-between bg-white overflow-y-auto">
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Tạo tài khoản mới</h1>
              <p className="text-gray-400 text-sm">Bắt đầu hành trình khám phá mới cùng VivaVivu &lt;3</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Họ tên */}
              <Field
                label="Họ và Tên"
                icon={User}
                placeholder="Nhập Họ và tên của bạn"
                value={form.fullName}
                onChange={set("fullName")}
                error={errors.fullName}
              />

              {/* Email + SĐT */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Email"
                  icon={Mail}
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                />
                <Field
                  label="Số điện thoại"
                  icon={Phone}
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={set("phone")}
                  error={errors.phone}
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-3">
                <PasswordField
                  label="Mật khẩu"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  error={errors.password}
                />
                <PasswordField
                  label="Xác nhận mật khẩu"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  error={errors.confirmPassword}
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-2 mt-1">
                <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
                  <input type="checkbox" checked={form.agreeTerms} onChange={set("agreeTerms")} className="mt-0.5 accent-teal-500" />
                  <span>
                    Tôi đồng ý với các{" "}
                    <a href="#" className="text-teal-600 font-semibold hover:underline">Điều khoản sử dụng</a>
                    {" "}và{" "}
                    <a href="#" className="text-teal-600 font-semibold hover:underline">Chính sách bảo mật</a>.
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-xs text-red-500 -mt-1 ml-5">{errors.agreeTerms}</p>}

                <label className="flex items-start gap-2 cursor-pointer text-sm text-teal-600">
                  <input type="checkbox" checked={form.agreeMarketing} onChange={set("agreeMarketing")} className="mt-0.5 accent-teal-500" />
                  <span>Nhận thông báo về chương trình khuyến mãi và ưu đãi độc quyền qua email.</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white font-bold text-base transition-all shadow-lg shadow-teal-100 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              >
                {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                Đăng Ký Ngay →
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">hoặc đăng ký bằng</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-all">
                  <GoogleIcon /> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-all">
                  <FacebookIcon /> Facebook
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Bạn đã có tài khoản?{" "}
                <Link to={ROUTES.LOGIN} className="text-teal-600 font-bold hover:underline">Đăng nhập ngay</Link>
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-4 border-t flex justify-center gap-5 text-xs text-gray-400">
          <a href="#" className="hover:text-teal-500">TRỢ GIÚP</a>
          <a href="#" className="hover:text-teal-500">BẢO MẬT</a>
          <a href="#" className="hover:text-teal-500">ĐIỀU KHOẢN</a>
          <span>©2026 VivaVivu</span>
        </footer>
      </div>
    </div>
  );
}

// ─── Icon helpers ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 5.1C9.7 39.7 16.4 44 24 44z"/>
      <path fill="#1565C0" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}