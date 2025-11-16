# Chatbot Utils - Công cụ hỗ trợ chatbot

## 📱 Mô tả ứng dụng

**Chatbot Utils** là một ứng dụng web đơn giản xây dựng bằng **Vue 3** (không có build process) và **Tailwind CSS CDN**. Ứng dụng giúp quản lý các tiện ích cho chatbot, đặc biệt là chức năng tạo và quản lý nhắc nhở.

## ✨ Tính năng chính

1. **Tạo nhắc nhở** - Tạo nhắc nhở cho các thành viên với:
   - 👤 Chọn người nhận nhắc nhở (danh sách người có sẵn)
   - 📝 Nhập nội dung nhắc nhở
   - 🕐 Chọn thời gian nhắc nhở (sử dụng datetime-local input)
   - 🔄 Chọn kiểu lặp lại (không lặp, mỗi ngày, mỗi tuần, mỗi tháng)
   - ✓ Lưu nhắc nhở vào danh sách

2. **Quản lý nhắc nhở** - Xem danh sách tất cả nhắc nhở đã tạo với:
   - 📋 Hiển thị tất cả thông tin nhắc nhở (người, nội dung, thời gian, kiểu lặp)
   - 🗑️ Nút xóa nhắc nhở với xác nhận

3. **Giới thiệu** - Trang giới thiệu ứng dụng với:
   - 🎯 Mô tả về ứng dụng
   - ✨ Liệt kê tính năng chính
   - 💻 Công nghệ sử dụng
   - 📌 Hướng dẫn sử dụng chi tiết

## 🏗️ Cấu trúc ứng dụng

```
botui/
├── index.html          # File HTML chính (toàn bộ ứng dụng)
└── README.md           # Tài liệu này
```

## 💻 Công nghệ sử dụng

- **Vue 3** - JavaScript framework (sử dụng CDN global build)
- **Tailwind CSS** - Utility-first CSS framework (sử dụng CDN)
- **JavaScript ES6+** - Vanilla JavaScript

## 🚀 Cách sử dụng

### Yêu cầu
- Trình duyệt web hiện đại hỗ trợ ES6 (Chrome, Firefox, Safari, Edge)
- Kết nối internet để tải CDN (Vue 3, Tailwind CSS)

### Chạy ứng dụng
1. Mở file `index.html` trực tiếp trong trình duyệt
2. Hoặc sử dụng một local server:
   ```bash
   # Sử dụng Python
   python3 -m http.server 8000
   
   # Hoặc sử dụng Node.js (cần cài npm)
   npx http-server
   ```
3. Truy cập http://localhost:8000 (hoặc port tương ứng)

## 📌 Hướng dẫn sử dụng ứng dụng

### Tạo nhắc nhở
1. Từ menu, click nút **"Tạo nhắc nhở"**
2. Điền các thông tin:
   - **Chọn người**: Chọn từ danh sách người (Nguyễn Văn A, Trần Thị B, Phạm Văn C, Hoàng Thị D)
   - **Nội dung**: Nhập nội dung nhắc nhở cần gửi
   - **Thời gian**: Chọn ngày giờ nhắc nhở
   - **Kiểu lặp**: Chọn "Không lặp", "Mỗi ngày", "Mỗi tuần", hoặc "Mỗi tháng"
3. Click **"✓ Tạo nhắc nhở"** để lưu
4. Nhắc nhở sẽ xuất hiện trong danh sách trên menu

### Quản lý nhắc nhở
- Danh sách nhắc nhở hiển thị trên trang menu (khi có ít nhất 1 nhắc nhở)
- Click nút **"Xóa"** để xóa một nhắc nhở

### Xem giới thiệu
1. Từ menu, click nút **"Giới thiệu"**
2. Xem thông tin chi tiết về ứng dụng
3. Click **"← Quay lại Menu"** để quay về menu chính

## 📱 Responsive Design

Ứng dụng được thiết kế responsive cho tất cả kích thước màn hình:
- 📱 Điện thoại di động (320px+)
- 📱 Tablet (768px+)
- 💻 Máy tính để bàn (1024px+)
- 🔗 WebView trên ứng dụng di động

Sử dụng Tailwind CSS grid system:
- Mobile: 1 cột
- Tablet+: 2 cột cho các button trên menu

## 🎨 Giao diện

- **Header**: Gradient xanh dương, hiển thị logo và tiêu đề
- **Menu**: 2 nút chính (Tạo nhắc nhở, Giới thiệu)
- **Danh sách**: Hiển thị nhắc nhở với border trái màu xanh
- **Form**: Sử dụng các input phù hợp (select, textarea, datetime-local, radio)
- **Footer**: Thông tin bản quyền

## 🔧 Cấu trúc Vue Data

```javascript
data() {
  return {
    currentPage: 'menu',           // Trang hiện tại (menu, createReminder, about)
    reminders: [],                 // Danh sách nhắc nhở
    formData: {
      person: '',                  // Người được nhắc nhở
      content: '',                 // Nội dung nhắc nhở
      time: '',                    // Thời gian nhắc nhở
      repeatType: 'none'           // Kiểu lặp lại
    },
    people: [...]                  // Danh sách người có sẵn
    repeatTypes: [...]             // Danh sách kiểu lặp lại
  }
}
```

## 📝 Các phương thức Vue

- `goToMenu()` - Quay lại trang menu
- `goToCreateReminder()` - Chuyển sang trang tạo nhắc nhở
- `goToAbout()` - Chuyển sang trang giới thiệu
- `resetForm()` - Reset form nhắc nhở
- `createReminder()` - Tạo nhắc nhở mới
- `deleteReminder(id)` - Xóa nhắc nhở theo ID

## 🌐 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## 📦 Phát triển tiếp theo

### Các tính năng có thể thêm vào:
- 💾 Lưu nhắc nhở vào localStorage
- 🔔 Gửi thông báo khi đến thời gian nhắc nhở
- 📧 Gửi email hoặc tin nhắn nhắc nhở
- 👥 Thêm/sửa danh sách người
- 📊 Thống kê nhắc nhở
- 🌙 Dark mode
- 🌐 Đa ngôn ngữ
- ✏️ Sửa nhắc nhở đã tạo

## 📄 Giấy phép

Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Phiên bản**: 1.0.0  
**Ngày tạo**: 2025-11-16  
**Tác giả**: Chatbot Utils Team
