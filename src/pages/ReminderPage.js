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
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-8">📝 Tạo nhắc nhở</h2>
      
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-700">
        ⏳ Đang tải danh sách nhắc nhở...
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
        ⚠️ {{ errorMessage }}
      </div>

      <!-- Empty State Message -->
      <div v-if="!isLoading && reminders.length === 0" class="mb-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
        <p class="text-center text-yellow-700 text-lg">
          📭 Bạn chưa có nhắc nhở nào!
        </p>
        <p class="text-center text-yellow-600 text-sm mt-2">
          Hãy tạo nhắc nhở mới bên dưới
        </p>
      </div>

      <!-- Reminders List (Above Form) -->
      <div v-if="reminders.length > 0" class="mb-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4">📋 Danh sách nhắc nhở hiện tại ({{ reminders.length }})</h3>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div 
            v-for="(reminder, index) in reminders" 
            :key="reminder.id"
            class="p-4 border-l-4 border-blue-500 bg-white rounded"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-lg">#{{index + 1}}: 👤 {{ reminder.person }}</p>
                <p class="text-gray-700 mt-2">{{ reminder.content }}</p>
                <p class="text-sm text-gray-600 mt-2">
                  🕐 {{ reminder.time }}
                </p>
                <p class="text-sm text-gray-600">
                  🔄 {{ getRepeatLabel(reminder.repeatType) }}
                </p>
              </div>
              <button 
                @click="deleteReminder(reminder.id)"
                class="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition flex-shrink-0"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="border-t border-gray-200 pt-8">
        <h3 class="text-xl font-bold text-gray-800 mb-6">Tạo nhắc nhở mới</h3>
        <form @submit.prevent="createReminder" class="space-y-6">
          <!-- Select Person -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">1. Chọn người để nhắc nhở</label>
            <select 
              v-model="formData.person"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Chọn người --</option>
              <option v-for="person in people" :key="person.value" :value="person.value">
                {{ person.name }}
              </option>
            </select>
          </div>

          <!-- Input Content -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">2. Nhập nội dung nhắc nhở</label>
            <textarea 
              v-model="formData.content"
              placeholder="Nhập nội dung nhắc nhở..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
            ></textarea>
          </div>

          <!-- Select Time -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">3. Chọn thời gian</label>
            <input 
              v-model="formData.time"
              type="datetime-local"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Select Repeat Type -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">4. Chọn kiểu lặp lại</label>
            <div class="grid grid-cols-2 gap-3">
              <label 
                v-for="type in repeatTypes" 
                :key="type.value"
                class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition"
                :class="formData.repeatType === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
              >
                <input 
                  type="radio" 
                  :value="type.value" 
                  v-model="formData.repeatType"
                  class="w-4 h-4"
                />
                <span class="ml-3 text-gray-700">{{ type.label }}</span>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-6">
            <button 
              type="submit"
              class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              ✓ Tạo nhắc nhở
            </button>
            <button 
              type="button"
              @click="$emit('navigate', 'menu')"
              class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
            >
              ✕ Hủy
            </button>
          </div>
        </form>
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
