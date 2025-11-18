# Refactoring Examples & Best Practices

## 📚 Ví Dụ Thực Tế

### 1. Cách Page Component Được Cấu Trúc

```javascript
// src/pages/ReminderPage.js
import { useReminders } from '../composables/useReminders.js';
import { ReminderService } from '../services/reminderService.js';

export default {
  // Props từ parent (App.js)
  props: {
    apiId: String,
    userId: String,
    username: String
  },

  // Emit events tới parent
  emits: ['navigate'],

  // Vue template
  template: /* html */`
    <!-- HTML template -->
  `,

  // Setup function - Composition API
  setup(props, { emit }) {
    // 1. Sử dụng composable
    const {
      reminders,
      isLoading,
      errorMessage,
      formData,
      fetchReminders,
      createReminder,
      deleteReminder
    } = useReminders(props.apiId, props.userId, props.username);

    // 2. Sử dụng service utilities
    const getRepeatLabel = (repeatType) => {
      return ReminderService.getRepeatLabel(repeatType);
    };

    // 3. Load data on mount
    fetchReminders();

    // 4. Return để dùng trong template
    return {
      reminders,
      isLoading,
      errorMessage,
      formData,
      fetchReminders,
      createReminder,
      deleteReminder,
      getRepeatLabel
    };
  }
};
```

### 2. Cách Composable Được Cấu Trúc

```javascript
// src/composables/useReminders.js
import { APIService } from '../services/apiService.js';
import { CacheService } from '../services/cacheService.js';
import { ReminderService } from '../services/reminderService.js';

export function useReminders(apiId, userId, username) {
  // 1. Import Vue functions từ global Vue object
  const { ref, reactive } = Vue;

  // 2. Khai báo state
  const reminders = ref([]);
  const isLoading = ref(false);
  const formData = reactive({
    person: '',
    content: '',
    time: '',
    repeatType: 'no'
  });

  // 3. Tạo service instance
  const apiService = new APIService(apiId);

  // 4. Định nghĩa methods
  const fetchReminders = async () => {
    isLoading.value = true;
    try {
      const apiUrl = `...`;
      
      // Hiển thị cache trước
      const cached = CacheService.getCacheData(apiUrl);
      if (cached) reminders.value = cached;

      // Fetch từ API
      const data = await apiService.listReminders(userId);
      reminders.value = ReminderService.parseReminders(data);
      
      // Lưu cache
      CacheService.setCacheData(apiUrl, reminders.value);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const createReminder = async () => {
    try {
      await apiService.createReminder(
        userId, username, formData.person,
        formData.time, formData.content, formData.repeatType
      );
      await fetchReminders();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // 5. Return public API
  return {
    reminders,
    isLoading,
    formData,
    fetchReminders,
    createReminder
  };
}
```

### 3. Cách Service Được Cấu Trúc

```javascript
// src/services/apiService.js
export class APIService {
  constructor(apiId) {
    this.apiId = apiId;
  }

  // Pure functions - không có side effects
  async listReminders(userId) {
    const url = `https://script.google.com/macros/s/${this.apiId}/exec?msg=list_remind&userId=${userId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async createReminder(userId, username, person, datetime, content, repeatType) {
    const url = `https://script.google.com/macros/s/${this.apiId}/exec?msg=remind%20...`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}
```

## 🎯 How to Add New Features

### Scenario: Thêm tính năng "Edit Reminder"

#### Step 1: Thêm API method

```javascript
// src/services/apiService.js
export class APIService {
  async updateReminder(userId, reminderId, person, datetime, content, repeatType) {
    const url = `https://script.google.com/macros/s/${this.apiId}/exec?msg=update_remind...`;
    const response = await fetch(url);
    return response.json();
  }
}
```

#### Step 2: Thêm vào composable

```javascript
// src/composables/useReminders.js
export function useReminders(apiId, userId, username) {
  // ... existing code ...

  const updateReminder = async (reminderId) => {
    try {
      isUpdating.value = true;
      await apiService.updateReminder(
        userId, reminderId, formData.person,
        formData.time, formData.content, formData.repeatType
      );
      await fetchReminders();
      alert('Updated successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      isUpdating.value = false;
    }
  };

  return {
    // ... existing returns ...
    updateReminder,
    isUpdating
  };
}
```

#### Step 3: Sử dụng trong page

```javascript
// src/pages/ReminderPage.js
export default {
  // ... setup ...
  setup(props, { emit }) {
    const {
      // ... existing ...
      updateReminder,
      isUpdating
    } = useReminders(props.apiId, props.userId, props.username);

    return {
      // ... existing ...
      updateReminder,
      isUpdating
    };
  }
};
```

#### Step 4: Thêm UI vào template

```html
<button @click="updateReminder(reminder.id)">
  Edit
</button>
```

## 🧪 Testing Pattern

### Dễ test vì tách biệt mối quan tâm:

```javascript
// Test service (pure function)
import { ReminderService } from '../services/reminderService.js';

test('parseReminders should parse API response', () => {
  const data = { messages: [{ text: 'Người nhận: Alice\nNội dung: Test' }] };
  const result = ReminderService.parseReminders(data);
  expect(result[0].person).toBe('Alice');
  expect(result[0].content).toBe('Test');
});

// Test composable (mocking apiService)
import { useReminders } from '../composables/useReminders.js';

test('useReminders should fetch reminders', async () => {
  const { reminders, fetchReminders } = useReminders('apiId', 'userId', 'user');
  // Mock apiService...
  await fetchReminders();
  expect(reminders.value.length).toBeGreaterThan(0);
});
```

## 🎨 Code Style Guidelines

### ✅ Good Practices

```javascript
// 1. Use meaningful names
const currentPage = ref('menu'); // ✓ Good
const cp = ref('menu'); // ✗ Bad

// 2. Keep functions small & focused
const fetchReminders = async () => {
  // Do one thing: fetch reminders
};

// 3. Handle errors properly
try {
  const data = await apiService.listReminders(userId);
  reminders.value = ReminderService.parseReminders(data);
} catch (error) {
  errorMessage.value = 'Failed to load reminders';
}

// 4. Separate concerns
// ✓ API calls → apiService
// ✓ Data parsing → ReminderService
// ✓ State management → useReminders
// ✓ UI rendering → ReminderPage

// 5. Use constants
const repeatTypes = [
  { value: 'no', label: 'Không lặp' },
  { value: 'day', label: 'Mỗi ngày' }
];
```

## 📊 Common Patterns

### Pattern 1: Fetch + Cache

```javascript
const fetchData = async (apiUrl) => {
  // 1. Show cached data first (if exists)
  const cached = CacheService.getCacheData(apiUrl);
  if (cached) data.value = cached;

  // 2. Fetch fresh data
  try {
    const response = await apiService.fetch(apiUrl);
    data.value = response;
    CacheService.setCacheData(apiUrl, response);
  } catch (error) {
    // Fallback to cached if fetch fails
    if (!cached) errorMessage.value = 'Failed to load';
  }
};
```

### Pattern 2: Form Submission

```javascript
const handleSubmit = async () => {
  // 1. Validate
  if (!formData.person || !formData.content) {
    alert('Please fill all fields');
    return;
  }

  // 2. Show loading
  isLoading.value = true;

  try {
    // 3. Call API
    await apiService.createReminder(...formData);
    
    // 4. Refresh data
    await fetchReminders();
    
    // 5. Reset form
    resetForm();
    
    // 6. Success message
    alert('Created successfully!');
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};
```

### Pattern 3: Conditional Rendering

```html
<!-- Loading state -->
<div v-if="isLoading" class="spinner">Loading...</div>

<!-- Error state -->
<div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

<!-- Empty state -->
<div v-else-if="reminders.length === 0" class="empty">No reminders</div>

<!-- Success state -->
<div v-else class="list">
  <div v-for="reminder in reminders" :key="reminder.id">
    {{ reminder.content }}
  </div>
</div>
```

