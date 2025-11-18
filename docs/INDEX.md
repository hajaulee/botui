# 📚 Botui - Documentation Index

Xin chào! Đây là hướng dẫn cho dự án **Botui** - một ứng dụng chatbot utilities đã được refactor thành kiến trúc modular.

## 📖 Tài Liệu

### 🚀 Bắt Đầu Nhanh
- **[QUICKSTART.md](./QUICKSTART.md)** ← 👈 **Start Here!**
  - Hướng dẫn cài đặt & chạy
  - Configuration
  - Common tasks
  - Troubleshooting

### 🏗️ Kiến Trúc & Cấu Trúc
- **[REFACTORING.md](./REFACTORING.md)**
  - Giải thích kiến trúc mới
  - Design principles
  - Data flow
  - Component hierarchy

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**
  - File & folder structure
  - Purpose của mỗi file
  - Directory tree
  - Conventions

### 💻 Code Examples & Patterns
- **[EXAMPLES.md](./EXAMPLES.md)**
  - Code patterns
  - How to add features
  - Best practices
  - Testing patterns

### ✅ Summary
- **[COMPLETED.md](./COMPLETED.md)**
  - Refactoring summary
  - Metrics & improvements
  - Next steps

---

## 🗂️ Project Structure

```
botui/
├── 📄 index.html               # Entry point
├── 📁 src/
│   ├── App.js                 # Root component
│   ├── 📁 pages/              # 5 pages
│   ├── 📁 composables/        # 3 composables  
│   ├── 📁 services/           # 5 services
│   └── 📁 utils/              # Helpers
├── 📚 Documentation/
│   ├── QUICKSTART.md          # ← Start here
│   ├── REFACTORING.md
│   ├── PROJECT_STRUCTURE.md
│   ├── EXAMPLES.md
│   ├── COMPLETED.md
│   └── INDEX.md               # This file
└── 📄 README.md               # Original
```

---

## 🎯 Choose Your Path

### 👤 I'm New to This Project
**→ Start with [QUICKSTART.md](./QUICKSTART.md)**
- How to run the app
- Basic usage
- Quick configuration

### 🏗️ I Want to Understand the Architecture
**→ Read [REFACTORING.md](./REFACTORING.md)**
- Why it was refactored
- Architecture overview
- Design patterns used
- Component hierarchy

### 📁 I Need to Know File Locations
**→ Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**
- Where each file is
- What each file does
- File organization
- Naming conventions

### 💻 I Want to Code & Add Features
**→ See [EXAMPLES.md](./EXAMPLES.md)**
- Code patterns
- How to add new features
- Best practices
- Real examples

### 📊 I Want the Summary
**→ View [COMPLETED.md](./COMPLETED.md)**
- What changed
- Improvements made
- Before/after comparison
- Next steps

---

## 🚀 Quick Start (TL;DR)

### 1. Open the app
```bash
open index.html
# Or use Python server
python -m http.server 8000
```

### 2. Configure (in URL)
```
?apiId=YOUR_ID&userId=YOUR_USER&username=YOUR_NAME
```

### 3. Start using
- Click "Tạo nhắc nhở" to create reminders
- Click "Họ hàng" for family tree
- Click "Sự kiện âm lịch" for lunar events

---

## 📊 Key Statistics

| Metric | Value |
|--------|-------|
| **Files** | 21 |
| **Pages** | 5 |
| **Composables** | 3 |
| **Services** | 5 |
| **Lines of Code** | ~1500 (well organized) |
| **CDN Dependencies** | 3 (Vue, Tailwind, Fonts) |

---

## 🎓 What You'll Learn

By studying this codebase, you'll learn:

- ✅ Vue 3 Composition API pattern
- ✅ Component-based architecture
- ✅ Separation of concerns
- ✅ Service layer pattern
- ✅ Composables pattern
- ✅ Factory pattern
- ✅ How to refactor large components
- ✅ Best practices for code organization

---

## 🔄 Architecture at a Glance

```
┌─────────────────────────────────────────┐
│           UI Layer (Pages)              │
│  MenuPage, ReminderPage, FamilyPage ... │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    Logic Layer (Composables)            │
│  useReminders, useFamily, useLunarEvents│
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│   Business Layer (Services)             │
│  apiService, cacheService, parsers ...  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│     External (Google Apps Script API)   │
└─────────────────────────────────────────┘
```

---

## 💡 Key Concepts Explained

### Pages
UI components that display content and handle user interactions.
```javascript
// src/pages/MenuPage.js
export default {
  template: `...`,
  setup() { ... }
}
```

### Composables
Reusable logic modules similar to React hooks.
```javascript
// src/composables/useReminders.js
export function useReminders(apiId, userId, username) {
  // State and logic here
  return { ... }
}
```

### Services
Utility classes with business logic and data transformations.
```javascript
// src/services/reminderService.js
export class ReminderService {
  static parseReminders(data) { ... }
}
```

---

## 🎯 Common Use Cases

### I want to...

**Add a new page**
- Create file in `src/pages/`
- Import in `App.js`
- Add route
- See: [EXAMPLES.md](./EXAMPLES.md#how-to-add-new-features)

**Add API functionality**
- Add method to `APIService`
- Use in composable
- See: [EXAMPLES.md](./EXAMPLES.md)

**Understand the data flow**
- See: [REFACTORING.md](./REFACTORING.md#-data-flow)

**Fix a bug**
- Check relevant service
- Check composable logic
- Check page component
- See: [QUICKSTART.md](./QUICKSTART.md#-debugging-tips)

---

## 📞 Support

### For Questions About:
- **Setup/Running**: → [QUICKSTART.md](./QUICKSTART.md)
- **Architecture**: → [REFACTORING.md](./REFACTORING.md)
- **File Structure**: → [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **How to Code**: → [EXAMPLES.md](./EXAMPLES.md)
- **What Changed**: → [COMPLETED.md](./COMPLETED.md)

---

## 🎉 Ready to Get Started?

1. **First time?** → [QUICKSTART.md](./QUICKSTART.md)
2. **Want to learn?** → [REFACTORING.md](./REFACTORING.md)
3. **Need to code?** → [EXAMPLES.md](./EXAMPLES.md)
4. **Exploring structure?** → [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## 📝 Notes

- All documentation files are in Markdown format
- Code examples are JavaScript with Vue 3
- The app uses Vue 3 CDN (no build process needed)
- All features are fully working
- Mobile responsive ✅
- Production ready ✅

---

## 🚀 Let's Go!

Pick a documentation file and start exploring. Happy coding! 🎉

