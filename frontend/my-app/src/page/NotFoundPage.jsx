import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>404 - Không tìm thấy trang</h1>
      <p>Trang bạn đang tìm không tồn tại.</p>
      <Link to="/">Quay về trang chủ</Link>
    </div>
  );
};

export default NotFoundPage;
