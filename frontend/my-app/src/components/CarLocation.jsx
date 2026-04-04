import { useState } from 'react';

const locations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng'];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const CarLocation = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setStatus('loading');
    setCars([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/cars/location?location=${encodeURIComponent(selectedLocation)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lấy dữ liệu xe thất bại');
      }

      setCars(Array.isArray(data.data) ? data.data : []);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi');
      setStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/80 p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Chọn vị trí xe</h2>
        <p className="text-sm text-slate-500">Chọn vị trí và xem danh sách xe hiện có tại khu vực.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1.5fr_auto] items-end">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Vị trí</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="mt-2 w-full h-14 px-4 border border-slate-200 rounded-2xl bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="h-14 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
        >
          {status === 'loading' ? 'Đang tải...' : 'Xác nhận'}
        </button>
      </form>

      <div className="mt-8">
        {status === 'error' && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {status === 'success' && cars.length === 0 && (
          <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
            Không tìm thấy xe tại vị trí {selectedLocation}.
          </div>
        )}

        {cars.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-slate-500 mb-3">
              Danh sách xe tại <span className="font-semibold text-slate-900">{selectedLocation}</span>.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {cars.map((car) => (
                <div key={car.id} className="rounded-3xl border border-slate-200 p-5 bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">{car.name}</h3>
                  <p className="text-sm text-slate-600 mt-2">Vị trí: {car.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarLocation;
