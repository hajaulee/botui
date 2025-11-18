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
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">👨‍👩‍👧‍👦 Cây gia phả</h2>
      
      <!-- Select Family Person -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Chọn người</label>
        <select 
          v-model="familyPerson"
          @change="loadFamilyTree"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="doha">Doha</option>
          <option value="leha">Leha</option>
        </select>
      </div>

      <!-- Family Message -->
      <div v-if="familyMessage" class="mb-6 p-4 rounded-lg" :class="familyMessage.includes('Lỗi') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'">
        {{ familyMessage }}
      </div>

      <!-- Family Tree Display -->
      <div v-if="familyTree" class="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200 overflow-x-auto">
        <h3 class="text-lg font-bold text-gray-800 mb-4">🌳 Cây gia phả hiển thị</h3>
        <pre class="text-gray-700 text-sm font-mono whitespace-pre">{{ familyTree }}</pre>
      </div>

      <!-- Empty State -->
      <div v-if="!familyTree && familyText.trim() === ''" class="mb-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <p class="text-center text-blue-700">📝 Nhập dữ liệu ở trên để xem cây gia phả</p>
      </div>

      <!-- Family Text Input -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Nhập cây gia phả (dùng dấu cách để thụt lề)</label>
        <textarea 
          v-model="familyText"
          @input="parseAndRenderFamilyTree"
          placeholder="Ví dụ:&#10;Nội&#10; - cô A x bác B&#10;  - chị X&#10;   - X1&#10;   - X2&#10;  - chị Y"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical font-mono"
          rows="6"
        ></textarea>
        <p class="text-xs text-gray-500 mt-2">💡 Dùng dấu cách ở đầu dòng để tạo cấp độ (mỗi dấu cách = 1 cấp)</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4">
        <button 
          @click="saveFamilyTree"
          :disabled="isFamilyLoading || !familyText.trim()"
          class="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
        >
          {{ isFamilyLoading ? 'Đang lưu...' : '💾 Lưu cây gia phả' }}
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
