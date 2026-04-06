const SeatMap = ({ flightId = "VN145", selectedSeats = [], onSeatsChange = () => {} }) => {
  const ROWS = 6; // A-F
  const COLS = 6; // 1-6
  const rowLabels = ["A", "B", "C", "D", "E", "F"];

  // Mock occupied seats (some seats are occupied)
  const occupiedSeats = ["A2", "A5", "B1", "B4", "C3", "D2", "E1", "E5", "F3", "F6"];

  const getSeatStatus = (seatId) => {
    if (selectedSeats.includes(seatId)) return "selected";
    if (occupiedSeats.includes(seatId)) return "occupied";
    return "available";
  };

  const toggleSeat = (seatId) => {
    const currentStatus = getSeatStatus(seatId);
    
    // Cannot select occupied seats
    if (currentStatus === "occupied") return;

    let newSeats;
    if (currentStatus === "selected") {
      // Deselect
      newSeats = selectedSeats.filter((seat) => seat !== seatId);
    } else {
      // Select (allow multiple selections)
      newSeats = [...selectedSeats, seatId];
    }
    
    onSeatsChange(newSeats);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Chọn vị trí ghế ngồi
        </h2>
        <p className="text-slate-500">
          Chuyến bay {flightId} • Hãy lựa chọn ghế yêu thích của bạn
        </p>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap gap-8 mb-12 pb-8 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 border-2 border-green-500 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-bold text-xs">1</span>
          </div>
          <span className="text-sm text-slate-600 font-medium">Ghế trống</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 border-2 border-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xs">✓</span>
          </div>
          <span className="text-sm text-slate-600 font-medium">Ghế được chọn</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 font-bold text-xs">✕</span>
          </div>
          <span className="text-sm text-slate-600 font-medium">Ghế đã bán</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="flex justify-center">
        <div className="inline-block">
          {/* Column numbers header */}
          <div className="flex gap-2 mb-4 ml-16">
            {Array.from({ length: COLS }).map((_, col) => (
              <div
                key={col}
                className="w-12 h-10 flex items-center justify-center text-sm font-bold text-slate-500"
              >
                {col + 1}
              </div>
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: ROWS }).map((_, row) => (
            <div key={row} className="flex gap-2 mb-3">
              {/* Row label */}
              <div className="w-12 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700">
                  {rowLabels[row]}
                </span>
              </div>

              {/* Seats in row */}
              <div className="flex gap-2">
                {Array.from({ length: COLS }).map((_, col) => {
                  const seatId = `${rowLabels[row]}${col + 1}`;
                  const status = getSeatStatus(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      disabled={status === "occupied"}
                      className={`w-12 h-12 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center justify-center border-2 ${
                        status === "available"
                          ? "bg-green-50 border-green-400 text-green-600 hover:bg-green-100 cursor-pointer"
                          : status === "selected"
                          ? "bg-blue-500 border-blue-600 text-white cursor-pointer hover:bg-blue-600"
                          : "bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                      }`}
                      title={
                        status === "occupied"
                          ? "Ghế này đã được bán"
                          : `${seatId}`
                      }
                    >
                      {status === "selected" ? (
                        <span>✓</span>
                      ) : status === "occupied" ? (
                        <span>✕</span>
                      ) : (
                        <span className="text-xs">{col + 1}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Cabin divider - optional visual */}
          <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-300 flex gap-2">
            <div className="w-12"></div>
            <div className="flex gap-2">
              {Array.from({ length: COLS }).map((_, col) => (
                <div
                  key={col}
                  className="w-12 h-8 flex items-center justify-center text-xs text-slate-400"
                >
                  🚪
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-bold text-slate-900 mb-3">
              Ghế được chọn ({selectedSeats.length})
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSeats.sort().map((seat) => (
                <div
                  key={seat}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2"
                >
                  {seat}
                  <button
                    onClick={() => toggleSeat(seat)}
                    className="text-lg hover:text-blue-200 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-600">
              Tổng cộng: <span className="font-bold text-slate-900">{selectedSeats.length} ghế</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
