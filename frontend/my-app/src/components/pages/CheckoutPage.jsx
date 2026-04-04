import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const selectedSeats = location.state?.selectedSeats || [];
  const flightId = location.state?.flightId || "VN145";

  // Mock flight data
  const flightData = {
    flightNumber: flightId,
    departure: "HAN",
    arrival: "SGN",
    departTime: "08:00",
    arriveTime: "10:30",
    date: "2024-01-20",
    airline: "Vietnam Airlines",
    price: 2500000,
    duration: "2h 30m",
  };

  // Calculate seat price
  const seatPrice = selectedSeats.length * 100000; // 100k per seat
  const totalPrice = flightData.price + seatPrice;

  const handleContinue = () => {
    alert(`✅ Đặt vé thành công!\n\nChuyến bay: ${flightData.flightNumber}\nGhế: ${selectedSeats.join(", ")}\nTổng: ${totalPrice.toLocaleString()} VNĐ`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Thanh toán</h1>
          <p className="text-slate-500 mt-2">Kiểm tra thông tin và hoàn tất đặt vé</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booking Summary (Left) */}
          <div className="md:col-span-2 space-y-6">
            {/* Flight Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Thông tin chuyến bay</h2>
              
              <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-200">
                {/* Departure */}
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">
                    Khởi hành
                  </p>
                  <p className="text-3xl font-bold text-slate-900">{flightData.departTime}</p>
                  <p className="text-2xl font-bold text-slate-700 mt-2">{flightData.departure}</p>
                  <p className="text-sm text-slate-600 mt-1">{flightData.date}</p>
                </div>

                {/* Duration */}
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-4">
                    Thời gian bay
                  </p>
                  <div className="flex items-center gap-3 w-full mb-2">
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                    <span className="text-lg">✈️</span>
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{flightData.duration}</p>
                </div>

                {/* Arrival */}
                <div className="text-right">
                  <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">
                    Hạ cánh
                  </p>
                  <p className="text-3xl font-bold text-slate-900">{flightData.arriveTime}</p>
                  <p className="text-2xl font-bold text-slate-700 mt-2">{flightData.arrival}</p>
                </div>
              </div>

              {/* Flight Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                    Hãng hàng không
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">{flightData.airline}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                    Số hiệu chuyến bay
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">{flightData.flightNumber}</p>
                </div>
              </div>
            </div>

            {/* Seat Selection */}
            {selectedSeats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Ghế được chọn</h2>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {selectedSeats.sort().map((seat) => (
                    <div
                      key={seat}
                      className="px-4 py-2 bg-blue-100 border-2 border-blue-400 text-blue-700 font-bold rounded-lg"
                    >
                      {seat}
                    </div>
                  ))}
                </div>

                <p className="text-sm text-slate-600">
                  Tổng cộng: <span className="font-bold">{selectedSeats.length} ghế</span>
                </p>
              </div>
            )}

            {/* Passenger Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Thông tin hành khách</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Nhập email"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="phone"
                      placeholder="Nhập số điện thoại"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary (Right) */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white sticky top-8">
              <h2 className="text-xl font-bold mb-6">Chi tiết giá</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-blue-400">
                {/* Basic fare */}
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Giá vé cơ bản</span>
                  <span className="font-bold">{flightData.price.toLocaleString()} ₫</span>
                </div>

                {/* Seat fees */}
                {selectedSeats.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">
                      Phí ghế ({selectedSeats.length}x)
                    </span>
                    <span className="font-bold">{seatPrice.toLocaleString()} ₫</span>
                  </div>
                )}

                {/* Taxes */}
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Thuế & phí</span>
                  <span className="font-bold">150,000 ₫</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-8">
                <p className="text-blue-100 text-sm mb-2">TỔNG CỘNG</p>
                <p className="text-4xl font-bold">
                  {(totalPrice + 150000).toLocaleString()} ₫
                </p>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleContinue}
                className="w-full bg-white text-blue-700 font-bold py-3 px-4 rounded-lg hover:bg-blue-50 transition-all active:scale-95"
              >
                Xác nhận đặt vé
              </button>

              {/* Info */}
              <p className="text-xs text-blue-100 mt-4">
                💳 Hỗ trợ: Thẻ ATM, Thẻ credit, Ví điện tử
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex gap-3">
            <CheckCircle className="text-yellow-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Xác nhận đặt vé</h3>
              <p className="text-sm text-yellow-800">
                ✓ Giá hiển thị bao gồm thuế và phí<br/>
                ✓ Không có phí ẩn<br/>
                ✓ Bạn có thể thay đổi hoặc huỷ trong 24 giờ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
