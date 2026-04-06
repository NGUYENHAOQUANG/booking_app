# Sử dụng Node.js phiên bản 20 (nhẹ nhất với alpine) để build server
FROM node:20-alpine

# Thiết lập thư mục làm việc trong container là /app
WORKDIR /app

# Copy các file quản lý thư viện trước để tối ưu hóa việc cài đặt (cache)
COPY package*.json ./

# Cài đặt các thư viện cần thiết cho dự án (chế độ production)
RUN npm install --production

# Copy toàn bộ mã nguồn của backend vào thư mục /app trong container
COPY . .

# Thông báo container này lắng nghe cổng 5000 (đúng cổng Backend của bạn)
EXPOSE 5000

# Lệnh khởi chạy server (dùng node trực tiếp, không dùng nodemon trong container)
CMD ["node", "index.js"]
