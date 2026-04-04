
export default function AuthSidePanel({ image }) {
  return (
    <div className="hidden lg:flex w-[42%] min-h-screen relative overflow-hidden flex-col justify-end shrink-0">
      {/* Ảnh nền */}
      <img
        src={image}
        alt="VivaVivu"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-900/85 via-teal-800/40 to-transparent" />

      {/* Text bottom-left */}
      <div className="relative z-10 p-10 pb-14 select-none">
        <h2
          className="text-4xl font-black text-white leading-tight mb-3"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,.35)" }}
        >
          Săn vé rẻ,
          <br />
          <span className="text-teal-300">Thoả đam mê</span>
        </h2>
        <p className="text-white/80 text-sm leading-relaxed max-w-xs">
          Nền tảng đặt vé sự kiện và du lịch hàng đầu dành cho thế hệ mới!.
        </p>
      </div>
    </div>
  );
}