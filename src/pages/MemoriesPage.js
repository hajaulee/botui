/**
 * MemoriesPage Component
 * Trang chính để quản lý kỷ niệm (API version)
 */

import { useMemories } from '../composables/useMemories.js';
import MemoryCard from '../components/MemoryCard.js';
import SkeletonMemoryCard from '../components/SkeletonMemoryCard.js';
import AddMemoryModal from '../components/AddMemoryModal.js';

export default {
  components: {
    MemoryCard,
    SkeletonMemoryCard,
    AddMemoryModal
  },

  emits: ['navigate'],

  template: /* html */`
    <div class="space-y-6">
      <!-- Back Button -->
      <button
        @click="$emit('navigate', 'menu')"
        class="text-gray-600 hover:text-gray-800 font-semibold mb-2 flex items-center gap-2 transition hover:gap-3"
      >
        ← Quay lại menu
      </button>

      <!-- Header with Gradient -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-8 text-white shadow-2xl">
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
        <div class="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
        
        <div class="relative z-10">
          <h1 class="text-5xl font-black mb-2 drop-shadow-lg">🎉 Kỷ niệm</h1>
          <p class="text-lg text-white/90 font-medium">Lưu trữ và quản lý những kỷ niệm đặc biệt của bạn</p>
        </div>
      </div>

      <!-- Search and Add Button -->
      <div class="relative">
        <!-- Animated Background Gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur-xl"></div>
        
        <div class="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50 space-y-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1 relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <input
                v-model="searchQuery"
                @keyup.enter="searchMemories"
                type="text"
                placeholder="🔍 Tìm kiếm kỷ niệm..."
                class="relative w-full px-5 py-3 pl-5 border-2 border-gray-200 hover:border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-white/50 hover:bg-white"
              />
            </div>

            <!-- Search Button -->
            <button
              @click="searchMemories"
              :disabled="isLoading"
              class="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition disabled:opacity-50 shadow-lg hover:shadow-2xl overflow-hidden"
            >
              <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <span class="relative flex items-center justify-center gap-2">
                <span class="text-lg">🔍</span> Tìm
              </span>
            </button>

            <!-- Add Button -->
            <button
              @click="openAddModal"
              :disabled="isLoading"
              class="group relative px-8 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-emerald-600 hover:from-green-600 hover:via-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition disabled:opacity-50 shadow-lg hover:shadow-2xl overflow-hidden"
            >
              <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <span class="relative flex items-center justify-center gap-2">
                <span class="text-lg group-hover:scale-125 transition duration-300">✨</span> Thêm
              </span>
            </button>
          </div>

          <!-- Results Info -->
          <div v-if="filteredMemories.length > 0" class="pt-2 border-t border-gray-200/50">
            <p class="text-sm text-gray-600 font-medium">
              <span class="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                📌 Đang hiển thị <span class="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ filteredMemories.length }}</span> kỷ niệm
                <span v-if="searchQuery">
                  • Tìm: <span class="font-semibold text-gray-800">"{{ searchQuery }}"</span>
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Alert Messages -->
      <div v-if="errorMessage" class="bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-500 rounded-xl p-4 text-red-700 font-medium shadow-md animate-in slide-in-from-top">
        ⚠️ {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="bg-gradient-to-r from-green-50 to-green-100/50 border-l-4 border-green-500 rounded-xl p-4 text-green-700 font-medium shadow-md animate-in slide-in-from-top">
        ✅ {{ successMessage }}
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && filteredMemories.length === 0" class="text-center py-16">
        <div class="inline-block mb-6">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin" style="background-image: conic-gradient(from 0deg, #a855f7 0deg, #a855f7 90deg, transparent 90deg); animation: spin 2s linear infinite;"></div>
            <div class="absolute inset-2 bg-white rounded-full"></div>
          </div>
        </div>
        <p class="text-gray-600 font-semibold text-lg">⏳ Đang tải kỷ niệm...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredMemories.length === 0 && !isLoading" class="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-16 text-center border-2 border-gray-100">
        <div class="text-8xl mb-6 animate-bounce">📝</div>
        <h2 class="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Chưa có kỷ niệm nào</h2>
        <p class="text-gray-600 mb-8 font-medium text-lg">Hãy thêm kỷ niệm đầu tiên để bắt đầu hành trình lưu giữ khoảnh khắc đặc biệt!</p>
        <button
          @click="openAddModal"
          class="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition shadow-lg hover:shadow-xl inline-block"
        >
          ➕ Thêm kỷ niệm mới
        </button>
      </div>

      <!-- Memory Cards Grid -->
      <div v-if="filteredMemories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref="cardContainer">
        <!-- Memory Card or Skeleton -->
        <template v-for="memory in filteredMemories" :key="memory.id">
          <!-- Show skeleton while loading detail -->
          <SkeletonMemoryCard v-if="isMemoryLoading(memory.id)" :memory="memory" />
          
          <!-- Show full card when loaded -->
          <MemoryCard
            v-else
            :memory="memory"
            @edit="openEditModal(memory)"
            @delete="deleteMemory(memory.id)"
            @visible="() => lazyLoadMemory(memory.id)"
          />
        </template>
      </div>

      <!-- Load More Button (Infinite Scroll) -->
      <div v-if="hasMore() && filteredMemories.length > 0" class="text-center py-12">
        <button
          @click="loadMore"
          :disabled="isLoadingMore"
          class="px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold transition disabled:opacity-50 shadow-lg hover:shadow-xl"
        >
          {{ isLoadingMore ? '⏳ Đang tải...' : '📥 Xem thêm kỷ niệm' }}
        </button>
      </div>

      <!-- Add/Edit Memory Modal -->
      <AddMemoryModal
        :show="showAddModal"
        :is-editing="editingMemory !== null"
        :is-loading="isLoading"
        :error-message="errorMessage"
        :success-message="successMessage"
        :form-data="formData"
        @close="closeModal"
        @save="saveMemory"
        @image-upload="handleImageUpload"
        @image-remove="removeImage"
      />
    </div>
  `,

  props: {
    apiId: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const composable = useMemories(props.apiId);

    // Load memories list on mount
    const { onMounted } = Vue;
    
    onMounted(async () => {
      await composable.loadMemoriesList();
    });

    return composable;
  }

};
