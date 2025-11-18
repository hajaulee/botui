/**
 * FamilyPage Component
 * Component quản lý cây gia phả
 */

import { useFamily } from '../composables/useFamily.js';

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

      <div class="hero-header">
        <div class="hero-header-content">
          <h1>👨‍👩‍👧‍👦 Cây gia phả</h1>
          <p>Quản lý và hiển thị cây gia phả của gia đình bạn</p>
        </div>
      </div>

      <div class="form-container">
        <!-- Select Family Person -->
        <div class="form-group">
          <label class="form-label">Chọn người</label>
          <select 
            v-model="familyPerson"
            @change="loadFamilyTree"
            class="w-full"
          >
            <option value="doha">Doha</option>
            <option value="leha">Leha</option>
          </select>
        </div>

        <!-- Family Message -->
        <div v-if="familyMessage" :class="['alert', familyMessage.includes('Lỗi') ? 'alert-error' : 'alert-success']">
          <div class="alert-icon">{{ familyMessage.includes('Lỗi') ? '❌' : '✅' }}</div>
          <div class="alert-content">{{ familyMessage }}</div>
        </div>

        <!-- Family Tree Display -->
        <div v-if="familyTree" class="card" style="margin-top: 1.5rem;">
          <h3 class="card-title mb-4">🌳 Cây gia phả hiển thị</h3>
          <pre class="font-mono" style="background-color: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-lg); overflow-x: auto; color: var(--text-secondary);">{{ familyTree }}</pre>
        </div>

        <!-- Empty State -->
        <div v-if="!familyTree && familyText.trim() === ''" class="alert alert-info" style="margin-top: 1.5rem;">
          <div class="alert-icon">📝</div>
          <div class="alert-content">Nhập dữ liệu ở trên để xem cây gia phả</div>
        </div>

        <!-- Family Text Input -->
        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Nhập cây gia phả (dùng dấu cách để thụt lề)</label>
          <textarea 
            v-model="familyText"
            @input="parseAndRenderFamilyTree"
            placeholder="Ví dụ:&#10;Nội&#10; - cô A x bác B&#10;  - chị X&#10;   - X1&#10;   - X2&#10;  - chị Y"
            class="font-mono"
          ></textarea>
          <div class="form-hint">💡 Dùng dấu cách ở đầu dòng để tạo cấp độ (mỗi dấu cách = 1 cấp)</div>
        </div>

        <!-- Action Buttons -->
        <div class="btn-group full" style="margin-top: 2rem;">
          <button 
            @click="saveFamilyTree"
            :disabled="isFamilyLoading || !familyText.trim()"
            class="btn btn-success"
          >
            {{ isFamilyLoading ? '⏳ Đang lưu...' : '💾 Lưu cây gia phả' }}
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
      familyPerson,
      familyText,
      familyTree,
      isFamilyLoading,
      familyMessage,
      parseAndRenderFamilyTree,
      loadFamilyTree,
      saveFamilyTree
    } = useFamily(props.apiId);

    // Load family tree on mount
    loadFamilyTree();

    return {
      familyPerson,
      familyText,
      familyTree,
      isFamilyLoading,
      familyMessage,
      parseAndRenderFamilyTree,
      loadFamilyTree,
      saveFamilyTree
    };
  }
};
