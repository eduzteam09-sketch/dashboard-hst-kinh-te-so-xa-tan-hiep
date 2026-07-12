# Hướng dẫn cấu hình biến môi trường (.env) trên Vercel để kết nối Firebase

Chào Tú, đây là hướng dẫn chi tiết từ A đến Z cách đưa các biến môi trường từ file `.env` ở máy tính (local) lên Vercel. Việc này là **BẮT BUỘC** để website khi deploy lên mạng có thể kết nối được với database Firebase và sử dụng được API của Gemini.

> **💡 Tại sao phải làm việc này?**
> File `.env` chứa các thông tin nhạy cảm (như mật khẩu, API Key). Khi code được đưa lên GitHub, file này luôn bị bỏ qua (thông qua `.gitignore`) để bảo mật. Do đó, Vercel không biết các biến này là gì. Chúng ta phải khai báo thủ công trên Vercel để code chạy được.

---

## 🛠 Bước 1: Chuẩn bị danh sách các biến cần thêm

Hãy mở file `.env` trong project. Bạn sẽ thấy các biến có tiền tố `VITE_` (điều này bắt buộc trong Vite để trình duyệt có thể đọc được). Dưới đây là danh sách các biến chúng ta cần đưa lên Vercel (dựa theo code hiện tại):

```env
VITE_GEMINI_API_KEY=AIzaSyCtHaIBDk... (thay bằng key thật)

VITE_FIREBASE_API_KEY=AIzaSyDrcOm... (thay bằng key thật)
VITE_FIREBASE_AUTH_DOMAIN=dashboard-xa-tan-hiep.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dashboard-xa-tan-hiep
VITE_FIREBASE_STORAGE_BUCKET=dashboard-xa-tan-hiep.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=379905119690
VITE_FIREBASE_APP_ID=1:379905119690:web:1ed63e0fd0fef05b686b33
```

*(Hãy giữ file `.env` này mở sẵn trên máy để tiện copy-paste nhé).*

---

## 🌐 Bước 2: Đăng nhập và vào cài đặt dự án trên Vercel

1. Truy cập vào trang quản trị Vercel: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Đăng nhập bằng tài khoản (GitHub/Google) chứa dự án.
3. Trong danh sách các dự án (Projects), hãy **Click vào tên dự án** mà bạn đang muốn cấu hình.
4. Nhìn lên thanh menu ngang phía trên cùng, bấm vào tab **Settings** (Cài đặt).
5. Ở menu dọc bên tay trái, bấm vào mục **Environment Variables** (Biến môi trường).

---

## ➕ Bước 3: Thêm các biến môi trường vào Vercel

Tại màn hình **Environment Variables**, bạn sẽ thấy một khu vực để thêm biến mới. Chúng ta có thể thêm từng biến một, hoặc copy-paste toàn bộ.

### Cách 1: Copy paste toàn bộ (Khuyên dùng vì nhanh nhất)
1. Bạn bôi đen và **copy toàn bộ nội dung** trong file `.env` (bao gồm cả `TÊN_BIẾN=GIÁ_TRỊ`).
2. Quay lại trang Vercel, click chuột vào ô nhập tên biến đầu tiên (**Key**).
3. Nhấn **Ctrl + V** (hoặc `Cmd + V` trên Mac) để Paste.
4. Vercel sẽ tự động nhận diện và chia ra thành nhiều dòng ứng với từng biến luôn. Rất xịn!
5. Kiểm tra lại xem danh sách đã chuẩn chưa, sau đó nhấn nút **Save** (Lưu lại).

### Cách 2: Thêm thủ công từng biến
Nếu cách 1 bị lỗi, bạn làm thủ công theo các bước:
1. Ô **Key**: Điền tên biến (Ví dụ: `VITE_FIREBASE_API_KEY`).
2. Ô **Value**: Copy giá trị tương ứng của biến đó dán vào (chỉ copy phần sau dấu `=`).
3. Phần **Environments**: Cứ để check hết cả 3 ô (Production, Preview, Development) để chạy ở môi trường nào cũng được.
4. Bấm nút **Save**.
5. Lặp lại thao tác này cho tất cả các biến còn lại.

---

## 🚀 Bước 4: Triển khai (Redeploy) lại Website

> **⚠️ LƯU Ý QUAN TRỌNG:**
> Sau khi bạn nhấn Save ở bước 3, website hiện tại **VẪN CHƯA THỂ CHẠY NGAY**. Các biến môi trường mới chỉ được áp dụng khi project được build lại (Redeploy).

Để build lại project:
1. Vẫn trong trang quản trị của dự án trên Vercel, bấm sang tab **Deployments** (nằm trên menu ngang trên cùng).
2. Bạn sẽ thấy danh sách các lần deploy. Hãy tìm cái ở trên cùng (có chữ `Current` hoặc mới nhất).
3. Bấm vào dấu **3 chấm dọc `⋮`** ở bên phải của bản deploy đó.
4. Chọn **Redeploy**.
5. Một hộp thoại xác nhận hiện ra, bạn bỏ tick phần "Use existing Build Cache" (để đảm bảo code ăn cấu hình mới 100%), rồi bấm nút **Redeploy**.
6. Ngồi đợi khoảng 1-2 phút cho đến khi quá trình build kết thúc và báo trạng thái **Ready** (Màu xanh lá).

---

## ✅ Bước 5: Kiểm tra thành quả

1. Bấm vào nút **Visit** hoặc click trực tiếp vào đường link mà Vercel cấp cho dự án.
2. Mở cửa sổ Console của trình duyệt (Nhấn `F12` hoặc chuột phải -> `Inspect` -> chuyển sang tab `Console`) để theo dõi xem có lỗi đỏ (Error) nào liên quan đến Firebase hay không.
3. Nếu dữ liệu hiện lên đầy đủ và không có lỗi (như kiểu `FirebaseError: API key not valid` hay `missing options`), thì **chúc mừng bạn đã cấu hình thành công!** 🎆

> **Ghi chú nhỏ:** Bất cứ khi nào bạn thay đổi hay thêm biến trong file `.env` ở dưới máy tính, bạn đều phải lên Vercel cập nhật lại các biến này và làm lại **Bước 4 (Redeploy)** thì web trên mạng mới nhận cấu hình mới nhé.
