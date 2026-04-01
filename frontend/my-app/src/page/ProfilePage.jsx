import styles from "./ProfilePage.module.css";

const mockProfile = {
  avatarUrl:
    "https://www.figma.com/api/mcp/asset/0fcd60c1-b037-4ecf-a497-4142d52f27d7",
  fullName: "Test",
  email: "test@gmail.com",
  nickname: "test",
  memberTier: "Bạn là thành viên Bronze Priority",
  gender: "",
  day: "",
  month: "",
  year: "",
  city: "TPHCM",
  mobile: "0123456789",
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
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.userHeader}>
            <img
              className={styles.userAvatar}
              src={mockProfile.avatarUrl}
              alt="Avatar người dùng"
            />
            <div>
              <h2 className={styles.userEmail}>{mockProfile.email}</h2>
              <p className={styles.userNickname}>{mockProfile.nickname}</p>
            </div>
          </div>

          <div className={styles.memberBadge}>
            <span>{mockProfile.memberTier}</span>
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
                value={mockProfile.fullName}
                placeholder="Ví dụ: Nguyễn Văn An"
                readOnly
              />
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="gender">Giới tính</label>
                <select id="gender" value={mockProfile.gender} disabled>
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label>Ngày sinh</label>
                <div className={styles.birthRow}>
                  <select value={mockProfile.day} aria-label="Ngày" disabled>
                    <option value="">Ngày</option>
                  </select>
                  <select value={mockProfile.month} aria-label="Tháng" disabled>
                    <option value="">Tháng</option>
                  </select>
                  <select value={mockProfile.year} aria-label="Năm" disabled>
                    <option value="">Năm</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="city">Nơi cư trú</label>
              <input
                id="city"
                value={mockProfile.city}
                placeholder="Ví dụ: TP. Ho Chi Minh"
                readOnly
              />
            </div>

            <div className={styles.actionField}>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  value={mockProfile.email}
                  placeholder="Ví dụ: tenban@gmail.com"
                  readOnly
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
                  value={mockProfile.mobile}
                  placeholder="Ví dụ: 09xxxxxxxx"
                  readOnly
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
              {mockProfile.linkedAccounts.map((item) => (
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
