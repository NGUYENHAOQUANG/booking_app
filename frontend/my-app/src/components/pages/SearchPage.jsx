import { Search, Sparkles } from "lucide-react";

const SearchPage = () => {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_8px_24px_rgba(16,185,129,0.08)] sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              <Sparkles size={14} />
              Tìm kiếm
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Trang tìm kiếm đang được mở rộng</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Khu vực này hiện là điểm vào cho các luồng tìm kiếm chung. Bạn vẫn có thể dùng nhanh các trang tìm vé máy bay và vé xe khách từ thanh điều hướng.
            </p>
          </div>

          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Search size={26} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;