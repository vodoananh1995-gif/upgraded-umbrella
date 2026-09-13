# Tiệm Ảnh Capy — Database dùng chung PC + điện thoại

Phiên bản này dùng Supabase cho:
- dữ liệu máy ảnh, giá, ảnh mẫu, cài đặt website và đơn đặt máy;
- tài khoản admin bằng email + mật khẩu (Supabase Auth);
- ảnh banner/ảnh máy/ảnh mẫu/QR tải lên từ máy tính và lưu online;
- kiểm tra trùng lịch trên server, không lộ dữ liệu khách cho website công khai;
- website tự tải lại dữ liệu khoảng mỗi 10 giây để PC và điện thoại cùng thấy thay đổi.

## 1. Tạo project Supabase
1. Vào https://supabase.com/ và tạo project.
2. Trong SQL Editor, dán toàn bộ file `supabase-schema.sql` và Run.
3. Vào Authentication → Users → Add user, tạo 1 tài khoản admin bằng email + mật khẩu.
4. Khuyến nghị tắt public sign-up nếu không cần khách tự tạo tài khoản.

## 2. Lấy 2 thông tin kết nối
Supabase → Project Settings → API:
- Project URL
- Publishable/anon key

Đặt chúng vào Vercel Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Chọn Production (và Preview nếu muốn test), rồi Redeploy.

## 3. Đăng nhập Admin
Mở `/admin` và dùng email + mật khẩu Supabase đã tạo.

## 4. Chuyển dữ liệu cũ
Sau khi đăng nhập Admin, vào Cài đặt → bấm `Đồng bộ dữ liệu cũ từ trình duyệt này` để đưa dữ liệu đang có trong trình duyệt hiện tại lên Database.

## Lưu ý
Không đặt `service_role` key vào Vercel frontend. Chỉ dùng publishable/anon key.
