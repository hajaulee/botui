/**
 * LunarEventsPage Component
 * Component quản lý sự kiện âm lịch
 */

import { useLunarEvents } from '../composables/useLunarEvents.js';

export default {
  props: {
    apiId: String
  },

  emits: ['navigate'],

  template: /* html */`
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">📅 Sự kiện âm lịch</h2>
      
      <!-- Lunar Events Message -->
      <div v-if="lunarEventMessage" class="mb-6 p-4 rounded-lg" :class="lunarEventMessage.includes('Lỗi') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'">
        {{ lunarEventMessage }}
      </div>

      <!-- Lunar Events List -->
      <div v-if="lunarEvents.length > 0" class="mb-8">
        <h3 class="text-lg font-bold text-gray-800 mb-4">📋 Danh sách sự kiện âm lịch</h3>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div 
            v-for="(event, index) in lunarEvents"
            :key="index"
            class="p-4 border-l-4 border-orange-500 bg-orange-50 rounded flex justify-between items-start"
          >
            <div class="flex-1">
              <p class="font-semibold text-gray-800 text-lg">{{ event.eventName }}</p>
              <p class="text-sm text-gray-600 mt-2">📅 {{ event.date }} âm lịch, tức {{ event.solarDate }} dương lịch</p>
              <p class="text-sm font-semibold text-orange-600 mt-1">
                {{ event.daysText }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="lunarEvents.length === 0 && lunarEventsInput.trim() === ''" class="mb-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <p class="text-center text-blue-700">📝 Nhập dữ liệu ở dưới để xem danh sách sự kiện âm lịch</p>
      </div>

      <!-- Lunar Events Input -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Nhập sự kiện âm lịch (định dạng: ngày/tháng: tên sự kiện)</label>
        <textarea 
          v-model="lunarEventsInput"
          @input="updateLunarEvents"
          placeholder="Ví dụ:&#10;8/8: Giỗ ông A&#10;12/3: Giỗ ông B"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical font-mono"
          rows="6"
        ></textarea>
        <p class="text-xs text-gray-500 mt-2">💡 Mỗi dòng một sự kiện, định dạng: ngày/tháng: tên sự kiện (âm lịch)</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4">
        <button 
          @click="saveLunarEvents"
          :disabled="isLunarEventLoading || !lunarEventsInput.trim()"
          class="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
        >
          {{ isLunarEventLoading ? 'Đang lưu...' : '💾 Lưu sự kiện âm lịch' }}
        </button>
        <button 
          @click="$emit('navigate', 'menu')"
          class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
        >
          ← Quay lại Menu
        </button>
      </div>
    </div>
  `,

  setup(props, { emit }) {
    const {
      lunarEvents,
      lunarEventsInput,
      isLunarEventLoading,
      lunarEventMessage,
      loadLunarEvents,
      saveLunarEvents
    } = useLunarEvents(props.apiId);

    // Load lunar events on mount
    loadLunarEvents();

    // Method to update lunar events
    const updateLunarEvents = () => {
      lunarEvents.value = LunarEventsService.parseLunarEvents(lunarEventsInput.value);
    };

    return {
      lunarEvents,
      lunarEventsInput,
      isLunarEventLoading,
      lunarEventMessage,
      loadLunarEvents,
      saveLunarEvents,
      updateLunarEvents
    };
  }
};
