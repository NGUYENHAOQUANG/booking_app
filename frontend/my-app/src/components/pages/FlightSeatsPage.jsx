import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SeatMap from "../flights/SeatMap";

const FlightSeatsPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Mock flight data
  const flightData = {
    flightNumber: "VN145",
    departure: "HAN",
    arrival: "SGN",
    departTime: "08:00",
    arriveTime: "10:30",
    date: "2024-01-20",
    airline: "Vietnam Airlines",
  };

  const handleSeatsChange = (seats) => {
    setSelectedSeats(seats);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }
    // Proceed to checkout
    navigate("/checkout", { state: { selectedSeats, flightId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>

          {/* Flight Info Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Chuyến bay
              </p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {flightData.flightNumber}
              </p>
              <p className="text-sm text-slate-600">{flightData.airline}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Tuyến đường
              </p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {flightData.departure} → {flightData.arrival}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Thời gian
              </p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {flightData.departTime} - {flightData.arriveTime}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Ngày bay
              </p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {flightData.date}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Seat Map */}
        <SeatMap
          flightId={flightData.flightNumber}
          selectedSeats={selectedSeats}
          onSeatsChange={handleSeatsChange}
        />

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95"
          >
            Huỷ
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className={`px-12 py-4 font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              selectedSeats.length === 0
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg"
            }`}
          >
            Tiếp tục
            {selectedSeats.length > 0 && (
              <span className="text-sm opacity-90">
                ({selectedSeats.length} ghế)
              </span>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h3 className="font-bold text-yellow-900 mb-2">💡 Gợi ý</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>
              • Ghế trống (xanh) là những ghế bạn có thể chọn
            </li>
            <li>
              • Ghế đã bán (xám) là những ghế không có sẵn
            </li>
            <li>
              • Bạn có thể chọn nhiều ghế một lúc
            </li>
            <li>
              • Nhấn vào ghế để thêm hoặc bỏ khỏi danh sách
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FlightSeatsPage;
