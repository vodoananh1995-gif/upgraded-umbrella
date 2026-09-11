# Tiệm Ảnh Capy — website React/Vite

Bản source mô phỏng trải nghiệm của website tham chiếu: trang thuê máy ảnh với giao diện editorial tối giản, lọc máy, bảng giá, chính sách và popup giữ chỗ.

## Chạy local
```bash
npm install
npm run dev
```

## Build production
```bash
npm run build
```

## Tuỳ chỉnh nhanh
- Danh sách máy: `src/main.jsx` → `cameras`
- Bảng giá: `rentalPlans`
- Ảnh mẫu: `sampleImages`
- Hotline / Zalo / Messenger: thay các placeholder trong phần `Liên hệ`
- QR Zalo: thay `.qrPlaceholder` bằng thẻ `<img>` QR thật
- Màu, font, khoảng cách: `src/styles.css`

Các ảnh demo dùng URL Unsplash để bạn thấy giao diện ngay. Khi triển khai thật, nên tải ảnh máy và ảnh chụp của tiệm về `public/images/` rồi thay đường dẫn.
