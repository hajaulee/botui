# Project Structure Summary

## 📁 Directory Tree

```
botui/
│
├── index.html                          # Entry point (mới)
├── REFACTORING.md                      # Documentation
│
├── src/
│   ├── App.js                         # App root component (mới)
│   │
│   ├── pages/                         # Page components (mới)
│   │   ├── MenuPage.js                # Menu chính
│   │   ├── ReminderPage.js            # Tạo & quản lý nhắc nhở
│   │   ├── FamilyPage.js              # Quản lý cây gia phả
│   │   ├── LunarEventsPage.js         # Quản lý sự kiện âm lịch
│   │   └── AboutPage.js               # Trang giới thiệu
│   │
│   ├── composables/                   # Reusable logic (mới)
│   │   ├── useReminders.js            # Reminder state & logic
│   │   ├── useFamily.js               # Family tree state & logic
│   │   └── useLunarEvents.js          # Lunar events state & logic
│   │
│   ├── services/                      # Business logic (mới)
│   │   ├── apiService.js              # API calls to Google Apps Script
│   │   ├── cacheService.js            # localStorage cache management
│   │   ├── reminderService.js         # Reminder data parsing & formatting
│   │   ├── familyTreeService.js       # Family tree parsing & rendering
│   │   └── lunarEventsService.js      # Lunar events parsing & calculation
│   │
│   └── utils/                         # Utilities (mới)
│       └── lunar-solar-converter.js   # Lunar/solar calendar conversion
│
├── components/                        # Placeholder (có thể expand sau)
│
├── utils/                             # Old utils (deprecated - chuyển vào src/utils)
│   └── lunar-solar-converter.js
│
└── README.md                          # Original README
```

## 🎯 File Purpose

### Core Application Files

| File | Purpose | Type |
|------|---------|------|
| `index.html` | HTML entry point, imports Vue 3 & App.js | HTML |
| `src/App.js` | Root component, routing, global state | Component |

### Pages (UI Components)

| File | Purpose | Routes |
|------|---------|--------|
| `MenuPage.js` | Main menu with 4 action buttons | `menu` |
| `ReminderPage.js` | Create & manage reminders | `createReminder` |
| `FamilyPage.js` | Manage family tree | `family` |
| `LunarEventsPage.js` | Manage lunar events | `lunarEvents` |
| `AboutPage.js` | App information | `about` |

### Composables (State Management)

| File | Functions | Used In |
|------|-----------|---------|
| `useReminders.js` | `fetchReminders()`, `createReminder()`, `deleteReminder()` | ReminderPage |
| `useFamily.js` | `loadFamilyTree()`, `saveFamilyTree()`, `parseAndRenderFamilyTree()` | FamilyPage |
| `useLunarEvents.js` | `loadLunarEvents()`, `saveLunarEvents()` | LunarEventsPage |

### Services (Business Logic)

| File | Methods |
|------|---------|
| `apiService.js` | `listReminders()`, `createReminder()`, `deleteReminder()`, `loadFamilyTree()`, `saveFamilyTree()`, `loadLunarEvents()`, `saveLunarEvents()` |
| `cacheService.js` | `getCacheData()`, `setCacheData()`, `clearCache()` |
| `reminderService.js` | `parseReminders()`, `formatDateTime()`, `getRepeatLabel()` |
| `familyTreeService.js` | `parseAndRender()`, `validate()` |
| `lunarEventsService.js` | `parseLunarEvents()` |

### Utils

| File | Purpose |
|------|---------|
| `lunar-solar-converter.js` | Convert between lunar & solar calendar dates |

## 🔄 Code Organization Principles

1. **Single Responsibility**: Mỗi file làm một việc
2. **Reusability**: Composables tái sử dụng logic
3. **Separation of Concerns**: UI ≠ Logic ≠ API
4. **DRY**: Không lặp code
5. **Composition**: Build từ nhỏ thành lớn

## 📊 Component Hierarchy

```
App.js (root)
├── MenuPage
├── ReminderPage
│   └── useReminders() [composable]
│       ├── APIService
│       ├── CacheService
│       └── ReminderService
├── FamilyPage
│   └── useFamily() [composable]
│       ├── APIService
│       ├── CacheService
│       └── FamilyTreeService
├── LunarEventsPage
│   └── useLunarEvents() [composable]
│       ├── APIService
│       ├── CacheService
│       └── LunarEventsService
└── AboutPage
```

## 🚀 Import Map

```javascript
// index.html uses ES modules with Vue 3 Global build
import App from './src/App.js';
// All other imports are relative paths to .js files
```

## 📝 Conventions

- **Components**: PascalCase.js (e.g., `MenuPage.js`)
- **Composables**: `use` prefix (e.g., `useReminders.js`)
- **Services**: camelCase.js or descriptive name (e.g., `apiService.js`)
- **Utils**: descriptive name (e.g., `lunar-solar-converter.js`)

## 🔧 Development Tips

1. **Adding a new page**: Create in `src/pages/`, import in `App.js`, add route
2. **Adding new logic**: Create composable in `src/composables/`, use in pages
3. **Adding new API**: Add method to `APIService`, use in composables
4. **Styling**: Use Tailwind CSS classes directly in templates
5. **State management**: Use Vue's `ref()` and `reactive()` from composables

