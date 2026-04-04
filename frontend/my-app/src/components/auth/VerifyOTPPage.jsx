// src/components/auth/VerifyOTPPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthSidePanel from "./AuthSidePanel";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/authService";

const SIDE_IMAGE   = "src/assets/banner/b5.png";
const OTP_LENGTH   = 6;
const RESEND_DELAY = 59; // giây

export default function VerifyOTPPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email    = location.state?.email || "email@example.com";

  const [otp,       setOtp]       = useState(Array(OTP_LENGTH).fill(""));
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Focus ô đầu tiên khi mount
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index, value) => {
    // Chỉ nhận số, 1 ký tự
    const digit = value.replace(/\D/g, "").slice(-1);
    const next  = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");

    // Auto focus ô tiếp theo
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Xoá ký tự hiện tại
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        // Focus ô trước nếu ô hiện tại trống
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste toàn bộ mã
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) return setError("Vui lòng nhập đủ 6 chữ số");
    setLoading(true);
    setError("");
    try {
      await authService.verifyOTP({ email, otp: code });
      // Chuyển sang trang đặt lại mật khẩu, truyền email + otp đã xác minh
      navigate(ROUTES.RESET_PW, { state: { email, otp: code } });
    } catch (err) {
      setError(err?.response?.data?.message || "Mã xác minh không đúng hoặc đã hết hạn");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    try {
      await authService.forgotPassword(email);
      setCountdown(RESEND_DELAY);
      setOtp(Array(OTP_LENGTH).fill(""));
      setError("");
      inputRefs.current[0]?.focus();
    } catch {
      setError("Gửi lại mã thất bại, vui lòng thử lại");
    } finally {
      setResending(false);
    }
  }, [countdown, resending, email]);

  return (
    <div className="min-h-screen flex">
      <AuthSidePanel image={SIDE_IMAGE} />

      <div className="flex-1 flex items-center justify-center bg-white px-8 py-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-3">Mã xác minh</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Chúng tôi đã gửi mã xác minh đến địa chỉ email của bạn:{" "}
              <span className="text-teal-600 font-semibold">{email}</span>
              <br />
              Vui lòng kiểm tra hòm thư của bạn (bao gồm mục thư rác)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            {/* OTP inputs */}
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={[
                    "w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all",
                    error
                      ? "border-red-400 bg-red-50 text-red-600"
                      : digit
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-gray-200 bg-white text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100",
                  ].join(" ")}
                />
              ))}
            </div>

            {error && <p className="text-center text-xs text-red-500 -mt-3">{error}</p>}

            {/* Resend row */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Bạn chưa nhận được mã?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                className="font-semibold text-teal-600 disabled:text-gray-400 hover:underline disabled:no-underline transition-colors"
              >
                {resending
                  ? "Đang gửi..."
                  : countdown > 0
                    ? `Gửi lại (0:${String(countdown).padStart(2, "0")})`
                    : "Gửi lại"}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || otp.join("").length < OTP_LENGTH}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white font-bold text-base transition-all shadow-lg shadow-teal-100 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              Xác nhận và tiếp tục
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