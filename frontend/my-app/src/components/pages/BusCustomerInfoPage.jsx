import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bus,
  Calendar,
  Check,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import busService from "@/services/busService";
import userService from "@/services/userService";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

const DEFAULT_TRIP = {
  route: "Hồ Chí Minh → Đà Lạt",
  service: "Xe Phương Trang",
  departureDate: "24/8/2025",
  departureTime: "08:00 AM",
  selectedSeats: ["1C", "3C"],
};

function money(value) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function splitFullName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return { lastName: "", firstName: "" };
  }
  if (parts.length === 1) {
    return { lastName: parts[0], firstName: "" };
  }
  return {
    lastName: parts[0],
    firstName: parts.slice(1).join(" "),
  };
}

function formatBirthDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function Field({ label, value, onChange, placeholder = "", className = "", error = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition-all ${error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-teal-500"}`}
      />
      {error ? <p className="text-xs font-semibold text-red-500">{error}</p> : null}
    </div>
  );
}

function SeatRow({ seatId, passenger }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-sm font-black text-teal-600 ring-1 ring-teal-100">
          {seatId}
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">{passenger}</p>
          <p className="text-[10px] font-medium text-slate-400">Ghế tiêu chuẩn</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-slate-900">100.000 đ</span>
        <button type="button" className="text-slate-200 transition-colors hover:text-red-500">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function BusCustomerInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const busTrip = location.state?.busTrip || DEFAULT_TRIP;
  const tripId = location.state?.tripId;
  const incomingFarePrice = Number(location.state?.farePrice || 0);
  const selectedSeats = location.state?.selectedSeats?.length
    ? location.state.selectedSeats
    : busTrip.selectedSeats;

  const [usePassport, setUsePassport] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isGroupPayment, setIsGroupPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    lastName: "Nguyễn",
    firstName: "Văn A",
    birthDate: "",
    phone: "0123456789",
    email: "",
    country: "Việt Nam",
    idNumber: "0123456789",
    issueDate: "",
    issuePlace: "CA tỉnh Hoà Thành",
    promoCode: "",
  });

  const applyProfileToForm = (profile) => {
    if (!profile) return;
    const name = splitFullName(profile.fullName);
    const birthDate = formatBirthDate(profile.birthDate);

    setForm((current) => ({
      ...current,
      lastName: name.lastName || current.lastName,
      firstName: name.firstName || current.firstName,
      birthDate: birthDate || current.birthDate,
      phone: profile.phoneNumber || current.phone,
      email: profile.email || current.email,
      country: profile.city || current.country,
    }));
  };

  useEffect(() => {
    applyProfileToForm(user);
  }, [user]);

  const seatPrice = incomingFarePrice > 0 ? incomingFarePrice : 100000;
  const subtotal = Number(location.state?.pricing?.subtotal ?? seatPrice * selectedSeats.length);
  const serviceFee = Number(location.state?.pricing?.serviceFee ?? 10000);
  const total = Number(location.state?.pricing?.total ?? subtotal + serviceFee);

  const validateForm = () => {
    const nextErrors = {};
    const requiredFields = [
      ["lastName", "Vui lòng nhập họ"],
      ["firstName", "Vui lòng nhập tên đệm và tên"],
      ["birthDate", "Vui lòng nhập ngày sinh"],
      ["phone", "Vui lòng nhập số điện thoại"],
      ["email", "Vui lòng nhập email"],
      ["country", "Vui lòng nhập quốc gia"],
      ["idNumber", `Vui lòng nhập ${usePassport ? "số hộ chiếu" : "số CCCD"}`],
      ["issueDate", "Vui lòng nhập ngày cấp"],
      ["issuePlace", "Vui lòng nhập nơi cấp"],
    ];

    requiredFields.forEach(([field, message]) => {
      if (!String(form[field] || "").trim()) {
        nextErrors[field] = message;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await userService.getProfile();
        const profile = response?.data;
        if (!profile) {
          return;
        }

        applyProfileToForm(profile);
      } catch {
        // Not logged in or profile unavailable: keep existing form defaults.
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const seatItems = useMemo(
    () => selectedSeats.map((seatId, index) => ({ seatId, passenger: `Hành khách ${index + 1}` })),
    [selectedSeats],
  );

  const handleCheckout = async () => {
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc trước khi tiếp tục");
      return;
    }

    if (!tripId) {
      toast.error("Thiếu dữ liệu chuyến đi. Vui lòng quay lại bước chọn chuyến.");
      navigate(ROUTES.BOOKING_FAILURE);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        tripId,
        contactInfo: {
          fullName: `${form.lastName} ${form.firstName}`,
          email: form.email,
          phone: form.phone,
        },
        passengers: selectedSeats.map((seatNumber) => ({
          fullName: `${form.lastName} ${form.firstName}`,
          seatNumber,
          idNumber: form.idNumber,
        })),
        pricing: {
          subtotal,
          serviceFee,
          discount: 0,
          total,
          currency: "VND",
        },
        payment: {
          method: paymentMethod,
        },
      };

      const created = await busService.createBusBooking(payload);
      const booking = created?.data;

      if (!booking?._id) {
        throw new Error("Không nhận được mã booking từ hệ thống");
      }

      // Demo success flow: gọi xác nhận thanh toán ngay để lấy dữ liệu giao dịch thật.
      const transactionId = `TX-${Date.now()}`;
      const paidResult = await busService.confirmBusPayment(booking._id, {
        transactionId,
        method: payload.payment.method,
      });

      const confirmedBooking = paidResult?.data || booking;
      toast.success("Thanh toán thành công");
      navigate(ROUTES.BOOKING_CONFIRMATION, {
        state: {
          busBooking: confirmedBooking,
          busTrip,
          selectedSeats,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Thanh toán thất bại");
      navigate(ROUTES.BOOKING_FAILURE, {
        state: {
          busBooking: error?.response?.data?.data,
          busTrip,
          selectedSeats,
          customer: {
            customerName: `${form.lastName} ${form.firstName}`,
            email: form.email,
            phone: form.phone,
          },
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efefef] pb-10 text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 px-2 sm:px-0">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-4 gap-4 text-center text-sm font-medium text-teal-600">
              {[
                [1, "Tìm kiếm", true],
                [2, "Chọn ghế ngồi", true],
                [3, "Bổ sung", true],
                [4, "Thanh toán", false],
              ].map(([step, label, active]) => (
                <div key={label} className="space-y-3">
                  <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${active ? "border-teal-500 bg-teal-500 text-white" : "border-slate-200 bg-white text-slate-500"}`}>
                    {active ? <Check size={14} /> : step}
                  </div>
                  <p className={active ? "text-teal-600" : "text-slate-400"}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-5xl font-black tracking-tight text-slate-950">Thông tin thanh toán</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-2"><Bus size={15} /> {busTrip.service || "VivaVivu"}</span>
                <span>•</span>
                <span>{busTrip.departureDate}</span>
                <span>•</span>
                <span>{busTrip.departureTime}</span>
              </div>
            </div>

            <section className="rounded-[26px] border border-teal-300 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <h3 className="mb-6 text-3xl font-black tracking-tight text-slate-900">Thông tin khách hàng</h3>
              {profileLoading && (
                <p className="mb-4 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                  Đang tải thông tin thật của người dùng từ API...
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Họ"
                  value={form.lastName}
                  placeholder="Nguyễn"
                  onChange={(value) => {
                    setForm({ ...form, lastName: value });
                    if (errors.lastName) {
                      setErrors((current) => ({ ...current, lastName: "" }));
                    }
                  }}
                  error={errors.lastName}
                />
                <Field
                  label="Tên đệm và Tên"
                  value={form.firstName}
                  placeholder="Văn A"
                  onChange={(value) => {
                    setForm({ ...form, firstName: value });
                    if (errors.firstName) {
                      setErrors((current) => ({ ...current, firstName: "" }));
                    }
                  }}
                  error={errors.firstName}
                />
                <Field
                  label="Ngày sinh"
                  value={form.birthDate}
                  placeholder="dd/mm/YYYY"
                  onChange={(value) => {
                    setForm({ ...form, birthDate: value });
                    if (errors.birthDate) {
                      setErrors((current) => ({ ...current, birthDate: "" }));
                    }
                  }}
                  error={errors.birthDate}
                />
                <Field
                  label="Số điện thoại"
                  value={form.phone}
                  placeholder="0123456789"
                  onChange={(value) => {
                    setForm({ ...form, phone: value });
                    if (errors.phone) {
                      setErrors((current) => ({ ...current, phone: "" }));
                    }
                  }}
                  error={errors.phone}
                />
                <Field
                  label="Email"
                  value={form.email}
                  placeholder="email@example.com"
                  onChange={(value) => {
                    setForm({ ...form, email: value });
                    if (errors.email) {
                      setErrors((current) => ({ ...current, email: "" }));
                    }
                  }}
                  error={errors.email}
                />
                <Field
                  label="Quốc gia"
                  value={form.country}
                  placeholder="Việt Nam"
                  onChange={(value) => {
                    setForm({ ...form, country: value });
                    if (errors.country) {
                      setErrors((current) => ({ ...current, country: "" }));
                    }
                  }}
                  error={errors.country}
                  className="md:col-span-2"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-8 border-y border-slate-100 py-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="radio"
                    checked={!usePassport}
                    onChange={() => setUsePassport(false)}
                    className="accent-teal-600"
                  />
                  Sử dụng CCCD
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="radio"
                    checked={usePassport}
                    onChange={() => setUsePassport(true)}
                    className="accent-teal-600"
                  />
                  Sử dụng hộ chiếu
                </label>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label={usePassport ? "Số hộ chiếu" : "Số CCCD"}
                  value={form.idNumber}
                  placeholder="0123456789"
                  onChange={(value) => {
                    setForm({ ...form, idNumber: value });
                    if (errors.idNumber) {
                      setErrors((current) => ({ ...current, idNumber: "" }));
                    }
                  }}
                  error={errors.idNumber}
                  className="md:col-span-2"
                />
                <Field
                  label="Ngày cấp"
                  value={form.issueDate}
                  placeholder="dd/mm/YYYY"
                  onChange={(value) => {
                    setForm({ ...form, issueDate: value });
                    if (errors.issueDate) {
                      setErrors((current) => ({ ...current, issueDate: "" }));
                    }
                  }}
                  error={errors.issueDate}
                />
                <Field
                  label="Nơi cấp"
                  value={form.issuePlace}
                  placeholder="CA tỉnh Hoà Thành"
                  onChange={(value) => {
                    setForm({ ...form, issuePlace: value });
                    if (errors.issuePlace) {
                      setErrors((current) => ({ ...current, issuePlace: "" }));
                    }
                  }}
                  error={errors.issuePlace}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_16px_42px_rgba(15,23,42,0.12)]">
              <div className="bg-slate-100 px-5 py-4">
                <h3 className="text-4xl font-black tracking-tight text-slate-950">Tóm tắt đặt chỗ</h3>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex gap-3 rounded-2xl border-b border-slate-200 pb-4">
                  <img src="https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&q=80&w=500" alt="Bus trip" className="h-16 w-20 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900">{busTrip.route}</p>
                    <p className="mt-1 text-xs text-slate-500">{busTrip.departureDate} • {busTrip.departureTime}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-teal-600">
                      <Star size={12} fill="currentColor" /> 4.8 <span className="text-slate-400">(2.4k đánh giá)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Các ghế đã chọn</p>
                  <div className="space-y-3">
                    {seatItems.map((seat) => (
                      <SeatRow key={seat.seatId} seatId={seat.seatId} passenger={seat.passenger} />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4 text-[11px] leading-relaxed text-teal-700">
                  Ghế 1C và 3C nằm ở phía lối đi. Rất thoải mái để chân.
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-sm font-black text-slate-950">Chia tiền theo nhóm</p>
                    <p className="text-[11px] text-slate-400">Chia sẻ chi phí với bạn bè</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGroupPayment((current) => !current)}
                    className={`relative h-6 w-12 rounded-full transition-colors ${isGroupPayment ? "bg-teal-500" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${isGroupPayment ? "left-7" : "left-1"}`} />
                  </button>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={form.promoCode}
                        onChange={(event) => setForm({ ...form, promoCode: event.target.value })}
                        placeholder="Nhập mã giảm giá của bạn"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-xs font-semibold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-teal-500/5"
                      />
                      <Ticket size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                    <button type="button" className="rounded-xl bg-teal-500 px-4 text-xs font-black text-white transition-colors hover:bg-teal-600">
                      Nhận
                    </button>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Tạm Tính</span>
                    <span className="text-slate-900">{money(subtotal)} đ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Thuế & Phí</span>
                    <span className="text-slate-900">{money(serviceFee)} đ</span>
                  </div>
                  <div className="flex items-end justify-between border-t border-dashed border-slate-200 pt-4">
                    <span className="text-lg font-black text-slate-950">Tổng cộng</span>
                    <span className="text-2xl font-black tracking-tight text-slate-950">{money(total)} đ</span>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-teal-300 p-3">
                  {[
                    { id: "momo", label: "Thanh toán qua MOMO" },
                    { id: "counter", label: "Thanh toán tại quầy" },
                  ].map((method) => (
                    <label key={method.id} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-teal-600"
                      />
                      {method.label}
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleCheckout}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-[0_16px_28px_rgba(13,148,136,0.28)] transition-colors ${submitting ? "cursor-not-allowed bg-slate-400" : "bg-teal-600 hover:bg-teal-700"}`}
                >
                  {submitting ? "Đang xử lý thanh toán..." : "Thanh toán"}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck size={14} className="text-teal-600" /> Thanh toán được đảm bảo bởi VivaVivu
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-orange-200 bg-orange-50 p-5 text-center shadow-[0_10px_24px_rgba(249,115,22,0.14)]">
              <p className="text-sm font-black italic text-orange-500">Tiết kiệm 10% cho chuyến đi tiếp theo</p>
              <p className="mt-1 text-xs text-orange-700">Hoàn tất đặt chỗ để mở khoá ưu đãi.</p>
            </div>

            <Link to={ROUTES.BUS_SEATS} className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400 transition-colors hover:text-teal-600">
              <ArrowLeft size={14} /> Quay lại chọn ghế
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}