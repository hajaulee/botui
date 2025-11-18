# 🏗️ Architecture Diagrams

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        index.html                          │
│                  (Vue 3 CDN Entry Point)                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│                      App.js                                │
│              (Root Component + Router)                     │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ State: apiId, userId, username, currentPage        │ │
│  │ Methods: goToPage()                                 │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────────┬──────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬──────────────┬──────────────┐
        │           │           │              │              │
        ▼           ▼           ▼              ▼              ▼
    MenuPage  ReminderPage  FamilyPage  LunarEventsPage  AboutPage
```

---

## Component Data Flow

```
PAGE COMPONENT
    │
    ├─ props (from App.js)
    │   ├─ apiId
    │   ├─ userId
    │   └─ username
    │
    ├─ setup() {
    │   │
    │   ├─ import Composable
    │   │   └─ const { state, methods } = useXyz(...)
    │   │
    │   ├─ Composable
    │   │   ├─ ref/reactive (state)
    │   │   ├─ import Service
    │   │   │   └─ service.doSomething()
    │   │   ├─ async methods
    │   │   └─ return { state, methods }
    │   │
    │   └─ return { ... to template }
    │
    └─ template (Vue syntax)
        └─ @click="method()" → emit('navigate', page)
```

---

## Request/Response Flow

### Example: Create Reminder

```
User Action (Form Submit)
    │
    ▼
ReminderPage.createReminder()
    │
    ▼
useReminders.createReminder()
    │
    ▼
APIService.createReminder()
    │
    ▼
fetch() to Google Apps Script
    │
    ▼
┌─────────────────────────────────┐
│  Google Apps Script Backend     │
│  (Process & Store Data)         │
└─────────────────────────────────┘
    │
    ▼
HTTP Response (JSON)
    │
    ▼
ReminderService.parseReminders()
    │
    ▼
CacheService.setCacheData()
    │
    ▼
useReminders state update
    │
    ▼
ReminderPage re-render
    │
    ▼
User sees new reminder
```

---

## Composable Pattern

```javascript
// Import & Create
const { state, methods } = useReminders(apiId, userId, username)

                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
                  State               Methods
              ┌────────────┐      ┌──────────────┐
              │ reminders  │      │ fetchReminders
              │ isLoading  │      │ createReminder
              │ formData   │      │ deleteReminder
              │ errors     │      └──────────────┘
              └────────────┘
                    │
                    ▼
              Template v-model
              @click="method()"
```

---

## Service Architecture

```
API Service
├─ listReminders()
├─ createReminder()
├─ deleteReminder()
├─ loadFamilyTree()
├─ saveFamilyTree()
├─ loadLunarEvents()
└─ saveLunarEvents()

Cache Service
├─ getCacheData()
├─ setCacheData()
└─ clearCache()

Reminder Service
├─ parseReminders()
├─ formatDateTime()
└─ getRepeatLabel()

Family Tree Service
├─ parseAndRender()
└─ validate()

Lunar Events Service
└─ parseLunarEvents()
```

---

## State Management Flow

```
┌─────────────────────────────────┐
│     Vue Global State (refs)     │
│  ┌───────────────────────────┐  │
│  │ reminders: Ref            │  │
│  │ isLoading: Ref            │  │
│  │ formData: Reactive        │  │
│  │ errorMessage: Ref         │  │
│  └───────────────────────────┘  │
└──────────────┬──────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   Template        Methods
   (Display)       (Actions)
   v-if/v-for      @click
   {{ data }}      @submit
```

---

## File Dependency Graph

```
index.html
    │
    └─→ App.js
            │
            ├─→ MenuPage.js
            │
            ├─→ ReminderPage.js
            │   └─→ useReminders.js
            │       ├─→ APIService.js
            │       ├─→ CacheService.js
            │       └─→ ReminderService.js
            │
            ├─→ FamilyPage.js
            │   └─→ useFamily.js
            │       ├─→ APIService.js
            │       ├─→ CacheService.js
            │       └─→ FamilyTreeService.js
            │
            ├─→ LunarEventsPage.js
            │   └─→ useLunarEvents.js
            │       ├─→ APIService.js
            │       ├─→ CacheService.js
            │       ├─→ LunarEventsService.js
            │       └─→ lunar-solar-converter.js
            │
            └─→ AboutPage.js
```

---

## Cache Strategy

```
User Request
    │
    ▼
Check Cache
    │
    ├─ Found?
    │  ├─ Yes ──→ Display cached data (fast!)
    │  │             │
    │  │             ▼
    │  │          Fetch in background
    │  │             │
    │  │             ▼
    │  │          Update cache
    │  │             │
    │  │             ▼
    │  │          Update display (if different)
    │  │
    │  └─ No ──→ Fetch from API
    │              │
    │              ▼
    │           Display data
    │              │
    │              ▼
    │           Save to cache
```

---

## Vue 3 Composition Pattern Used

```
setup(props, { emit }) {
    // 1. Import composables
    const { state, method } = useXyz(props);
    
    // 2. Local computed if needed
    const derivedState = computed(() => state.value * 2);
    
    // 3. Methods
    const handleClick = () => method();
    
    // 4. Return for template
    return { state, method, handleClick };
}
```

---

## Routing Model

```
App.js (Router)
    │
    ├─ currentPage = ref('menu')
    │
    └─ goToPage(pageName)
        │
        └─ currentPage.value = pageName
            │
            ├─ if (currentPage === 'menu') ──→ MenuPage
            ├─ if (currentPage === 'createReminder') ──→ ReminderPage
            ├─ if (currentPage === 'family') ──→ FamilyPage
            ├─ if (currentPage === 'lunarEvents') ──→ LunarEventsPage
            └─ if (currentPage === 'about') ──→ AboutPage
```

---

## Error Handling Flow

```
Method Call
    │
    ▼
try {
    ├─ Show loading state
    ├─ Execute action
    ├─ Update state on success
    └─ Clear error message
}
catch (error) {
    ├─ Log error
    ├─ Set error message
    └─ Show to user
}
finally {
    └─ Hide loading state
}
```

---

## Local Storage Cache Strategy

```
Cache Key Format: botui_cache_${url.search}

Example:
  URL: https://script.google.com/macros/s/ABC123/exec?msg=list&userId=123
  Key: botui_cache_?msg=list&userId=123
  
  In localStorage:
  {
    "botui_cache_?msg=list&userId=123": "[...]"
  }
```

---

## Component Lifecycle

```
1. App mounts
   └─ Route to initial page (default: 'menu')
      
2. Page component mounts
   └─ setup() executes
      ├─ Composable created
      ├─ Data loaded (from cache or API)
      └─ State available to template

3. User interacts
   └─ Method called
      ├─ Service processes
      ├─ API request sent
      ├─ Response handled
      └─ State updated → re-render

4. Navigation
   └─ emit('navigate', page)
      ├─ App receives event
      ├─ currentPage updated
      └─ New page component mounted (repeat from step 2)
```

---

## Template Rendering Pattern

```html
<!-- Conditional rendering -->
<div v-if="isLoading">Loading...</div>
<div v-else-if="error">{{ error }}</div>
<div v-else-if="data.length === 0">Empty state</div>
<div v-else>
  <!-- List rendering -->
  <div v-for="item in data" :key="item.id">
    <!-- Event handling -->
    <button @click="handleClick(item.id)">
      Action
    </button>
  </div>
</div>
```

---

## Summary

**This architecture provides:**
- ✅ Clean separation of concerns
- ✅ Reusable logic (composables)
- ✅ Easy to test (services are pure)
- ✅ Easy to maintain (each file has one job)
- ✅ Easy to scale (add features without breaking existing code)

