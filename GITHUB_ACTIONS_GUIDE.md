# Hướng dẫn sử dụng GitHub Actions để build APK

## Tổng quan

Dự án này bao gồm một workflow GitHub Actions để tự động build APK Android cho ứng dụng tài chính thông minh Pham Tuan. Workflow này sẽ chạy mỗi khi bạn push code lên nhánh `main`.

## Cấu hình GitHub Actions

Workflow được định nghĩa trong file `.github/workflows/android-apk-build.yml`. Nó bao gồm các bước sau:

1. Checkout code từ repository
2. Cài đặt Node.js phiên bản 20
3. Cài đặt các dependencies của dự án
4. Build ứng dụng React
5. Cài đặt và đồng bộ nền tảng Android với Capacitor
6. Setup Java và Android SDK
7. Build APK Android
8. Upload APK thành artifact

## Cách sử dụng

### Bước 1: Fork repository

Fork repository này về tài khoản GitHub của bạn.

### Bước 2: Push code

Push code của bạn lên nhánh `main` của repository đã fork.

### Bước 3: Theo dõi Actions

1. Truy cập repository của bạn trên GitHub
2. Click vào tab "Actions"
3. Bạn sẽ thấy workflow đang chạy hoặc đã hoàn tất

### Bước 4: Tải APK

1. Sau khi workflow hoàn tất, click vào workflow đó
2. Cuộn xuống phần "Artifacts"
3. Click vào "android-apk" để tải file APK

## Lưu ý quan trọng về bảo mật

Workflow này đã được cấu hình để không yêu cầu API Keys trong quá trình build. API Keys sẽ được người dùng nhập khi sử dụng ứng dụng trên thiết bị của họ, đảm bảo rằng:

- Không có API Keys nào được lưu trữ trong repository
- Không có API Keys nào được đưa vào quá trình build
- Người dùng quản lý API Keys của riêng họ

## Troubleshooting

Nếu workflow gặp lỗi:

1. Kiểm tra log trong tab Actions để xem chi tiết lỗi
2. Đảm bảo tất cả các file cần thiết tồn tại
3. Kiểm tra xem dependencies trong `package.json` có cập nhật không

## Tùy chỉnh

Nếu bạn muốn thêm các bước tùy chỉnh vào quá trình build:

- Chỉnh sửa file `.github/workflows/android-apk-build.yml`
- Có thể thêm kiểm thử, phân tích code, hoặc các bước xác thực khác

## Production Build

Ngoài workflow build APK, repository còn có workflow `production-build.yml` sẽ chạy khi bạn tạo tag bắt đầu bằng `v` (ví dụ: `v1.0.0`). Workflow này sẽ tạo một bản release chính thức.