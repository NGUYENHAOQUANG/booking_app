import { useState } from "react";
import styles from "./ProfilePage.module.css";

const initialProfile = {
  avatarUrl:
    "https://www.figma.com/api/mcp/asset/0fcd60c1-b037-4ecf-a497-4142d52f27d7",
  fullName: "",
  email: "test@gmail.com",
  nickname: "test",
  memberTier: "Bạn là thành viên Bronze Priority",
  gender: "",
  birthDate: "",
  city: "TPHCM",
  mobile: "",
  linkedAccounts: [
    { name: "Facebook", key: "facebook" },
    { name: "Google", key: "google" },
  ],
};

const sideMenu = [
  { label: "Tài khoản", active: true },
  { label: "Đặt vé của tôi" },
  { label: "Danh sách giao dịch" },
  { label: "Thông báo" },
  { label: "Hoàn trả" },
  { label: "Đăng xuất" },
];

const ProfilePage = () => {
  const [profile, setProfile] = useState(initialProfile);
  const displayEmail = profile.email.trim() || "yourname@gmail.com";

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.userHeader}>
            <img
              className={styles.userAvatar}
              src={profile.avatarUrl}
              alt="Avatar người dùng"
            />
            <div className={styles.userInfo}>
              <h2 className={styles.userEmail}>{displayEmail}</h2>
              <p className={styles.userNickname}>{profile.nickname}</p>
            </div>
          </div>

          <div className={styles.memberBadge}>
            <span>{profile.memberTier}</span>
            <span className={styles.badgeArrow}>›</span>
          </div>

          <ul className={styles.menuList}>
            {sideMenu.map((item) => (
              <li
                key={item.label}
                className={`${styles.menuItem} ${item.active ? styles.activeItem : ""}`}
              >
                <span className={styles.menuIcon}>◉</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.content}>
          <h1 className={styles.title}>Thông tin tài khoản</h1>

          <section className={`${styles.panel} ${styles.personalPanel}`}>
            <div className={styles.panelHeader}>Dữ liệu cá nhân</div>

            <div className={styles.fieldGroup}>
              <label htmlFor="fullName">Tên đầy đủ</label>
              <input
                id="fullName"
                name="fullName"
                value={profile.fullName}
                placeholder="Ví dụ: Nguyễn Văn An"
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="gender">Giới tính</label>
                <select
                  id="gender"
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="birthDate">Ngày sinh</label>
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  value={profile.birthDate}
                  onChange={handleInputChange}
                  className={styles.dateInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="city">Nơi cư trú</label>
              <input
                id="city"
                name="city"
                value={profile.city}
                placeholder="Ví dụ: TP. Ho Chi Minh"
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.actionField}>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  value={profile.email}
                  placeholder="Ví dụ: tenban@gmail.com"
                  onChange={handleInputChange}
                />
              </div>
              <button type="button" className={styles.outlineBtn}>
                + Thêm email
              </button>
            </div>

            <div className={styles.actionField}>
              <div className={styles.fieldGroup}>
                <label htmlFor="mobile">Số di động</label>
                <input
                  id="mobile"
                  name="mobile"
                  value={profile.mobile}
                  placeholder="Ví dụ: 09xxxxxxxx"
                  onChange={handleInputChange}
                />
              </div>
              <button type="button" className={styles.outlineBtn}>
                + Thêm số điện thoại
              </button>
            </div>

            <div className={styles.saveRow}>
              <button type="button" className={styles.saveBtn}>
                Lưu thông tin
              </button>
            </div>
          </section>

          <section className={`${styles.panel} ${styles.linkedPanel}`}>
            <div className={styles.panelHeader}>Tài khoản liên kết</div>
            <ul className={styles.linkedList}>
              {profile.linkedAccounts.map((item) => (
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
