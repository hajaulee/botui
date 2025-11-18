# Botui - Refactored Architecture

## 🎯 Cấu Trúc Mới

Dự án đã được refactor từ một component lớn thành một cấu trúc modular với các thành phần riêng biệt.

```
botui/
├── index.html                 # Entry point chính
├── src/
│   ├── App.js                # Component cha, quản lý routing
│   ├── pages/                # Các page (component chính)
│   │   ├── MenuPage.js       # Menu chính
│   │   ├── ReminderPage.js   # Tạo & quản lý nhắc nhở
│   │   ├── FamilyPage.js     # Quản lý cây gia phả
│   │   ├── LunarEventsPage.js# Quản lý sự kiện âm lịch
│   │   └── AboutPage.js      # Trang giới thiệu
│   ├── composables/          # Composables (reusable logic)
│   │   ├── useReminders.js   # Logic nhắc nhở
│   │   ├── useFamily.js      # Logic cây gia phả
│   │   └── useLunarEvents.js # Logic sự kiện âm lịch
│   ├── services/             # Services (business logic)
│   │   ├── apiService.js     # API calls
│   │   ├── cacheService.js   # Cache management
│   │   ├── reminderService.js# Parse & format reminders
│   │   ├── familyTreeService.js# Parse & render family tree
│   │   └── lunarEventsService.js# Parse lunar events
│   └── utils/                # Utilities
│       └── lunar-solar-converter.js# Convert lunar/solar dates
├── components/               # Shared components (nếu có)
└── utils/                    # Old utils (deprecated)
```

## 🔍 Kiến Trúc Chi Tiết

### 1. **Pages** (`src/pages/`)
Các component chính hiển thị, mỗi file là một page riêng biệt.

Cấu trúc:
```javascript
export default {
  props: { /* props từ App */ },
  emits: ['navigate'], // Emit sự kiện navigate tới App
  template: `/* HTML template */`,
  setup(props, { emit }) {
    // Logic xử lý page
    return { /* state & methods */ };
  }
}
```

**Các Pages:**
- `MenuPage.js`: Hiển thị menu chính với 4 nút chức năng
- `ReminderPage.js`: Tạo & quản lý nhắc nhở
- `FamilyPage.js`: Quản lý cây gia phả
- `LunarEventsPage.js`: Quản lý sự kiện âm lịch
- `AboutPage.js`: Trang giới thiệu

### 2. **Composables** (`src/composables/`)
Các function tái sử dụng chứa state và logic business, tương tự như Vue 3 Composition API.

```javascript
export function useReminders(apiId, userId, username) {
  const reminders = ref([]);
  const isLoading = ref(false);
  
  const fetchReminders = async () => { /* ... */ };
  const createReminder = async () => { /* ... */ };
  
  return { reminders, isLoading, fetchReminders, createReminder };
}
```

**Các Composables:**
- `useReminders.js`: Quản lý state nhắc nhở (fetch, create, delete)
- `useFamily.js`: Quản lý state cây gia phả (load, save, parse)
- `useLunarEvents.js`: Quản lý state sự kiện âm lịch (load, save)

### 3. **Services** (`src/services/`)
Các class/function chứa business logic, không chứa state.

- **apiService.js**: Tất cả API calls được gọi từ Google Apps Script
  - `listReminders()`, `createReminder()`, `deleteReminder()`
  - `loadFamilyTree()`, `saveFamilyTree()`
  - `loadLunarEvents()`, `saveLunarEvents()`

- **cacheService.js**: Quản lý cache trong localStorage
  - `getCacheData()`: Lấy dữ liệu từ cache
  - `setCacheData()`: Lưu dữ liệu vào cache
  - `clearCache()`: Xóa cache

- **reminderService.js**: Parse & format reminder data
  - `parseReminders()`: Parse API response thành reminder objects
  - `formatDateTime()`: Format datetime input
  - `getRepeatLabel()`: Get label cho repeat type

- **familyTreeService.js**: Parse & render cây gia phả
  - `parseAndRender()`: Parse text input thành ASCII tree
  - `validate()`: Validate family tree text

- **lunarEventsService.js**: Parse sự kiện âm lịch
  - `parseLunarEvents()`: Parse text input thành event objects với tính toán ngày

### 4. **App.js** (`src/App.js`)
Component cha chính, quản lý:
- Routing giữa các pages
- Global state (apiId, userId, username)
- Loading overlays (isDeleting, isCreating)
- Header & Footer

## 🔄 Data Flow

```
User Interaction
       ↓
Page Component
       ↓
Composable (state + logic)
       ↓
Service (business logic)
       ↓
API Service (HTTP call) → Google Apps Script
       ↓
Cache Service (save/retrieve)
       ↓
Back to Composable → Update state
       ↓
Page re-renders
```

## 📝 Ví Dụ: Tạo Nhắc Nhở

1. **User clicks** "Tạo nhắc nhở" → `ReminderPage` component
2. **Component** sử dụng `useReminders()` composable
3. **Composable** gọi `apiService.createReminder()`
4. **Service** gửi HTTP request đến Google Apps Script
5. **Response** được parse bởi `ReminderService`
6. **Cache** được cập nhật bởi `CacheService`
7. **Composable** cập nhật state (reminders)
8. **Page** re-render hiển thị reminder mới

## 🚀 Cách Sử Dụng

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="app"></div>
    <script type="module">
        import App from './src/App.js';
        const { createApp } = window.Vue;
        createApp(App).mount('#app');
    </script>
</body>
</html>
```

## ✨ Lợi Ích Của Refactoring

1. **Modular**: Mỗi file có một trách nhiệm duy nhất (SRP)
2. **Reusable**: Composables có thể tái sử dụng trong các components khác
3. **Testable**: Services là pure functions, dễ test
4. **Maintainable**: Code rõ ràng, dễ bảo trì
5. **Scalable**: Dễ thêm features mới
6. **Performance**: Lazy load pages, cache thông minh

## 🔧 Mở Rộng

### Thêm Feature Mới

1. Tạo file page mới trong `src/pages/NewFeature.js`
2. Tạo composable `src/composables/useNewFeature.js` (nếu cần)
3. Tạo services trong `src/services/` (nếu cần)
4. Import page vào `src/App.js`
5. Thêm route xử lý trong `App.js`

### Thêm API Call Mới

1. Thêm method mới trong `APIService` class
2. Sử dụng method từ composable
3. Xử lý response trong page component

## 📦 Dependencies

- Vue 3 (CDN) - Global build
- Tailwind CSS (CDN)
- Fetch API (Native)
- localStorage API (Native)

## 🎓 Học Tập

Cấu trúc này tuân theo các best practices của Vue 3:
- Composition API pattern (via composables)
- Separation of concerns
- DRY principle
- Component-based architecture

