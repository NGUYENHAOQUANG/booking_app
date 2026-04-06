import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  PlusCircle,
  ChevronDown,
  X,
  Ticket,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import bookingService from "../../services/bookingService";
import toast from "react-hot-toast";
import userService from "@/services/userService";

function splitName(fullName) {
  const name = (fullName || "").trim();
  if (!name) return { lastName: "", firstName: "" };
  const parts = name.split(/\s+/);
  if (parts.length === 1) return { lastName: parts[0], firstName: "" };
  return {
    lastName: parts[0],
    firstName: parts.slice(1).join(" "),
  };
}

const FlightPaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isGroupPayment, setIsGroupPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedSeats = [],
    flightId,
    flight: flightData,
  } = location.state || {};

  const departureCity = flightData?.origin?.city || "Ho Chi Minh City, VN";
  const arrivalCity = flightData?.destination?.city || "Da Lat, VN";
  const departureDate = flightData?.departureTime
    ? new Date(flightData.departureTime).toLocaleDateString("vi-VN")
    : "24/1/2025";
  const departureClock = flightData?.departureTime
    ? new Date(flightData.departureTime).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "8:00";
  const farePrice = flightData?.fareClasses?.[0]?.basePrice || 500000;
  const subtotal = farePrice * selectedSeats.length;
  const serviceFee = 100000;
  const total = subtotal + serviceFee;

  // Form states
  const [contactInfo, setContactInfo] = useState({
    lastName: "Nguyễn",
    firstName: "Văn A",
    phone: "0987654321",
    email: "customer@gmail.com",
  });

  const [passenger, setPassenger] = useState({
    salutation: "Mr",
    lastName: "Nguyễn",
    firstName: "Văn A",
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const profileRes = await userService.getProfile();
        const profile = profileRes?.data || {};
        const { lastName, firstName } = splitName(profile.fullName);
        if (!mounted) return;

        setContactInfo((current) => ({
          ...current,
          lastName: lastName || current.lastName,
          firstName: firstName || current.firstName,
          phone: profile.phoneNumber || current.phone,
          email: profile.email || current.email,
        }));

        setPassenger((current) => ({
          ...current,
          lastName: lastName || current.lastName,
          firstName: firstName || current.firstName,
        }));
      } catch {
        // Keep manual defaults if profile fetch fails.
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handlePayment = async () => {
    if (!flightId) {
      toast.error(
        "Không tìm thấy thông tin chuyến bay! Vui lòng chọn lại chuyến bay.",
      );
      return;
    }

    if (!selectedSeats.length) {
      toast.error("Vui lòng chọn ít nhất 1 ghế trước khi thanh toán.");
      navigate(-1);
      return;
    }

    if (flightId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(flightId)) {
      toast.error(
        "Đang dùng dữ liệu mẫu (Flight ID không hợp lệ). Vui lòng ra Trang chủ tìm kiếm và chọn chuyến bay thật để test!",
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        tripType: "one_way",
        contactInfo: {
          fullName: `${contactInfo.lastName} ${contactInfo.firstName}`,
          email: contactInfo.email,
          phone: contactInfo.phone,
        },
        outboundFlight: {
          flight: flightId,
          fareClass: "ECO", // Default for now
          farePrice,
        },
        passengers: selectedSeats.map((seat) => ({
          type: "adult",
          salutation: passenger.salutation,
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          seatOutbound: seat,
        })),
        pricing: {
          subtotal,
          taxes: 100000,
          serviceFee,
          total,
          currency: "VND",
        },
        payment: {
          method: paymentMethod === "momo" ? "e_wallet" : "counter",
          status: "pending",
        },
      };

      const response = await bookingService.createBooking(payload);
      const createdBooking = response?.data;

      if (!createdBooking?._id) {
        throw new Error("Không tạo được đặt vé mới");
      }

      let bookingDetail = createdBooking;
      try {
        const detailRes = await bookingService.getBookingById(createdBooking._id);
        bookingDetail = detailRes?.data || createdBooking;
      } catch {
        bookingDetail = createdBooking;
      }

      toast.success("Đặt vé cực mượt! Giao dịch đang chờ thanh toán.");
      navigate("/booking-confirmation", {
        state: {
          booking: bookingDetail,
          selectedSeats: bookingDetail?.passengers?.map((p) => p.seatOutbound).filter(Boolean) || selectedSeats,
          flightInfo: flightData,
        },
      });
    } catch (error) {
      console.error("Lỗi đặt vé:", error);
      const message = error.response?.data?.message || "Có lỗi xảy ra khi tạo mã đặt chỗ.";
      toast.error(message);
      navigate("/booking-failure", {
        state: {
          customer: {
            customerName: `${contactInfo.lastName} ${contactInfo.firstName}`.trim(),
            phone: contactInfo.phone,
            email: contactInfo.email,
          },
          selectedSeats,
          flightInfo: flightData,
          errorMessage: message,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-700 font-sans antialiased bg-white">
      {/* --- Stepper Header --- */}
      <div className="bg-white rounded-[2rem] border border-teal-100 p-8 space-y-6">
        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Thông tin thanh toán
          </h1>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            3 trong 4 lựa chọn
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-teal-500 rounded-full w-3/4"></div>
        </div>
        <div className="flex justify-between px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span>Chọn</span>
          <span className="text-teal-600">Chỗ ngồi</span>
          <span className="text-teal-600">Thông tin</span>
          <span>Thanh toán</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- Main Content --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thông tin liên hệ */}
          <section className="bg-white rounded-[2rem] border border-teal-100 p-8 space-y-8">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">
              Thông tin liên hệ (nhận vé/ phiếu thanh toán)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">
                  Họ<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactInfo.lastName}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, lastName: e.target.value })
                  }
                  placeholder="VD: Nguyễn"
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500 transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">
                  Tên đệm và tên<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactInfo.firstName}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="VD: Văn A"
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500 transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">
                  Điện thoại di động<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, phone: e.target.value })
                  }
                  placeholder="VD: 0123456789"
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500 transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, email: e.target.value })
                  }
                  placeholder="VD: example@gmail.com"
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </section>

          {/* Thông tin khách hàng */}
          <section className="bg-white rounded-[2rem] border border-teal-100 overflow-hidden shadow-sm">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">
                  Thông tin khách hàng
                </h2>
                <button className="px-4 py-2 bg-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-teal-600 transition-all">
                  Thêm hành khách
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3 text-yellow-800">
                <AlertCircle
                  size={20}
                  className="shrink-0 mt-0.5 text-yellow-600"
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold">
                    Vui lòng chú ý các điều sau:
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Nhập tên đúng như trên hộ chiếu. Sai chính tả hoặc sắp xếp
                    tên sai có thể khiến bạn bị từ chối lên máy bay hoặc phải
                    trả phí đổi tên
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-teal-50 px-4 py-2 rounded-lg text-xs font-bold text-slate-800 inline-block uppercase">
                  Người lớn 1
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">
                      Danh xưng<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={passenger.salutation}
                        onChange={(e) =>
                          setPassenger({
                            ...passenger,
                            salutation: e.target.value,
                          })
                        }
                        className="w-full h-11 px-4 appearance-none border border-slate-100 rounded-xl bg-slate-50/50 outline-none focus:border-teal-500 font-medium text-slate-400 text-sm"
                      >
                        <option value="Mr">Ông (Mr)</option>
                        <option value="Ms">Bà (Ms)</option>
                        <option value="Mrs">Cô (Mrs)</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4"></div>{" "}
                  {/* Spacer to match mockup column layout */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">
                      Họ<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) =>
                        setPassenger({ ...passenger, lastName: e.target.value })
                      }
                      placeholder="Nguyễn"
                      className="w-full h-11 px-4 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">
                      Tên đệm và Tên<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) =>
                        setPassenger({
                          ...passenger,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="Văn A"
                      className="w-full h-11 px-4 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">
                      Ngày sinh<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="dd/mm/YYYY"
                        className="w-full h-11 px-10 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 text-sm"
                      />
                      <Calendar
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">
                        Số điện thoại<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="0123456789"
                        className="w-full h-11 px-4 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">
                        Quốc gia<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Việt Nam"
                        className="w-full h-11 px-4 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 py-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-teal-500 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-teal-500 scale-100"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Sử dụng CCCD
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-teal-500 transition-colors"></div>
                    <span className="text-xs font-bold text-slate-800">
                      Sử dụng hộ chiếu
                    </span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400">
                    Số CCCD<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0123456789"
                    className="w-full h-11 px-4 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">
                      Ngày cấp<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="dd/mm/YYYY"
                        className="w-full h-11 px-10 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 text-sm"
                      />
                      <Calendar
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">
                      Nơi cấp<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="CA tỉnh Hòa Thành"
                      className="w-full h-11 px-4 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-teal-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- Sidebar (Hình 1) --- */}
        <aside className="lg:col-span-1 space-y-8 sticky top-10">
          <div className="bg-white rounded-[2rem] border border-teal-100 overflow-hidden shadow-sm">
            <div className="px-8 pt-8 pb-4">
              <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-6">
                Lựa chọn của bạn
              </h3>
              <div className="space-y-6 relative ml-1">
                <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-slate-100 border-l border-dashed border-slate-200"></div>
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-3 h-3 rounded-full bg-teal-500 border-2 border-white shadow-sm mt-0.5"></div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Từ
                    </p>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                      {departureCity}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center border-2 border-white shadow-sm -ml-0.5">
                    <MapPin size={8} className="text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Tới
                    </p>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                      {arrivalCity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-3 p-1 bg-teal-50/30 rounded-xl border border-teal-100/50">
                <div className="flex items-center justify-center gap-2 py-3 bg-white rounded-lg shadow-sm">
                  <Calendar size={14} className="text-teal-600" />
                  <span className="text-[11px] font-black italic">
                    {departureDate}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 bg-white rounded-lg shadow-sm">
                  <Clock size={18} className="text-slate-200/50" />
                  <span className="text-[11px] font-black italic">
                    {departureClock}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  SEATS
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full border border-teal-100 text-[10px] font-black uppercase shadow-sm"
                    >
                      {s} <X size={10} className="text-teal-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Mã giảm giá
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                    </div>
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá của bạn"
                      className="w-full h-10 pl-9 pr-2 bg-white border border-slate-100 rounded-lg outline-none text-[10px] font-medium placeholder:text-slate-200"
                    />
                  </div>
                  <button className="px-5 bg-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-tight">
                    Nhận
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-50">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Tổng phụ ({selectedSeats.length} chỗ ngồi)</span>
                  <span className="text-slate-800">{new Intl.NumberFormat("vi-VN").format(subtotal)} VND</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Phí dịch vụ</span>
                  <span className="text-slate-800">{new Intl.NumberFormat("vi-VN").format(serviceFee)}VND</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-lg font-black text-teal-600 uppercase italic">
                    Tổng chi phí
                  </span>
                  <span className="text-2xl font-black text-teal-600">
                    {new Intl.NumberFormat("vi-VN").format(total)}VND
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800 tracking-tight">
                    Chia nhỏ theo nhóm
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                    Chỉ cần thanh toán phần của bạn ngay
                  </p>
                </div>
                <button
                  onClick={() => setIsGroupPayment(!isGroupPayment)}
                  className={`w-11 h-6 rounded-full relative transition-all ${isGroupPayment ? "bg-teal-500" : "bg-teal-600"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isGroupPayment ? "left-6" : "left-6"}`}
                  ></div>
                </button>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => setPaymentMethod("momo")}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${paymentMethod === "momo" ? "border-slate-800 ring-1 ring-slate-800" : "border-slate-200"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "momo" ? "border-slate-800 border-4" : "border-slate-300"}`}
                  ></div>
                  <span className="text-xs font-bold text-slate-800">
                    Thanh toán qua MOMO
                  </span>
                </button>
                <button
                  onClick={() => setPaymentMethod("counter")}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${paymentMethod === "counter" ? "border-slate-800 ring-1 ring-slate-800" : "border-slate-200"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "counter" ? "border-slate-800 border-4" : "border-slate-300"}`}
                  ></div>
                  <span className="text-xs font-bold text-slate-800">
                    Thanh toán tại quầy
                  </span>
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full flex items-center justify-center h-12 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang xử lý..." : "Thanh toán"}
                </button>
                <p
                  onClick={() => navigate(-1)}
                  className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest cursor-pointer hover:text-slate-600"
                >
                  Quay lại
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FlightPaymentPage;
