import {
  ArrowRight,
  CheckCircle2,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const BookingConfirmationPage = () => {
  const ticket = {
    code: "SGDL001",
    date: "30/1/2026",
    customerName: "Nguyễn Văn A",
    phone: "0987625321",
    email: "customer23@gmail.com",
    service: "Xe Phương Trang",
    seat: "Giường nằm - Giường nằm 41 chỗ ngồi",
    departTime: "22:36",
    departPlace: "Văn phòng quận 1",
    arriveTime: "5:30",
    arrivePlace: "VP Đà Lạt - Bùi Thị Xuân",
    duration: "5 giờ 6 phút",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <section className="rounded-4xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-slate-900 px-8 py-6 text-center sm:px-14 sm:py-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <CheckCircle2 size={16} /> Thành công
            </div>
            <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Cảm ơn vì đã đặt vé trên{" "}
              <span className="text-emerald-300">VivaVivu</span>
            </h1>
          </div>

          <div className="px-6 pb-10 pt-8 sm:px-12">
            <div className="mx-auto max-w-4xl rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-12">
              <h2 className="text-3xl font-black text-slate-900 text-center">
                Thông tin vé
              </h2>

              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
                <div className="space-y-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Mã vé
                      </p>
                      <p className="mt-3 text-lg font-semibold text-slate-900">
                        {ticket.code}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Ngày đặt vé
                      </p>
                      <p className="mt-3 text-lg font-semibold text-slate-900">
                        {ticket.date}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Thông tin khách hàng
                    </p>
                    <div className="mt-6 space-y-4 text-slate-700">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <span className="font-medium">Tên khách hàng:</span>
                        <span className="font-semibold text-slate-900">
                          {ticket.customerName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <span className="font-medium">Số điện thoại:</span>
                        <span className="font-semibold text-slate-900">
                          {ticket.phone}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <span className="font-medium">Email:</span>
                        <span className="font-semibold text-slate-900">
                          {ticket.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="rounded-[1.75rem] border border-teal-100 bg-teal-50 p-6 text-slate-900">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
                        {ticket.service}
                      </p>
                      <p className="text-base text-slate-700">{ticket.seat}</p>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          Khởi hành
                        </p>
                        <p className="mt-3 text-2xl font-black text-slate-900">
                          {ticket.departTime}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {ticket.departPlace}
                        </p>
                      </div>
                      <div className="border-t border-slate-200 pt-4 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          Đến nơi
                        </p>
                        <p className="mt-3 text-2xl font-black text-slate-900">
                          {ticket.arriveTime}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {ticket.arrivePlace}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        {ticket.duration}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        Vé tiện lợi <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="grid gap-6 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              VivaVivu
            </h3>
            <p className="text-sm text-slate-500">
              Mang đến trải nghiệm đặt vé nhanh gọn và an toàn.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Công ty
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Về chúng tôi</li>
              <li>Tuyển dụng</li>
              <li>Thông báo</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Trung tâm hỗ trợ</li>
              <li>Thông tin an toàn</li>
              <li>Chính sách</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Bản tin
            </h4>
            <p className="text-sm text-slate-500">
              Đăng ký để nhận ưu đãi độc quyền và thông tin cập nhật.
            </p>
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-3">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                placeholder="Tài khoản email của bạn"
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
            <button className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition">
              Đăng ký
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
