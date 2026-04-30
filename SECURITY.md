# Chính sách bảo mật cho Ứng dụng tài chính Pham Tuan

## Quan trọng: Về API Keys

Ứng dụng này yêu cầu bạn cung cấp API Keys cho các dịch vụ bên thứ ba như Google Gemini và DeepSeek. Xin lưu ý:

1. **API Keys được lưu trữ cục bộ** trên thiết bị của bạn, không được gửi đến bất kỳ máy chủ nào khác ngoài các dịch vụ AI tương ứng.

2. **Không chia sẻ API Keys** của bạn với bất kỳ ai. Việc tiết lộ API Keys có thể dẫn đến:
   - Chi phí bất ngờ do sử dụng dịch vụ AI
   - Truy cập trái phép vào tài khoản dịch vụ của bạn
   - Dữ liệu tài chính cá nhân có thể bị truy cập

## Cách bảo vệ API Keys

- Không commit API Keys vào kho mã nguồn
- Không chia sẻ nội dung tệp `.env.local` hoặc trình duyệt nơi bạn nhập API Keys
- Luôn đăng xuất sau khi sử dụng ứng dụng trên thiết bị công cộng
- Kiểm tra định kỳ giới hạn sử dụng API trong tài khoản Google Cloud của bạn

## Quyền riêng tư dữ liệu

- Dữ liệu tài chính cá nhân của bạn được lưu trữ trong Firestore database của riêng bạn
- Chỉ bạn (và bất kỳ dịch vụ nào bạn kết nối) có quyền truy cập vào dữ liệu này
- Ứng dụng không lưu trữ dữ liệu người dùng ở bất kỳ nơi nào khác ngoài Firestore

## Báo cáo sự cố bảo mật

Nếu bạn phát hiện bất kỳ lỗ hổng bảo mật nào trong ứng dụng, vui lòng liên hệ ngay với chúng tôi qua email: security@phamtuan-financial.com

## Cập nhật bảo mật

Chúng tôi thường xuyên cập nhật ứng dụng để đảm bảo an ninh tốt nhất. Đề nghị bạn luôn cập nhật phiên bản mới nhất của ứng dụng.