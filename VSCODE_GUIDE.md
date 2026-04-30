# Hướng dẫn làm việc với dự án trong VS Code

## Thiết lập ban đầu

1. Mở Visual Studio Code
2. Chọn "File" → "Open Folder"
3. Chọn thư mục `c:\Users\tuanp\Downloads\pham-tuan-financial`

## Cài đặt extensions đề xuất

Mở tab Extensions (Ctrl+Shift+X) và cài đặt các extension sau:

- `esbenp.prettier-vscode` - Định dạng code
- `bradlc.vscode-tailwindcss` - Hỗ trợ Tailwind CSS
- `ms-vscode.vscode-typescript-next` - Hỗ trợ TypeScript
- ` formulahendry.auto-rename-tag` - Tự động đổi tên cặp thẻ HTML
- ` capbolt.capacitor-tools` - Công cụ hỗ trợ Capacitor

## Mở integrated terminal trong VS Code

1. Nhấn `Ctrl + Shift + P` để mở Command Palette
2. Gõ "Terminal: Create New Terminal" và nhấn Enter
3. Hoặc dùng phím tắt `Ctrl + `` (dấu ngã)

## Cài đặt và chạy dự án

1. Mở terminal trong VS Code (Ctrl + ``)
2. Chạy lệnh để cài đặt dependencies:

```bash
npm install
```

3. Chạy ứng dụng ở chế độ phát triển:

```bash
npm run dev
```

## Build cho Android

1. Mở terminal trong VS Code
2. Build ứng dụng web:

```bash
npm run build
```

3. Đồng bộ với nền tảng Android:

```bash
npx cap sync android
```

4. Mở trong Android Studio (nếu đã cài):

```bash
npx cap open android
```

## Làm việc với Git trong VS Code

### Kiểm tra trạng thái Git
- Mở tab Source Control (Ctrl+Shift+G)
- Hoặc mở Command Palette (Ctrl+Shift+P) và gõ "Git: Show Git Graph"

### Commit thay đổi
1. Trong tab Source Control, bạn sẽ thấy các file đã thay đổi
2. Nhấp vào dấu "+" để stage các thay đổi
3. Nhập commit message vào ô văn bản
4. Nhấn Ctrl+Enter để commit

### Push lên remote repository
1. Mở Command Palette (Ctrl+Shift+P)
2. Gõ "Git: Push" và chọn lệnh
3. Hoặc dùng shortcut: Ctrl+Shift+P rồi gõ "Terminal: Create New Terminal" và chạy lệnh:

```bash
git push origin main
```

## Các lối tắt hữu ích trong VS Code

- `Ctrl + Shift + P` - Mở Command Palette
- `Ctrl + P` - Mở nhanh file
- `Ctrl + Shift + G` - Mở Git
- `Ctrl + `` - Mở/đóng terminal
- `Ctrl + Shift + M` - Mở Problems panel

## Debug ứng dụng

1. Mở tab Run and Debug (Ctrl+Shift+D)
2. Chọn "Run and Debug" hoặc nhấn F5 để chạy ứng dụng
3. Có thể thiết lập breakpoints bằng cách nhấn vào số dòng

## Mở rộng tùy chọn

Bạn có thể thêm cấu hình cho VS Code bằng cách tạo file `.vscode/settings.json` trong thư mục dự án:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "files.associations": {
    "*.js": "javascript",
    "*.jsx": "javascript",
    "*.ts": "typescript",
    "*.tsx": "typescriptreact"
  }
}
```

## Tạo và chuyển đổi giữa các nhánh

1. Mở Command Palette (Ctrl+Shift+P)
2. Gõ "Git: Create Branch" để tạo nhánh mới
3. Gõ "Git: Checkout to" để chuyển đổi giữa các nhánh

## Troubleshooting

Nếu gặp lỗi liên quan đến Git trong VS Code:
1. Kiểm tra xem Git có được cài đặt đúng không bằng cách mở terminal và chạy `git --version`
2. Trong VS Code, mở Command Palette và gõ "Git: Specify Path" để xác định đường dẫn đến git.exe
3. Đường dẫn thường là: `C:\Program Files\Git\bin\git.exe`