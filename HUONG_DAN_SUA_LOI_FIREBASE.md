# Hướng dẫn Sửa lỗi Quyền truy cập (Permissions) trên Firebase Firestore

Khi chạy ứng dụng, nếu màn hình bị kẹt ở trạng thái **"Đang đồng bộ dữ liệu..."** và Console của trình duyệt báo lỗi:
`FirebaseError: [code=permission-denied]: Missing or insufficient permissions.`

Điều này có nghĩa là ứng dụng đang bị chặn không cho phép đọc/ghi dữ liệu từ Database do cấu hình Luật bảo mật (Security Rules) của Firestore đang ở chế độ khóa (Production) hoặc thời gian mở Test Mode đã hết hạn.

Để giúp ứng dụng kết nối thành công và tải được dữ liệu, người quản trị Firebase (hoặc người nắm tài khoản tạo project) cần thực hiện các bước sau:

## Các bước cấu hình lại Security Rules

**Bước 1:** Truy cập vào [Firebase Console](https://console.firebase.google.com/).
**Bước 2:** Chọn đúng Project đang sử dụng (Ví dụ: `dashboard-xa-tan-hiep`).
**Bước 3:** Nhìn sang thanh menu bên trái, mở rộng mục **Build (Phát triển)** và nhấp vào **Firestore Database**.
**Bước 4:** Ở phía trên cùng của giao diện dữ liệu, chuyển sang thẻ **Rules (Quy tắc)**.
**Bước 5:** Xóa toàn bộ nội dung cũ và dán chính xác đoạn mã sau vào:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Tạm thời mở quyền đọc/ghi cho tất cả mọi người (Test Mode) 
      // để Dashboard có thể lấy dữ liệu.
      allow read, write: if true;
    }
  }
}
```

**Bước 6:** Nhấp vào nút **Publish (Xuất bản)** ở góc trên bên phải để áp dụng luật mới.

---
*Sau khi bạn đã hoàn tất 6 bước trên, hãy báo lại để người dùng tải lại trang web (F5). Ứng dụng sẽ tự động kết nối và tải toàn bộ dữ liệu lên Dashboard thành công!*
