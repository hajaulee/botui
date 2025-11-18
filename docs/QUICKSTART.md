# 🚀 Quick Start Guide

## Installation & Setup

### 1. No Installation Needed!
Dự án sử dụng Vue 3 CDN, không cần npm hoặc build tools.

### 2. Open in Browser
```bash
# Option 1: Double-click index.html
open index.html

# Option 2: Use local server (recommended)
cd /Users/leha/GitHub/botui
python -m http.server 8000
# Visit http://localhost:8000
```

### 3. Configure
Thêm URL parameters:
```
http://localhost:8000?apiId=YOUR_APP_ID&userId=YOUR_USER_ID&username=YOUR_NAME
```

Hoặc lưu vào localStorage (DevTools):
```javascript
localStorage.setItem('apiId', 'YOUR_APP_ID');
localStorage.setItem('userId', 'YOUR_USER_ID');
```

---

## 📖 Project Overview

### Architecture
```
Single HTML File (index.html)
         ↓
    Vue 3 App (App.js)
         ↓
   5 Pages (Route-based)
         ↓
   3 Composables (State)
         ↓
   5 Services (Business Logic)
```

### Pages
1. **Menu** - Main page with 4 buttons
2. **Reminders** - Create & manage reminders
3. **Family Tree** - Manage family relations
4. **Lunar Events** - Manage lunar calendar events
5. **About** - App information

---

## 💻 File Structure

```
src/
├── App.js                  # Main component + router
├── pages/                  # 5 page components
├── composables/            # 3 logic modules
├── services/               # 5 utility services
└── utils/                  # Helpers
```

---

## 🔧 Add New Feature

### Example: Add "Tags" feature

#### 1. Create API method
```javascript
// src/services/apiService.js
async addTag(userId, reminderId, tag) {
  const url = `...&msg=add_tag&...`;
  return (await fetch(url)).json();
}
```

#### 2. Create composable
```javascript
// src/composables/useTags.js
export function useTags(apiId, userId) {
  const { ref } = Vue;
  const tags = ref([]);
  
  const addTag = async (reminderId, tag) => {
    // ... implementation
  };
  
  return { tags, addTag };
}
```

#### 3. Use in page
```javascript
// src/pages/ReminderPage.js
import { useTags } from '../composables/useTags.js';

setup(props) {
  const { tags, addTag } = useTags(props.apiId, props.userId);
  
  return { tags, addTag };
}
```

#### 4. Add to template
```html
<button @click="addTag(reminder.id, 'important')">
  Tag as Important
</button>
```

---

## 📚 Key Concepts

### Pages (Components)
- Stateless UI components
- Use composables for state
- Emit events to parent

### Composables (Logic)
- Manage state (ref, reactive)
- Business logic (fetch, parse, validate)
- Return API for components

### Services (Utilities)
- Pure functions
- No state
- Reusable across composables

### Examples
```javascript
// Using in component
const { reminders, fetchReminders } = useReminders(apiId, userId, username);

// Template
<div v-for="r in reminders" :key="r.id">{{ r.content }}</div>

// Event handling
<button @click="createReminder">Create</button>
```

---

## 🐛 Debugging Tips

### 1. Check DevTools Console
```javascript
// Open browser DevTools (F12)
// Check for any errors
```

### 2. Check API Response
```javascript
// In useReminders.js
console.log('API Response:', data);
console.log('Parsed Reminders:', reminders.value);
```

### 3. Check Cache
```javascript
// In DevTools Console
localStorage.getItem('botui_cache_...')
```

### 4. Check Component State
```javascript
// In DevTools Vue extension
// Inspect reactive state
```

---

## 🎯 Common Tasks

### Change Theme Colors
Edit Tailwind classes in `src/pages/*.js`
```html
<!-- Change from blue to purple -->
<button class="bg-purple-500">Text</button>
```

### Add New API Call
1. Add method to `APIService`
2. Use in composable
3. Use in page

### Add New Page
1. Create `src/pages/NewPage.js`
2. Import in `App.js`
3. Add route in `App.js`
4. Add button in `MenuPage.js`

### Change API Endpoint
Edit in `src/services/apiService.js`
```javascript
const apiUrl = `https://new-endpoint.com/...`;
```

---

## 📱 Mobile Responsive

The app is already responsive using Tailwind CSS:
- Mobile-first design
- Flexible grid layout
- Touch-friendly buttons

No additional changes needed!

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Check import paths - use relative paths |
| "Vue not defined" | Make sure Vue 3 CDN is loaded |
| "404 Not Found" | Use local server, not file:// |
| Page not loading | Check DevTools > Network tab |
| API not working | Check `apiId`, `userId` parameters |
| Cache not working | Clear localStorage, check console |

---

## 💡 Performance Tips

1. **Smart Caching**: App shows cached data first, updates in background
2. **Lazy Loading**: Pages only load when needed
3. **Minimal Re-renders**: Vue handles efficiently
4. **No Build Step**: No compilation overhead

---

## 🔐 Security Notes

1. API credentials are stored in URL (not ideal for production)
2. Consider storing in backend for production
3. Use HTTPS in production
4. Validate all user inputs

---

## 📚 Learn More

- **REFACTORING.md**: Architecture deep dive
- **PROJECT_STRUCTURE.md**: File structure reference
- **EXAMPLES.md**: Code patterns & examples

---

## ❓ FAQ

**Q: Do I need Node.js?**
A: No! The app runs entirely in the browser with Vue 3 CDN.

**Q: Can I deploy this?**
A: Yes! Upload files to any web server (GitHub Pages, Netlify, etc.)

**Q: How do I modify features?**
A: Edit component files in `src/pages/`, `src/composables/`, or `src/services/`

**Q: Is it mobile-friendly?**
A: Yes! It's fully responsive.

**Q: Can I add more pages?**
A: Yes! Follow the "Add New Feature" section above.

---

## 🎉 You're All Set!

The app is ready to use. Start by opening `index.html` in your browser with the required parameters:

```
?apiId=YOUR_ID&userId=YOUR_USER_ID&username=YOUR_NAME
```

Happy coding! 🚀

