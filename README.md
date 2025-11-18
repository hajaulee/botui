# Chatbot Utils - Công cụ hỗ trợ chatbot

> 📖 **Contributing?** Please read [CONTRIBUTION_GUIDELINES.md](./CONTRIBUTION_GUIDELINES.md) before making changes!

## 📱 Mô tả ứng dụng

**Chatbot Utils** là một ứng dụng web Progressive Web App (PWA) xây dựng bằng **Vue 3** (Composition API, không có build process) và **Tailwind CSS CDN**. Ứng dụng giúp quản lý các tiện ích cho chatbot với các tính năng như nhắc nhở, quản lý cây gia phả, và sự kiện âm lịch.

## ✨ Tính năng chính

### 1. 📝 Tạo và quản lý nhắc nhở
- 👤 Chọn người nhận nhắc nhở từ danh sách
- 📝 Nhập nội dung nhắc nhở
- 🕐 Chọn thời gian nhắc nhở (datetime-local)
- 🔄 Chọn kiểu lặp lại (không lặp, mỗi ngày, mỗi tuần, mỗi tháng, ngày trong tuần, cuối tuần)
- 📋 Xem danh sách tất cả nhắc nhở
- 🗑️ Xóa nhắc nhở
- 📦 Cache localStorage - Lấy cache ngay, cập nhật từ API ở background
- ⏱️ Loading overlay xanh dương khi tạo/xóa

### 2. 👨‍👩‍👧‍👦 Quản lý cây gia phả
- 👤 Chọn người (Doha, Leha)
- 🌳 Nhập cây gia phả với định dạng indentation (dấu cách)
- 📊 Hiển thị cây gia phả dạng ASCII với ký tự:
  - `├──` - Nhánh không phải cuối cùng
  - `└──` - Nhánh cuối cùng
  - `│` - Đường kéo dài
- 🎨 Font monospace (Roboto Mono) để hiển thị đúng
- 📜 Scroll ngang nếu cây dài
- 💾 Nút lưu cây gia phả
- 📦 Cache localStorage theo từng người
- ⏱️ Loading overlay khi load

### 3. 📅 Sự kiện âm lịch
- 📋 Danh sách sự kiện âm lịch với tính toán ngày khoảng cách động
- � Nhập sự kiện theo format: `ngày/tháng: tên sự kiện`
- 🎯 Trạng thái ngày:
  - "Hôm nay" - Sự kiện hôm nay
  - "Ngày mai" - Sự kiện ngày mai
  - "Cách N ngày" - Sự kiện còn N ngày
  - "Đã qua N ngày" - Sự kiện đã qua
- 📅 Hiển thị tương ứng dương lịch
- 💾 Nút lưu sự kiện
- ⚠️ **Không cache** - Parse mỗi lần load để tính toán ngày chính xác

### 4. ℹ️ Giới thiệu
- 🎯 Mô tả về ứng dụng
- ✨ Liệt kê tính năng chính
- 💻 Công nghệ sử dụng
- 📌 Hướng dẫn sử dụng chi tiết

## 🏗️ Cấu trúc ứng dụng

```
botui/
├── index.html                    # File HTML chính (toàn bộ ứng dụng)
├── lunar-solar-converter.js      # Thư viện convert âm lịch ↔ dương lịch
├── README.md                     # Tài liệu này
└── lunar-solar-converter.js      # Dependency cho tính năng sự kiện
```

## 💻 Công nghệ sử dụng

- **Vue 3** - JavaScript framework (CDN global build, Composition API)
- **Tailwind CSS** - Utility-first CSS framework (CDN)
- **Roboto Mono** - Google Fonts cho font monospace
- **JavaScript ES6+** - Vanilla JavaScript
- **localStorage API** - Cache dữ liệu trên client
- **Fetch API** - Gọi API không xây dựng

## � API Integration

Ứng dụng tích hợp với Google Apps Script API:

### Reminders (Nhắc nhở)
- `msg=list_remind&userId={userId}` - Lấy danh sách nhắc nhở
- `msg=remind {person} {datetime} {content} !repeat {type}&userId={userId}` - Tạo nhắc nhở
- `msg=remove_remind {id}&userId={userId}` - Xóa nhắc nhở

### Family Tree (Cây gia phả)
- `target=family&action=get&username={username}` - Lấy cây gia phả
- `target=family&action=save&username={username}&content={content}` - Lưu cây gia phả

### Lunar Events (Sự kiện âm lịch)
- `target=lunarEvents&action=get&username=common` - Lấy sự kiện âm lịch
- `target=lunarEvents&action=save&username=common&content={content}` - Lưu sự kiện âm lịch

## 📦 Cache Strategy

### Reminders
- ✅ Cache: Lấy từ cache ngay, cập nhật từ API ở background
- 🔑 Cache key: Query string của URL API

### Family Tree
- ✅ Cache: Lấy từ cache ngay, cập nhật từ API ở background
- 🔑 Cache key: Query string của URL API
- 👤 Riêng biệt cho mỗi người

### Lunar Events
- ❌ Không cache: Cần parse mỗi lần để tính ngày chính xác
- 🔄 Always fresh data

## �🚀 Cách sử dụng

### Yêu cầu
- Trình duyệt web hiện đại hỗ trợ ES6 (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- Kết nối internet để tải CDN (Vue 3, Tailwind CSS, Roboto Mono)
- Google Apps Script API endpoint được cấu hình

### Chạy ứng dụng
1. Mở file `index.html` trực tiếp trong trình duyệt
2. Hoặc sử dụng local server:
   ```bash
   # Sử dụng Python
   python3 -m http.server 8000
   
   # Hoặc sử dụng Node.js
   npx http-server
   ```
3. Truy cập http://localhost:8000

### Cấu hình ứng dụng
Truyền thông qua URL parameters:
```
?apiId=YOUR_APP_ID&userId=YOUR_USER_ID&username=YOUR_USERNAME&page=menu
```

Hoặc sẽ lấy từ localStorage nếu có, fallback default values

## 📌 Hướng dẫn sử dụng ứng dụng

### Tạo nhắc nhở
1. Click **"📝 Tạo nhắc nhở"** từ menu
2. Chọn người nhận nhắc nhở
3. Nhập nội dung nhắc nhở
4. Chọn thời gian nhắc nhở
5. Chọn kiểu lặp lại
6. Click **"✓ Tạo nhắc nhở"**
7. Xem danh sách nhắc nhở trên trang

### Quản lý cây gia phả
1. Click **"👨‍👩‍👧‍👦 Họ hàng"** từ menu
2. Chọn người từ dropdown
3. Cây gia phả sẽ tải tự động
4. Chỉnh sửa cây gia phả dưới (dùng dấu cách để tạo cấp độ)
5. Xem cây hiển thị ở trên
6. Click **"💾 Lưu cây gia phả"** để lưu

### Quản lý sự kiện âm lịch
1. Click **"📅 Sự kiện âm lịch"** từ menu
2. Sự kiện sẽ tải và hiển thị danh sách
3. Nhập sự kiện mới ở dưới (định dạng: `ngày/tháng: tên sự kiện`)
4. Danh sách sẽ cập nhật realtime
5. Click **"💾 Lưu sự kiện âm lịch"** để lưu

### Xem giới thiệu
1. Click **"ℹ️ Giới thiệu"** từ menu
2. Xem thông tin chi tiết về ứng dụng

## 📱 Responsive Design

- 📱 Điện thoại di động (320px+)
- 📱 Tablet (768px+)
- 💻 Máy tính để bàn (1024px+)
- 🔗 WebView trên ứng dụng di động

Sử dụng Tailwind CSS grid:
- Mobile: 1 cột
- Tablet+: 3 cột cho menu buttons

## 🎨 Giao diện

- **Header**: Gradient indigo, logo, tiêu đề, tên người dùng
- **Menu**: 4 nút (Tạo nhắc nhở-xanh, Họ hàng-xanh lá, Sự kiện-cam, Giới thiệu-tím)
- **Loading**: Overlay semi-transparent với spinner
- **Form**: Input phù hợp (select, textarea, datetime-local, radio)
- **Font**: Roboto Mono từ Google Fonts cho monospace text
- **Footer**: Thông tin bản quyền

## 🔧 Cấu trúc Vue Data

```javascript
// Reminders
reminders: [],
formData: { person, content, time, repeatType }

// Family Tree
familyPerson: 'leha',
familyText: '',
familyTree: ''

// Lunar Events
lunarEvents: [],
lunarEventsInput: ''

// Loading States
isLoading, isDeleting, isCreating, isFamilyLoading, isLunarEventLoading
```

## 🌐 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## 📦 Phát triển tiếp theo

### Các tính năng có thể thêm vào:
- 🌞 Sự kiện dương lịch (riêng biệt với sự kiện âm lịch)
- ✏️ Chỉnh sửa nhắc nhở
- 📊 Thống kê sự kiện
- 🌙 Dark mode
- 🌐 Đa ngôn ngữ
- 🔔 Web push notifications
- 📱 PWA manifest
- 🔐 User authentication

## 📄 Giấy phép

Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Phiên bản**: 2.0.0  
**Cập nhật**: 2025-11-17  
**Tác giả**: Chatbot Utils Team
