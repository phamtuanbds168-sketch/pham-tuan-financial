<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Ứng dụng tài chính thông minh Pham Tuan

Ứng dụng tài chính cá nhân tích hợp trí tuệ nhân tạo giúp bạn quản lý tài chính hiệu quả hơn.

## Tính năng nổi bật

- Theo dõi tài sản và công nợ
- Phân tích tài chính thông minh với AI
- Ghi chú tài chính cá nhân
- Kết nối với Gemini và DeepSeek AI
- Giao diện thân thiện, dễ sử dụng

## Yêu cầu hệ thống

- Node.js 18 hoặc cao hơn
- Android Studio (đối với build Android)
- Tài khoản Google Cloud với API key cho Gemini

## Cài đặt và chạy ứng dụng

1. Clone hoặc tải về dự án:

```bash
git clone <repository_url>
cd pham-tuan-financial
```

2. Cài đặt các gói phụ thuộc:

```bash
npm install
```

3. Chạy ứng dụng ở chế độ phát triển:

```bash
npm run dev
```

## Build APK cho Android

Có hai cách để build APK:

### Cách 1: Sử dụng GitHub Actions (đề xuất)

1. Fork repository này về tài khoản GitHub của bạn
2. Push code lên nhánh `main`
3. GitHub Actions sẽ tự động build APK và tạo artifact để bạn tải về
   - Vào tab "Actions" để theo dõi tiến trình build
   - Sau khi build xong, bạn có thể tải APK từ phần "Artifacts"

### Cách 2: Build thủ công trên máy local

1. Đảm bảo bạn đã cài đặt Android Studio và cấu hình SDK

2. Cài đặt các công cụ Capacitor:

```bash
npm install @capacitor/android
npx cap add android
```

3. Build ứng dụng:

```bash
npm run build
```

4. Đồng bộ hóa với nền tảng Android:

```bash
npx cap sync android
```

5. Mở ứng dụng trong Android Studio:

```bash
npx cap open android
```

6. Trong Android Studio, bạn có thể build APK bằng cách:
   - Chọn "Build" → "Build Bundle(s) / APK(s)" → "Build APK"

## Bảo mật

- API Keys được lưu trữ cục bộ trên thiết bị của người dùng, không được truyền lên máy chủ
- Không có API Keys nào được nhúng trực tiếp vào mã nguồn hay build
- Người dùng tự chịu trách nhiệm quản lý API Keys của mình trong phần cài đặt của ứng dụng

## Cấu trúc dự án

```
src/
├── screens/          # Các màn hình ứng dụng
├── types/            # Định nghĩa kiểu TypeScript
├── lib/              # Thư viện hỗ trợ
├── components/       # Component chung
├── App.tsx           # Component chính
└── main.tsx          # Điểm vào ứng dụng
```

## Công nghệ sử dụng

- React 19
- TypeScript
- Capacitor (cho ứng dụng native)
- Firebase Firestore
- Google Gemini API
- DeepSeek API
- TailwindCSS
- Recharts