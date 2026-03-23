import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";

/**
 * Layout dành riêng cho các trang xác thực (Login, Register).
 * Hiển thị card form ở giữa màn hình với background gradient.
 */
const AuthLayout = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>🏨 BookingWeb</div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
