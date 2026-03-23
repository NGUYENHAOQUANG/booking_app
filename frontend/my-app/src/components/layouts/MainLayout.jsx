import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const navigate = useNavigate();

  // TODO: Thay bằng auth context thực tế
  const isLoggedIn = false;

  const handleLogout = () => {
    // TODO: clear token/session
    navigate("/login");
  };

  return (
    <div className={styles.wrapper}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <Link to="/" className={styles.brand}>
          🏨 BookingWeb
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            end
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Tìm kiếm
          </NavLink>
        </nav>

        <div className={styles.authGroup}>
          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className={styles.navLink}>
                Tài khoản
              </NavLink>
              <button onClick={handleLogout} className={styles.btnOutline}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={styles.navLink}>
                Đăng nhập
              </NavLink>
              <NavLink to="/register" className={styles.btnPrimary}>
                Đăng ký
              </NavLink>
            </>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 BookingWeb. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
