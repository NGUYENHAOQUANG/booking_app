// src/components/auth/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, Lock } from "lucide-react";
import AuthSidePanel from "./AuthSidePanel";
import { ROUTES } from "@/constants/routes";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import useAuthStore from "@/store/authStore";

const SIDE_IMAGE = "src/assets/banner/b1.png";

export default function LoginPage() {
  const [tab,      setTab]      = useState("email"); // "email" | "phone"
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form,     setForm]     = useState({ identifier: "", password: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const login    = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const switchTab = (t) => { setTab(t); setForm({ identifier: "", password: "" }); setErrors({}); setApiError(""); };

  const validate = () => {
    const e = {};
    if (!form.identifier) {
      e.identifier = tab === "email" ? "Vui lòng nhập email" : "Vui lòng nhập số điện thoại";
    } else if (tab === "email"  && !isValidEmail(form.identifier)) {
      e.identifier = "Email không hợp lệ";
    } else if (tab === "phone" && !isValidPhone(form.identifier)) {
      e.identifier = "Số điện thoại không hợp lệ";
    }
    if (!form.password) e.password = "Vui lòng nhập mật khẩu";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setApiError("");
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const payload = tab === "email"
        ? { email: form.identifier, password: form.password }
        : { phone: form.identifier, password: form.password };
      await login(payload);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err?.response?.data?.message || "Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AuthSidePanel image={SIDE_IMAGE} />

      {/* Panel phải */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Chào mừng trở lại</h1>
            <p className="text-gray-400 text-sm">Vui lòng đăng nhập để bắt đầu hành trình của bạn!</p>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-all">
              <GoogleIcon /> Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-all">
              <FacebookIcon /> Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">hoặc đăng nhập bằng email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Tab */}
          <div className="flex border-b border-gray-200 mb-5">
            {[["email", "Email"], ["phone", "Số điện thoại"]].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => switchTab(key)}
                className={[
                  "flex-1 pb-2.5 text-sm font-semibold border-b-2 -mb-px transition-all",
                  tab === key ? "border-teal-500 text-teal-600" : "border-transparent text-gray-400 hover:text-gray-600",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* API error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
                {apiError}
              </div>
            )}

            {/* Identifier */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                {tab === "email" ? "Email" : "Số điện thoại"}
              </label>
              <div className={[
                "flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white transition-all",
                errors.identifier
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100",
              ].join(" ")}>
                {tab === "email" ? <Mail size={16} className="text-gray-400" /> : <Phone size={16} className="text-gray-400" />}
                <input
                  type={tab === "email" ? "email" : "tel"}
                  placeholder={tab === "email" ? "Nhập email của bạn" : "Nhập Số điện thoại của bạn"}
                  value={form.identifier}
                  onChange={set("identifier")}
                  className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.identifier && <p className="text-xs text-red-500">{errors.identifier}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
              <div className={[
                "flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white transition-all",
                errors.password
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100",
              ].join(" ")}>
                <Lock size={16} className="text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-teal-600">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-teal-500" />
                Ghi nhớ đăng nhập
              </label>
              <Link to={ROUTES.FORGOT_PW} className="text-sm font-semibold text-teal-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white font-bold text-base transition-all shadow-lg shadow-teal-100 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Đăng Nhập →
            </button>

            <p className="text-center text-sm text-gray-500">
              Bạn chưa có tài khoản?{" "}
              <Link to={ROUTES.REGISTER} className="text-teal-600 font-bold hover:underline">Đăng ký ngay</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

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