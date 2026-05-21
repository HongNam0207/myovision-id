# MYOVISION ID - Firebase realtime bản cuối

## Đã cấu hình

- `src/firebase/firebase.js`: Firebase Auth + Firestore.
- `src/services/authService.js`: đăng nhập Firebase Authentication, đọc role từ collection `users`.
- `src/services/patientService.js`: CRUD realtime collection `patients`.
- `src/services/userService.js`: realtime collection `users` và cập nhật role.
- `src/pages/Login.jsx`: đăng nhập thật bằng Firebase, có 4 tài khoản demo.
- `src/pages/Patients.jsx`: thêm/xóa/cập nhật trạng thái bệnh nhi realtime.
- `src/pages/Users.jsx`: quản lý profile/role người dùng realtime.
- `src/layouts/MainLayout.jsx`: logout Firebase thật.
- `src/routes/AppRoutes.jsx`: route guard theo role.
- `seedFirestore.js`: seed dữ liệu mẫu tự động, chạy được nhiều lần mà không tạo trùng doc cố định.

## Tài khoản demo cần có trong Firebase Authentication

Tạo bằng Firebase Console > Authentication > Users:

- `admin@myovision.com` / `12345678`
- `doctor@myovision.com` / `12345678`
- `reception@myovision.com` / `12345678`
- `technician@myovision.com` / `12345678`

## Seed Firestore

Chạy:

```bash
npm run seed
```

Lệnh này tạo/cập nhật các collection:

- `users`
- `patients`
- `treatments`
- `clinicalExams`
- `riskAssessments`
- `followUps`
- `reports`

## Chạy app

```bash
npm install
npm run dev
```

## Build deploy

```bash
npm run build
```

## Lưu ý

- Firestore test mode chỉ dùng để demo. Khi deploy thật cần viết Firestore Security Rules.
- Collection `users` chỉ lưu role/profile. Firebase Authentication mới là nơi quản lý tài khoản đăng nhập.
- Nếu đã seed bằng bản cũ trước đó, có thể có document trùng do Auto-ID. Có thể xóa thủ công các document trùng trong Firestore nếu cần.
