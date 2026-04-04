# Booking Web – API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Đăng ký tài khoản |
| POST | `/auth/login` | ❌ | Đăng nhập |
| POST | `/auth/logout` | ✅ | Đăng xuất |
| POST | `/auth/refresh-token` | ❌ | Làm mới access token |
| POST | `/auth/forgot-password` | ❌ | Gửi OTP reset mật khẩu |
| POST | `/auth/reset-password` | ❌ | Đặt lại mật khẩu |
| POST | `/auth/google` | ❌ | Đăng nhập Google OAuth |

---

## ✈️ Flights (`/api/flights`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/flights/airports?q=han` | ❌ | Tìm kiếm sân bay (autocomplete) |
| POST | `/flights/search` | ❌ | Tìm kiếm chuyến bay |
| GET | `/flights/:id` | ❌ | Chi tiết chuyến bay |
| GET | `/flights/:id/seats` | ❌ | Sơ đồ ghế ngồi |
| POST | `/flights` | 🔒 admin | Tạo chuyến bay mới |
| PUT | `/flights/:id` | 🔒 admin | Cập nhật chuyến bay |

### POST `/flights/search` – Body
```json
{
  "origin": "HAN",
  "destination": "SGN",
  "departureDate": "2026-04-10",
  "returnDate": "2026-04-15",
  "tripType": "round_trip",
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  }
}
```

---

## 🎫 Bookings (`/api/bookings`)  — Requires Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookings/my` | ✅ | Lịch sử đặt vé của tôi |
| POST | `/bookings` | ✅ | Tạo đặt vé mới |
| GET | `/bookings/:id` | ✅ | Chi tiết đặt vé |
| PUT | `/bookings/:id/confirm-payment` | ✅ | Xác nhận thanh toán |
| PUT | `/bookings/:id/cancel` | ✅ | Hủy đặt vé |

### POST `/bookings` – Body
```json
{
  "tripType": "one_way",
  "outboundFlight": {
    "flight": "<flightId>",
    "fareClass": "ECO",
    "farePrice": 990000
  },
  "contactInfo": {
    "fullName": "Nguyen Van A",
    "email": "a@example.com",
    "phone": "0901234567"
  },
  "passengers": [
    {
      "type": "adult",
      "salutation": "Mr",
      "firstName": "Van A",
      "lastName": "Nguyen",
      "seatOutbound": "12C"
    }
  ],
  "pricing": {
    "subtotal": 990000,
    "taxes": 99000,
    "serviceFee": 50000,
    "discount": 0,
    "total": 1139000
  },
  "payment": {
    "method": "credit_card"
  }
}
```

---

## 👤 Users (`/api/users`)  — Requires Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | ✅ | Lấy thông tin profile |
| PUT | `/users/me` | ✅ | Cập nhật profile |
| PUT | `/users/me/change-password` | ✅ | Đổi mật khẩu |
| GET | `/users/me/stats` | ✅ | Thống kê đặt vé |

---

## 🌱 Seed Data

```bash
# Seed roles (user, admin)
npm run seed:roles

# Seed airports, airlines, flights (7 ngày tới)
npm run seed:flights

# Seed tất cả
npm run seed:all
```

---

## 📊 Data Models

### Booking Status Flow
```
pending → confirmed → completed
pending → cancelled
confirmed → refund_requested → refunded
```

### Trip Types
- `one_way` – Một chiều
- `round_trip` – Khứ hồi

### Fare Classes
- `ECO` – Economy
- `BUS` – Business
