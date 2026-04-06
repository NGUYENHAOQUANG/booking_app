# Giai đoạn 1: Build mã nguồn React/Vite thành các file tĩnh (Build stage)
FROM node:20-alpine AS build

# Đặt thư mục làm việc chính
WORKDIR /app

# Copy các file cài đặt thư viện
COPY package*.json ./

# Cài đặt tất cả các thư viện cần thiết
RUN npm install

# Copy toàn bộ mã nguồn của frontend
COPY . .

# Chạy lệnh build để tạo ra thư mục /dist (chứa HTML/JS/CSS đã nén)
RUN npm run build

# Giai đoạn 2: Phục vụ Web (Serve) bằng Nginx (Giai đoạn nhẹ nhất)
FROM nginx:alpine

# Copy các file tĩnh ĐÃ BUILD từ Stage 1 vào thư mục gốc của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 cho web
EXPOSE 80

# Chạy Nginx ở chế độ foreground (không chạy ngầm để container không bị tắt)
CMD ["nginx", "-g", "daemon off;"]
