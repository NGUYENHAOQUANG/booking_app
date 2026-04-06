import { ChevronRight, History, LogOut, ReceiptText, Ticket, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const MENU_ITEMS = [
  { key: "profile", label: "Tài khoản", icon: UserRound, to: ROUTES.PROFILE },
  { key: "history", label: "Đặt vé của tôi", icon: Ticket, to: ROUTES.BOOKING_HISTORY },
  { key: "transactions", label: "Danh sách giao dịch", icon: ReceiptText, disabled: true },
  { key: "notifications", label: "Thông báo", icon: History, disabled: true },
  { key: "refunds", label: "Hoàn trả", icon: ReceiptText, disabled: true },
];

const AccountShell = ({ user, activeItem, onLogout, title, children }) => {
  const displayName = user?.fullName || user?.email || "Tài khoản của bạn";
  const email = user?.email || "Chưa có email";

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[272px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[14px] border border-emerald-300 bg-white shadow-[0_6px_16px_rgba(16,185,129,0.12)]">
            <div className="p-4 pb-0">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                  <UserRound size={32} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[17px] font-extrabold text-slate-900">{displayName}</p>
                  <p className="truncate text-[13px] text-slate-500">{email}</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-3 flex w-full items-center justify-between rounded-[16px] bg-[#d8a976] px-4 py-3 text-left text-white shadow-[0_10px_24px_rgba(216,169,118,0.35)]"
              >
                <span className="text-sm font-semibold leading-snug">Bạn là thành viên Bronze Priority</span>
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-3 border-t border-emerald-200">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.key;
                const baseClass = `flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] transition-colors ${
                  isActive
                    ? "bg-[#4fbba0] text-white"
                    : "text-slate-800 hover:bg-slate-50"
                }`;
                const iconClass = isActive ? "text-white" : "text-[#2daaa0]";

                if (item.to) {
                  return (
                    <Link key={item.key} to={item.to} className={baseClass}>
                      <Icon size={22} className={iconClass} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled
                    className={`${baseClass} cursor-not-allowed opacity-70`}
                  >
                    <Icon size={22} className={iconClass} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 border-t border-emerald-200 px-4 py-3.5 text-left text-[15px] text-slate-800 transition-colors hover:bg-slate-50"
              >
                <LogOut size={22} className="text-[#2daaa0]" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          {title ? <h1 className="mb-4 text-[28px] font-extrabold leading-tight text-[#4fbba0]">{title}</h1> : null}
          {children}
        </section>
      </div>
    </div>
  );
};

export default AccountShell;