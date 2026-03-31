// src/components/auth/ResetPasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import AuthSidePanel from "./AuthSidePanel";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/authService";

const SIDE_IMAGE = "src/assets/banner/b2.png";

// ─── Password strength logic ──────────────────────────────────────────────────
const RULES = [
  { key: "length",  label: "Tối thiểu 8 ký tự",     test: (p) => p.length >= 8 },
  { key: "number",  label: "Bao gồm chữ số",          test: (p) => /[0-9]/.test(p) },
  { key: "case",    label: "Chữ hoa và chữ thường",   test: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
  { key: "special", label: "Ký tự đặc biệt",          test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];

const STRENGTH_CONFIG = [
  { label: "",              color: "bg-gray-200",  text: "" },
  { label: "Quá ít chất xám", color: "bg-red-500",   text: "text-red-500" },
  { label: "Còn yếu",         color: "bg-orange-400", text: "text-orange-500" },
  { label: "Khá ổn",          color: "bg-yellow-400", text: "text-yellow-600" },
  { label: "Mạnh",            color: "bg-teal-400",   text: "text-teal-600" },
  { label: "Rất mạnh",        color: "bg-teal-600",   text: "text-teal-700" },
];

function getStrength(password) {
  if (!password) return 0;
  return RULES.filter((r) => r.test(password)).length + (password.length >= 12 ? 1 : 0);
}

function PasswordField({ label, placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className={[
        "flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white transition-all",
        error
          ? "border-red-400 bg-red-50"
          : "border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100",
      ].join(" ")}>
        <Lock size={16} className="text-gray-400 shrink-0" />
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        <button type="button" onClick={() => setShow(!show)} className="text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};

  const [form,    setForm]    = useState({ password: "", confirmPassword: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const strength     = getStrength(form.password);
  const strengthConf = STRENGTH_CONFIG[Math.min(strength, STRENGTH_CONFIG.length - 1)];
  const passedRules  = RULES.map((r) => ({ ...r, passed: r.test(form.password) }));

  const validate = () => {
    const e = {};
    if (!form.password)          e.password = "Vui lòng nhập mật khẩu mới";
    else if (strength < 3)       e.password = "Mật khẩu chưa đủ mạnh";
    if (!form.confirmPassword)   e.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Mật khẩu không khớp";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      await authService.resetPassword({ 
        email, 
        otp, 
        password: form.password 
      });
      navigate(ROUTES.LOGIN, { state: { resetSuccess: true } });
    } catch (err) {
      setErrors({ api: err?.response?.data?.message || "Đặt lại mật khẩu thất bại" });
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
            <h1 className="text-3xl font-black text-gray-900 mb-3">Đặt lại mật khẩu</h1>
            <p className="text-gray-400 text-sm">
              Vui lòng đặt lại mật khẩu đủ mạnh để bảo vệ tài khoản của bạn!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {errors.api && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
                {errors.api}
              </div>
            )}

            {/* Mật khẩu mới */}
            <div className="flex flex-col gap-2">
              <PasswordField
                label="Mật khẩu mới"
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
              />

              {/* Strength bar + checklist */}
              {form.password && (
                <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col gap-3">
                  {/* Header + label */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 tracking-wide">ĐỘ BẢO MẬT</span>
                    <span className={`text-xs font-semibold ${strengthConf.text}`}>{strengthConf.label}</span>
                  </div>

                  {/* Bar */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={[
                          "flex-1 h-1.5 rounded-full transition-all duration-300",
                          i <= strength ? strengthConf.color : "bg-gray-200",
                        ].join(" ")}
                      />
                    ))}
                  </div>

                  {/* Checklist 2 cột */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {passedRules.map((r) => (
                      <div key={r.key} className={`flex items-center gap-1.5 text-xs ${r.passed ? "text-teal-600" : "text-gray-400"}`}>
                        <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center shrink-0 transition-colors ${r.passed ? "border-teal-500 bg-teal-500" : "border-gray-300"}`}>
                          {r.passed && (
                            <svg viewBox="0 0 10 8" width="8" height="6" fill="none">
                              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Xác nhận */}
            <PasswordField
              label="Xác nhận mật khẩu mới"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              error={errors.confirmPassword}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white font-bold text-base transition-all shadow-lg shadow-teal-100 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Cập nhật mật khẩu
            </button>

            {/* Back */}
            <div className="flex justify-center">
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