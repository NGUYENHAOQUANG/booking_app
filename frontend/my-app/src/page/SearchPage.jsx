import { useState } from "react";
import CarSearch from "../components/CarSearch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SearchPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);

  const handleSearch = async ({ pickupLocation, dropoffLocation, rentalDate }) => {
    setError(null);
    setCars([]);
    setSearchInfo({ pickupLocation, dropoffLocation, rentalDate });
    setLoading(true);

    try {
      const queryString = new URLSearchParams({
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        date: rentalDate,
      }).toString();

      const response = await fetch(`${API_BASE_URL}/api/cars/search?${queryString}`);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Không thể lấy dữ liệu xe.");
      }

      setCars(json.data || []);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Tìm xe ngay</h1>
          <p className="text-slate-600">Nhập điểm đón, điểm trả và ngày thuê để xem danh sách xe khả dụng.</p>
        </div>

        <CarSearch onSearch={handleSearch} />

        <div className="mt-10">
          {loading && (
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-blue-700 shadow-sm">
              Đang tìm kiếm xe, vui lòng chờ...
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && searchInfo && cars.length === 0 && (
            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-700 shadow-sm">
              Không tìm thấy xe cho tìm kiếm của bạn.
            </div>
          )}

          {!loading && cars.length > 0 && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Kết quả tìm kiếm cho <span className="font-semibold text-slate-900">{searchInfo.pickupLocation}</span> → <span className="font-semibold text-slate-900">{searchInfo.dropoffLocation}</span> vào ngày <span className="font-semibold text-slate-900">{searchInfo.rentalDate}</span>.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {cars.map((car) => (
                  <div key={car.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <img src={car.image} alt={car.name} className="h-56 w-full object-cover" />
                    <div className="p-5">
                      <h2 className="text-2xl font-semibold text-slate-900">{car.name}</h2>
                      <p className="mt-3 text-sm text-slate-500">Số ghế: {car.seats}</p>
                      <p className="mt-2 text-xl font-bold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(car.price)}</p>
                      <button className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                        Chọn xe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
