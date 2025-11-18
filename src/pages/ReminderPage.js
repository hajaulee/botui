/**
 * ReminderPage Component
 * Component tạo và quản lý nhắc nhở
 */

import { useReminders } from '../composables/useReminders.js';
import { ReminderService } from '../services/reminderService.js';

const people = [
  { name: 'Bản thân', value: 'me' },
  { name: 'Doha', value: 'đỗthịhải' },
  { name: 'Leha', value: 'hajaulee' }
];

const repeatTypes = [
  { value: 'no', label: 'Không lặp' },
  { value: 'day', label: 'Mỗi ngày' },
  { value: 'week', label: 'Mỗi tuần' },
  { value: 'month', label: 'Mỗi tháng' },
  { value: 'weekday', label: 'Ngày trong tuần' },
  { value: 'weekend', label: 'Cuối tuần' }
];

export default {
  props: {
    apiId: String,
    userId: String,
    username: String
  },

  emits: ['navigate'],

  template: /* html */`
    <div class="page-container">
      <button @click="$emit('navigate', 'menu')" class="btn-back">
        ← Quay lại Menu
      </button>

      <div class="hero-header" style="background: linear-gradient(135deg, var(--info), #2563eb);">
        <div class="hero-header-content">
          <h1>📝 Tạo nhắc nhở</h1>
          <p>Quản lý các nhắc nhở cho gia đình bạn</p>
        </div>
      </div>

      <div class="form-container">
        <!-- Loading Indicator -->
        <div v-if="isLoading" class="alert alert-info">
          <div class="alert-icon">⏳</div>
          <div class="alert-content">Đang tải danh sách nhắc nhở...</div>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-error">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">{{ errorMessage }}</div>
        </div>

        <!-- Empty State Message -->
        <div v-if="!isLoading && reminders.length === 0" class="alert alert-warning">
          <div class="alert-icon">📭</div>
          <div class="alert-content">
            <div class="font-bold">Bạn chưa có nhắc nhở nào!</div>
            <div class="text-sm mt-1">Hãy tạo nhắc nhở mới bên dưới</div>
          </div>
        </div>

        <!-- Reminders List (Above Form) -->
        <div v-if="reminders.length > 0" class="card" style="margin-top: 1.5rem;">
          <h3 class="card-title mb-4">📋 Danh sách nhắc nhở ({{ reminders.length }})</h3>
          <div class="list list-scrollable">
            <div 
              v-for="(reminder, index) in reminders" 
              :key="reminder.id"
              class="list-item"
            >
              <div class="list-item-content">
                <div class="list-item-title">#{{ index + 1 }}: 👤 {{ reminder.person }}</div>
                <div class="list-item-text">{{ reminder.content }}</div>
                <div class="list-item-meta">
                  🕐 {{ reminder.time }}
                </div>
                <div class="list-item-meta">
                  🔄 {{ getRepeatLabel(reminder.repeatType) }}
                </div>
              </div>
              <button 
                @click="deleteReminder(reminder.id)"
                class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.9rem;"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
          <h3 class="text-2xl font-bold mb-4">Tạo nhắc nhở mới</h3>
          <form @submit.prevent="createReminder" class="form-section">
            <!-- Select Person -->
            <div class="form-group">
              <label class="form-label">1. Chọn người để nhắc nhở</label>
              <select 
                v-model="formData.person"
                class="w-full"
              >
                <option value="">-- Chọn người --</option>
                <option v-for="person in people" :key="person.value" :value="person.value">
                  {{ person.name }}
                </option>
              </select>
            </div>

            <!-- Input Content -->
            <div class="form-group">
              <label class="form-label">2. Nhập nội dung nhắc nhở</label>
              <textarea 
                v-model="formData.content"
                placeholder="Nhập nội dung nhắc nhở..."
                class="w-full"
              ></textarea>
            </div>

            <!-- Select Time -->
            <div class="form-group">
              <label class="form-label">3. Chọn thời gian</label>
              <input 
                v-model="formData.time"
                type="datetime-local"
                class="w-full"
              />
            </div>

            <!-- Select Repeat Type -->
            <div class="form-group">
              <label class="form-label">4. Chọn kiểu lặp lại</label>
              <div class="grid-2">
                <label 
                  v-for="type in repeatTypes" 
                  :key="type.value"
                  class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition"
                  :class="formData.repeatType === type.value ? 'border-primary bg-indigo-50' : 'border-border hover:border-primary-light'"
                  style="border-color: formData.repeatType === type.value ? 'var(--primary)' : 'var(--border)'; background-color: formData.repeatType === type.value ? 'rgba(99, 102, 241, 0.05)' : 'transparent';"
                >
                  <input 
                    type="radio" 
                    :value="type.value" 
                    v-model="formData.repeatType"
                  />
                  <span class="ml-3">{{ type.label }}</span>
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="btn-group full" style="margin-top: 2rem;">
              <button 
                type="submit"
                class="btn btn-primary"
              >
                ✓ Tạo nhắc nhở
              </button>
              <button 
                type="button"
                @click="$emit('navigate', 'menu')"
                class="btn btn-secondary"
              >
                ✕ Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,

  setup(props, { emit }) {
    const {
      reminders,
      isLoading,
      isDeleting,
      isCreating,
      errorMessage,
      successMessage,
      formData,
      fetchReminders,
      createReminder,
      deleteReminder
    } = useReminders(props.apiId, props.userId, props.username);

    const getRepeatLabel = (repeatType) => {
      return ReminderService.getRepeatLabel(repeatType);
    };

    // Load reminders on mount
    fetchReminders();

    return {
      reminders,
      isLoading,
      isDeleting,
      isCreating,
      errorMessage,
      successMessage,
      formData,
      people,
      repeatTypes,
      fetchReminders,
      createReminder,
      deleteReminder,
      getRepeatLabel
    };
  }
};
