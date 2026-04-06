import { useEffect, useMemo, useState } from "react";
import { Facebook, Globe2, LoaderCircle, MailPlus, Phone, Save } from "lucide-react";
import AccountShell from "@/components/account/AccountShell";
import useAuthStore from "@/store/authStore";
import userService from "@/services/userService";

const DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
const YEAR_OPTIONS = Array.from({ length: 80 }, (_, index) => String(new Date().getFullYear() - index));

const splitBirthDate = (value) => {
  if (!value) return { birthDay: "", birthMonth: "", birthYear: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { birthDay: "", birthMonth: "", birthYear: "" };

  return {
    birthDay: String(date.getDate()).padStart(2, "0"),
    birthMonth: String(date.getMonth() + 1).padStart(2, "0"),
    birthYear: String(date.getFullYear()),
  };
};

const buildBirthDate = ({ birthDay, birthMonth, birthYear }) => {
  if (!birthDay || !birthMonth || !birthYear) return undefined;
  return `${birthYear}-${birthMonth}-${birthDay}`;
};

const ProfilePage = () => {
  const { user, logout, setUser } = useAuthStore();
  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    city: "",
    allowPromotions: false,
    birthDay: "",
    birthMonth: "",
    birthYear: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        const data = response?.data || {};
        const birthDate = splitBirthDate(data.birthDate);

        if (!mounted) return;

        setProfile({
          fullName: data.fullName || user?.fullName || "",
          phoneNumber: data.phoneNumber || user?.phoneNumber || "",
          email: data.email || user?.email || "",
          gender: data.gender || "",
          city: data.city || "",
          allowPromotions: Boolean(data.allowPromotions),
          ...birthDate,
        });
      } catch (error) {
        if (!mounted) return;
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Không tải được thông tin tài khoản.",
        });
        setProfile({
          fullName: user?.fullName || "",
          phoneNumber: user?.phoneNumber || "",
          email: user?.email || "",
          gender: "",
          city: "",
          allowPromotions: false,
          birthDay: "",
          birthMonth: "",
          birthYear: "",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user?.email, user?.fullName, user?.phoneNumber]);

  const linkedAccounts = useMemo(
    () => [
      { name: "Facebook", icon: Facebook },
      { name: "Google", icon: Globe2 },
    ],
    [],
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    setSaving(true);

    try {
      const payload = {
        fullName: profile.fullName.trim(),
        phoneNumber: profile.phoneNumber.trim(),
        gender: profile.gender || undefined,
        city: profile.city.trim() || undefined,
        allowPromotions: profile.allowPromotions,
      };

      const birthDate = buildBirthDate(profile);
      if (birthDate) payload.birthDate = birthDate;

      const response = await userService.updateProfile(payload);
      const updatedUser = response?.data || {};
      const updatedBirthDate = splitBirthDate(updatedUser.birthDate);

      setUser(updatedUser);
      setProfile((current) => ({
        ...current,
        fullName: updatedUser.fullName || current.fullName,
        phoneNumber: updatedUser.phoneNumber || current.phoneNumber,
        email: updatedUser.email || current.email,
        gender: updatedUser.gender || "",
        city: updatedUser.city || "",
        allowPromotions: Boolean(updatedUser.allowPromotions),
        ...updatedBirthDate,
      }));
      setMessage({ type: "success", text: "Đã lưu thông tin tài khoản." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Cập nhật profile thất bại.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountShell user={user} activeItem="profile" onLogout={logout} title="Thông tin tài khoản">
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="overflow-hidden rounded-[14px] border border-emerald-300 bg-white shadow-[0_6px_16px_rgba(16,185,129,0.1)]">
          <div className="border-b border-emerald-300 px-4 py-3">
            <h2 className="text-[17px] font-extrabold text-slate-900">Dữ liệu cá nhân</h2>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            {message.text ? (
              <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${message.type === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700"}`}>
                {message.text}
              </div>
            ) : null}

            {loading ? (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <LoaderCircle className="animate-spin" size={18} />
                Đang tải thông tin cá nhân...
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-700">Tên đầy đủ</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                className="h-10 w-full rounded-[5px] border border-slate-500 px-3 text-sm outline-none transition focus:border-[#4fbba0]"
                placeholder="Nhập họ tên"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[1.1fr_1.7fr]">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-700">Giới tính</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="h-10 w-full rounded-[5px] border border-slate-500 px-3 text-sm outline-none transition focus:border-[#4fbba0]"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-slate-700">Ngày sinh</label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    name="birthDay"
                    value={profile.birthDay}
                    onChange={handleChange}
                    className="h-10 rounded-[5px] border border-slate-500 px-3 text-sm outline-none transition focus:border-[#4fbba0]"
                  >
                    <option value="">DD</option>
                    {DAY_OPTIONS.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    name="birthMonth"
                    value={profile.birthMonth}
                    onChange={handleChange}
                    className="h-10 rounded-[5px] border border-slate-500 px-3 text-sm outline-none transition focus:border-[#4fbba0]"
                  >
                    <option value="">MM</option>
                    {MONTH_OPTIONS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    name="birthYear"
                    value={profile.birthYear}
                    onChange={handleChange}
                    className="h-10 rounded-[5px] border border-slate-500 px-3 text-sm outline-none transition focus:border-[#4fbba0]"
                  >
                    <option value="">YYYY</option>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-700">Nơi cư trú</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                className="h-10 w-full rounded-[5px] border border-slate-500 px-3 text-sm outline-none transition focus:border-[#4fbba0]"
                placeholder="Nhập nơi cư trú"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-700">Email</label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="h-10 w-full rounded-[5px] border border-slate-500 bg-slate-50 px-3 text-sm font-medium text-slate-500 outline-none"
                />
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[5px] border border-[#4fbba0] px-4 text-sm font-semibold text-[#4fbba0] transition hover:bg-[#f1fbf8]"
                >
                  <MailPlus size={18} />
                  Thêm email
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-700">Số di động</label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  className="h-10 w-full rounded-[5px] border border-slate-500 px-3 text-sm outline-none transition focus:border-[#4fbba0]"
                  placeholder="Nhập số điện thoại"
                />
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[5px] border border-[#4fbba0] px-4 text-sm font-semibold text-[#4fbba0] transition hover:bg-[#f1fbf8]"
                >
                  <Phone size={18} />
                  Thêm số điện thoại
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#4fbba0] px-5 text-sm font-bold text-white transition hover:bg-[#41aa90] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </form>

        <div className="overflow-hidden rounded-[14px] border border-emerald-300 bg-white shadow-[0_6px_16px_rgba(16,185,129,0.1)]">
          <div className="border-b border-emerald-300 px-4 py-3">
            <h2 className="text-[17px] font-extrabold text-slate-900">Tài khoản liên kết</h2>
          </div>

          <div className="space-y-2 px-4 py-3 sm:px-5 sm:py-4">
            {linkedAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <div key={account.name} className="flex items-center gap-3 rounded-xl px-1 py-1 text-slate-800">
                  <Icon size={18} className="text-[#4fbba0]" />
                  <span className="text-[15px] font-semibold">{account.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AccountShell>
  );
};

export default ProfilePage;