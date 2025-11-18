# 🎉 Chức Năng Kỷ Niệm - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Chức năng **Kỷ Niệm** cho phép bạn lưu trữ và quản lý những kỷ niệm đặc biệt với hình ảnh, mô tả chi tiết, và tự động tính toán ngày còn lại đến sự kiện.

### ✨ Tính Năng Chính

- **📸 Lưu trữ hình ảnh:** Tải lên hình ảnh và lưu dưới dạng Base64 trong IndexedDB
- **📝 Quản lý thông tin:** Tiêu đề, mô tả, và ngày sự kiện
- **⏳ Tính toán ngày:** Tự động hiển thị "Hôm nay", "Ngày mai", "Cách N ngày"
- **🔍 Tìm kiếm:** Tìm kiếm theo tiêu đề hoặc mô tả
- **📚 Vô hạn cuộn:** Lazy load kỷ niệm khi cuộn xuống
- **💾 Lưu trữ ngoại tuyến:** Dữ liệu lưu trong IndexedDB, hoạt động mà không cần internet
- **✏️ Chỉnh sửa/Xóa:** Cập nhật hoặc xóa kỷ niệm dễ dàng

---

## 🗂️ Cấu Trúc File

```
src/
├── services/
│   └── memoriesService.js          # Quản lý IndexedDB
├── composables/
│   └── useMemories.js              # Logic state & CRUD
├── pages/
│   └── MemoriesPage.js             # Trang chính
└── components/
    ├── MemoryCard.js               # Card kỷ niệm
    └── AddMemoryModal.js           # Modal thêm/sửa
```

---

## 🏗️ Chi Tiết Các Module

### 1. **memoriesService.js** (Dịch Vụ Lưu Trữ)

Quản lý toàn bộ lưu trữ IndexedDB.

#### Hàm Chính:

```javascript
// Tạo kỷ niệm mới
await memoriesService.createMemory({
  title: 'Tiêu đề',
  text: 'Mô tả',
  eventDate: '2024-12-05', // YYYY-MM-DD
  imageBase64: 'data:image/jpeg;base64,...'
});

// Cập nhật kỷ niệm
await memoriesService.updateMemory(id, {
  title: 'Tiêu đề mới'
});

// Xóa kỷ niệm
await memoriesService.deleteMemory(id);

// Lấy tất cả (sắp xếp theo ngày sự kiện)
const all = await memoriesService.getAllMemories();

// Tìm kiếm
const results = await memoriesService.searchMemories('từ khóa');

// Chuyển file thành Base64
const base64 = await memoriesService.fileToBase64(file);

// Tính ngày còn lại
const info = memoriesService.calculateDaysRemaining('2024-12-05');
// Trả về: { days: 10, label: 'Cách 10 ngày', dateFormatted: '05/12/2024' }
```

#### Schema IndexedDB:

```javascript
{
  id: 1234567890,
  title: 'Tiêu đề',
  text: 'Mô tả chi tiết',
  eventDate: '2024-12-05',
  imageBase64: 'data:image/jpeg;base64,...',
  createdAt: '2024-11-18T10:30:00.000Z',
  updatedAt: '2024-11-18T10:30:00.000Z'
}
```

---

### 2. **useMemories.js** (Composable)

Quản lý state và logic ứng dụng.

#### State:

```javascript
const {
  // Data
  memories,              // Tất cả kỷ niệm
  filteredMemories,      // Kỷ niệm hiện đang hiển thị
  searchQuery,           // Text tìm kiếm
  
  // UI State
  isLoading,             // Đang tải/lưu
  isLoadingMore,         // Đang load thêm
  errorMessage,          // Thông báo lỗi
  successMessage,        // Thông báo thành công
  
  // Modal State
  showAddModal,          // Hiển thị modal
  editingMemory,         // ID kỷ niệm đang sửa
  formData: {
    title,               // Tiêu đề
    text,                // Mô tả
    eventDate,           // Ngày sự kiện
    imageBase64          // Ảnh Base64
  }
} = useMemories();
```

#### Hàm:

```javascript
// Load tất cả kỷ niệm
await loadMemories();

// Tìm kiếm (sử dụng searchQuery)
await searchMemories();

// Load thêm (infinite scroll)
await loadMore();

// Modal handlers
openAddModal();           // Mở modal thêm mới
openEditModal(memory);    // Mở modal sửa
closeModal();             // Đóng modal

// Form handlers
handleImageUpload(file);  // Xử lý upload ảnh
removeImage();            // Xóa ảnh hiện tại

// Save/Delete
await saveMemory();       // Lưu (thêm hoặc sửa)
await deleteMemory(id);   // Xóa

// Helpers
hasMore();               // Kiểm tra có thêm kỷ niệm không
```

---

### 3. **MemoriesPage.js** (Trang Chính)

Giao diện chính cho kỷ niệm.

**Features:**
- Search box với nút tìm kiếm
- Nút "Thêm kỷ niệm mới"
- Grid hiển thị memory cards (responsive: 1 cột mobile, 2 cột tablet, 3 cột desktop)
- Nút "Xem thêm" cho infinite scroll
- Loading state và empty state
- Thông báo lỗi/thành công

---

### 4. **MemoryCard.js** (Card Kỷ Niệm)

Card hiển thị một kỷ niệm.

**Hiển thị:**
```
┌─────────────────────────────────────┐
│ 🎉 Tiêu đề              [✏️ Sửa]   │
├─────────────────────────────────────┤
│ 05/12/2024 • Cách 10 ngày           │
├─────────────────────────────────────┤
│ [Ảnh nếu có]                        │
├─────────────────────────────────────┤
│ Mô tả chi tiết...                   │
│ [Xem thêm] nếu text quá dài         │
├─────────────────────────────────────┤
│                      [🗑️ Xóa]      │
└─────────────────────────────────────┘
```

**Features:**
- Hiển thị tiêu đề với emoji kỷ niệm
- Hiển thị ngày sự kiện (dd/mm/yyyy)
- Tính toán và hiển thị ngày còn lại
- Ảnh (nếu có) - responsive
- Text (collapsible nếu > 200 ký tự)
- Nút chỉnh sửa và xóa

---

### 5. **AddMemoryModal.js** (Modal Thêm/Sửa)

Form modal để thêm hoặc chỉnh sửa kỷ niệm.

**Form Fields:**
- **Tiêu đề** (required) - Text input
- **Ngày sự kiện** (required) - Date picker
- **Mô tả** - Textarea
- **Hình ảnh** - File upload + preview

**Features:**
- Tự động phát hiện add vs edit mode
- Preview ảnh trước khi lưu
- Nút xóa ảnh
- Error/success messages
- Nút Cancel/Save
- Disabled state khi đang lưu

---

## 📱 Quy Trình Sử Dụng

### Thêm Kỷ Niệm

1. Click nút "➕ Thêm" hoặc từ menu chính
2. Modal mở lên
3. Nhập tiêu đề (bắt buộc)
4. Chọn ngày sự kiện (bắt buộc)
5. Nhập mô tả (tùy chọn)
6. Upload ảnh (tùy chọn)
7. Click "Thêm"
8. Modal đóng, danh sách refresh

### Sửa Kỷ Niệm

1. Click nút ✏️ trên card
2. Modal mở với dữ liệu cũ
3. Sửa các trường cần thiết
4. Upload ảnh mới (nếu muốn)
5. Click "Cập nhật"
6. Modal đóng, danh sách refresh

### Xóa Kỷ Niệm

1. Click nút 🗑️ trên card
2. Confirm xóa
3. Kỷ niệm bị xóa khỏi database

### Tìm Kiếm

1. Nhập từ khóa trong search box
2. Click nút 🔍 hoặc Enter
3. Danh sách lọc theo kết quả

### Xem Thêm (Infinite Scroll)

1. Cuộn xuống đến cuối
2. Click nút "Xem thêm kỷ niệm"
3. Thêm 10 kỷ niệm được tải

---

## 🔧 Khôi Phục & Cấu Hình

### Xóa Tất Cả Dữ Liệu (Dev Only)

```javascript
import { memoriesService } from './services/memoriesService.js';

await memoriesService.clearAllMemories();
```

### Điều Chỉnh Kích Thước Trang

Trong `useMemories.js`:
```javascript
const pageSize = 10; // Thay đổi số kỷ niệm mỗi trang
```

### Điều Chỉnh Độ Dài Text Trước Khi "Xem Thêm"

Trong `MemoryCard.js`:
```javascript
if (memory.text && memory.text.length > 200) { // Thay 200 bằng số khác
```

---

## 🐛 Ghi Chú & Vấn Đề Thường Gặp

### Q: Hình ảnh không lưu được?
**A:** Kiểm tra:
- Kích thước file (nên < 5MB)
- Format file (JPEG, PNG, GIF)
- Trình duyệt hỗ trợ IndexedDB (Chrome, Firefox, Safari, Edge)

### Q: Mất dữ liệu khi xóa cache trình duyệt?
**A:** Đúng - IndexedDB là storage ngoại tuyến của trình duyệt. Xóa cache = xóa dữ liệu.

### Q: Làm sao backup dữ liệu?
**A:** Export từ IndexedDB (cần code custom) hoặc đợi feature export-to-JSON.

### Q: Tìm kiếm có phân biệt hoa/thường không?
**A:** Không - tìm kiếm case-insensitive.

### Q: Có thể sắp xếp theo ngày tạo không?
**A:** Hiện tại theo ngày sự kiện. Có thể mở rộng với lựa chọn sort sau này.

---

## 🚀 Phát Triển Tiếp

Các feature có thể thêm sau:

- [ ] Export kỷ niệm thành JSON/CSV
- [ ] Import kỷ niệm từ file
- [ ] Tag/Category cho kỷ niệm
- [ ] Sắp xếp theo ngày tạo/sửa/sự kiện
- [ ] Filter theo date range
- [ ] Attachment (video, document)
- [ ] Chia sẻ kỷ niệm (QR code, link)
- [ ] Gallery view
- [ ] Timeline view

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console (F12) cho error messages
2. Xóa cache trình duyệt và thử lại
3. Kiểm tra quota IndexedDB (DevTools > Storage > IndexedDB)

---

**Last Updated:** November 18, 2025
**Status:** ✅ Fully Functional
