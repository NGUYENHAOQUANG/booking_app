// src/components/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Calendar, ChevronRight,
  Save, Loader2, CheckCircle, AlertCircle, LogOut
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import userService from "@/services/userService";
import styles from "./ProfilePage.module.css";

const sideMenu = [
  { label: "Tài khoản", active: true, to: "/profile" },
  { label: "Đặt vé của tôi", to: "/booking-history" },
  { label: "Lịch sử giao dịch", to: "#" },
  { label: "Thông báo", to: "#" },
  { label: "Hoàn trả", to: "#" },
];

const GENDER_OPTIONS = [
  { value: "", label: "Chọn giới tính" },
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const ProfilePage = () => {
  const { user, logout, fetchMe } = useAuthStore();

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [errorMsg, setErrorMsg] = useState("");

  // Điền form từ user store khi component mount
  useEffect(() => {
    if (user) {
      setForm({
        fullName:    user.fullName    || "",
        phoneNumber: user.phoneNumber || "",
        gender:      user.gender      || "",
        birthDate:   user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        city: user.city || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);
    setErrorMsg("");
    try {
      await userService.updateProfile(form);
      await fetchMe(); // Cập nhật lại store
      setSaveStatus("success");
    } catch (err) {
      setSaveStatus("error");
      setErrorMsg(err?.response?.data?.message || "Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
      // Auto-hide status after 3s
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleLogout = () => logout();

  const displayEmail = user?.email || "user@example.com";
  const displayName  = user?.fullName || user?.email?.split("@")[0] || "Người dùng";
  const roleName     = user?.role?.displayName || user?.role?.name || "Thành viên";

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.userHeader}>
            <div className={styles.userAvatarWrapper}>
              <span className={styles.userAvatarInitial}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userEmail}>{displayEmail}</h2>
              <p className={styles.userNickname}>{displayName}</p>
            </div>
          </div>

          <div className={styles.memberBadge}>
            <span>🌟 {roleName}</span>
            <ChevronRight size={14} />
          </div>

          <ul className={styles.menuList}>
            {sideMenu.map((item) => (
              <li
                key={item.label}
                className={`${styles.menuItem} ${item.active ? styles.activeItem : ""}`}
              >
                <span className={styles.menuIcon}>●</span>
                {item.to && item.to !== "#" ? (
                  <NavLink to={item.to} className={styles.menuLink}>
                    {item.label}
                  </NavLink>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
            <li className={styles.menuItem}>
              <span className={styles.menuIcon}>●</span>
              <button
                type="button"
                onClick={handleLogout}
                className={`${styles.menuLink} flex items-center gap-2 text-red-500 hover:text-red-600`}
              >
                <LogOut size={14} />
                Đăng xuất
              </button>
            </li>
          </ul>
        </aside>

        {/* ── Content ── */}
        <div className={styles.content}>
          <h1 className={styles.title}>Thông tin tài khoản</h1>

          <form onSubmit={handleSave}>
            <section className={`${styles.panel} ${styles.personalPanel}`}>
              <div className={styles.panelHeader}>Dữ liệu cá nhân</div>

              {/* Họ tên */}
              <div className={styles.fieldGroup}>
                <label htmlFor="fullName">
                  <User size={14} className="inline mr-1" />
                  Tên đầy đủ
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  onChange={handleChange}
                />
              </div>

              {/* Giới tính + Ngày sinh */}
              <div className={styles.inlineFields}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="gender">Giới tính</label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    {GENDER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="birthDate">
                    <Calendar size={14} className="inline mr-1" />
                    Ngày sinh
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleChange}
                    className={styles.dateInput}
                  />
                </div>
              </div>

              {/* Nơi cư trú */}
              <div className={styles.fieldGroup}>
                <label htmlFor="city">
                  <MapPin size={14} className="inline mr-1" />
                  Nơi cư trú
                </label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  placeholder="Ví dụ: TP. Hồ Chí Minh"
                  onChange={handleChange}
                />
              </div>

              {/* Email (readonly) */}
              <div className={styles.actionField}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="email">
                    <Mail size={14} className="inline mr-1" />
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={displayEmail}
                    readOnly
                    className="opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div className={styles.actionField}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="phoneNumber">
                    <Phone size={14} className="inline mr-1" />
                    Số di động
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    placeholder="Ví dụ: 09xxxxxxxx"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Status feedback */}
              {saveStatus === "success" && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                  <CheckCircle size={16} />
                  Lưu thông tin thành công!
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <div className={styles.saveRow}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang lưu...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={16} />
                      Lưu thông tin
                    </span>
                  )}
                </button>
              </div>
            </section>
          </form>

          {/* Tài khoản liên kết */}
          <section className={`${styles.panel} ${styles.linkedPanel}`}>
            <div className={styles.panelHeader}>Tài khoản liên kết</div>
            <ul className={styles.linkedList}>
              {[
                { name: "Facebook", key: "facebook" },
                { name: "Google", key: "google" },
              ].map((item) => (
                <li key={item.key} className={styles.linkedItem}>
                  <span
                    className={`${styles.linkedIcon} ${
                      item.key === "facebook" ? styles.facebookIcon : styles.googleIcon
                    }`}
                    aria-hidden="true"
                  >
                    {item.key === "facebook" ? "f" : "G"}
                  </span>
                  <span>{item.name}</span>
                  <button
                    type="button"
                    className="ml-auto text-xs text-slate-400 hover:text-teal-600 font-medium transition-colors"
                  >
                    Liên kết
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
