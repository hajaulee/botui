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
    <div class="page-container">
      <button @click="$emit('navigate', 'menu')" class="btn-back">
        ← Quay lại Menu
      </button>

      <div class="hero-header" style="background: linear-gradient(135deg, var(--warning), #d97706);">
        <div class="hero-header-content">
          <h1>📅 Sự kiện âm lịch</h1>
          <p>Quản lý những ngày quan trọng theo âm lịch</p>
        </div>
      </div>

      <div class="form-container">
        <!-- Lunar Events Message -->
        <div v-if="lunarEventMessage" :class="['alert', lunarEventMessage.includes('Lỗi') ? 'alert-error' : 'alert-success']">
          <div class="alert-icon">{{ lunarEventMessage.includes('Lỗi') ? '❌' : '✅' }}</div>
          <div class="alert-content">{{ lunarEventMessage }}</div>
        </div>

        <!-- Lunar Events List -->
        <div v-if="lunarEvents.length > 0" class="card" style="margin-top: 1.5rem;">
          <h3 class="card-title mb-4">📋 Danh sách sự kiện âm lịch</h3>
          <div class="list list-scrollable">
            <div 
              v-for="(event, index) in lunarEvents"
              :key="index"
              class="list-item"
            >
              <div class="list-item-content">
                <div class="list-item-title">{{ event.eventName }}</div>
                <div class="list-item-text">
                  📅 {{ event.date }} âm lịch, tức {{ event.solarDate }} dương lịch
                </div>
                <div class="list-item-meta" style="color: var(--warning); font-weight: 600;">
                  {{ event.daysText }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="lunarEvents.length === 0 && lunarEventsInput.trim() === ''" class="alert alert-info" style="margin-top: 1.5rem;">
          <div class="alert-icon">📝</div>
          <div class="alert-content">Nhập dữ liệu ở dưới để xem danh sách sự kiện âm lịch</div>
        </div>

        <!-- Lunar Events Input -->
        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Nhập sự kiện âm lịch (định dạng: ngày/tháng: tên sự kiện)</label>
          <textarea 
            v-model="lunarEventsInput"
            @input="updateLunarEvents"
            placeholder="Ví dụ:&#10;8/8: Giỗ ông A&#10;12/3: Giỗ ông B"
            class="font-mono"
          ></textarea>
          <div class="form-hint">💡 Mỗi dòng một sự kiện, định dạng: ngày/tháng: tên sự kiện (âm lịch)</div>
        </div>

        <!-- Action Buttons -->
        <div class="btn-group full" style="margin-top: 2rem;">
          <button 
            @click="saveLunarEvents"
            :disabled="isLunarEventLoading || !lunarEventsInput.trim()"
            class="btn btn-warning"
          >
            {{ isLunarEventLoading ? '⏳ Đang lưu...' : '💾 Lưu sự kiện âm lịch' }}
          </button>
          <button 
            @click="$emit('navigate', 'menu')"
            class="btn btn-secondary"
          >
            ← Quay lại Menu
          </button>
        </div>
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
