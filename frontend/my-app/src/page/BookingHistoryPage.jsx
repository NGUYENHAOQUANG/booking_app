import { NavLink } from "react-router-dom";
import styles from "./BookingHistoryPage.module.css";

const profileData = {
  avatarUrl:
    "https://www.figma.com/api/mcp/asset/0fcd60c1-b037-4ecf-a497-4142d52f27d7",
  email: "test@gmail.com",
  nickname: "test",
  memberTier: "Bạn là thành viên Bronze Priority",
};

const sideMenu = [
  { label: "Tài khoản", to: "/profile" },
  { label: "Đặt vé của tôi", to: "/booking-history", active: true },
  { label: "Danh sách giao dịch", to: "#" },
  { label: "Thông báo", to: "#" },
  { label: "Hoàn trả", to: "#" },
  { label: "Đăng xuất", to: "#" },
];

const bookingHistory = [
  {
    id: "BK-001",
    operator: "Xe Phương Trang",
    vehicle: "Giường nằm - Giường nằm 41 chỗ ngồi",
    departureTime: "22:36",
    departurePlace: "Văn phòng quận 1",
    duration: "5 giờ 6 phút",
    arrivalTime: "5:30",
    arrivalPlace: "VP Đà Lạt - Bùi Thị Xuân",
    price: "228.855 VND / chỗ ngồi",
  },
  {
    id: "BK-002",
    operator: "Xe Phương Trang",
    vehicle: "Giường nằm - Giường nằm 41 chỗ ngồi",
    departureTime: "22:36",
    departurePlace: "Văn phòng quận 1",
    duration: "5 giờ 6 phút",
    arrivalTime: "5:30",
    arrivalPlace: "VP Đà Lạt - Bùi Thị Xuân",
    price: "228.855 VND / chỗ ngồi",
  },
  {
    id: "BK-003",
    operator: "Xe Phương Trang",
    vehicle: "Giường nằm - Giường nằm 41 chỗ ngồi",
    departureTime: "22:36",
    departurePlace: "Văn phòng quận 1",
    duration: "5 giờ 6 phút",
    arrivalTime: "5:30",
    arrivalPlace: "VP Đà Lạt - Bùi Thị Xuân",
    price: "228.855 VND / chỗ ngồi",
  },
];

const BookingHistoryPage = () => {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.userHeader}>
            <img
              className={styles.userAvatar}
              src={profileData.avatarUrl}
              alt="Avatar người dùng"
            />
            <div className={styles.userInfo}>
              <h2 className={styles.userEmail}>{profileData.email}</h2>
              <p className={styles.userNickname}>{profileData.nickname}</p>
            </div>
          </div>

          <div className={styles.memberBadge}>
            <span>{profileData.memberTier}</span>
            <span className={styles.badgeArrow}>›</span>
          </div>

          <ul className={styles.menuList}>
            {sideMenu.map((item) => (
              <li
                key={item.label}
                className={`${styles.menuItem} ${item.active ? styles.activeItem : ""}`}
              >
                <span className={styles.menuIcon} aria-hidden="true">
                  ●
                </span>
                {item.to === "#" ? (
                  <span>{item.label}</span>
                ) : (
                  <NavLink to={item.to} className={styles.menuLink}>
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <span className={styles.titleIcon} aria-hidden="true">
              🕘
            </span>
            <h1 className={styles.title}>Lịch sử đặt vé</h1>
          </div>

          <div className={styles.listPanel}>
            {bookingHistory.map((ticket) => (
              <article key={ticket.id} className={styles.ticketCard}>
                <div className={styles.transportBlock}>
                  <h3 className={styles.operatorName}>{ticket.operator}</h3>
                  <p className={styles.vehicleInfo}>{ticket.vehicle}</p>
                </div>

                <div className={styles.tripBlock}>
                  <p className={styles.metaTime}>{ticket.departureTime}</p>
                  <p className={styles.metaPlace}>{ticket.departurePlace}</p>
                </div>

                <div className={styles.durationBlock}>
                  <span>{ticket.duration}</span>
                  <span className={styles.durationLine} aria-hidden="true" />
                </div>

                <div className={styles.tripBlock}>
                  <p className={styles.metaTime}>{ticket.arrivalTime}</p>
                  <p className={styles.metaPlace}>{ticket.arrivalPlace}</p>
                </div>

                <div className={styles.priceBlock}>
                  <p>{ticket.price}</p>
                  <button type="button" className={styles.detailBtn}>
                    Xem chi tiết
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingHistoryPage;