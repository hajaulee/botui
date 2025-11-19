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
    <div class="page-container">
      <button @click="$emit('navigate', 'menu')" class="btn-back">
        ← Quay lại menu
      </button>

      <!-- Header with Gradient -->
      <div class="hero-header" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);">
        <div class="hero-header-content">
          <h1>🎉 Kỷ niệm</h1>
          <p>Lưu trữ và quản lý những kỷ niệm đặc biệt của bạn</p>
        </div>
      </div>

      <!-- Search and Add Button -->
      <div class="card" style="margin-top: 1.5rem;">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search Input -->
          <div class="flex-1">
            <input
              v-model="searchQuery"
              @keyup.enter="searchMemories"
              type="text"
              placeholder="🔍 Tìm kiếm kỷ niệm..."
              class="w-full"
            />
          </div>

          <!-- Search Button -->
          <button
            @click="searchMemories"
            :disabled="isLoading"
            class="btn btn-info"
          >
            🔍 Tìm
          </button>

          <!-- Add Button -->
          <button
            @click="openAddModal"
            :disabled="isLoading"
            class="btn btn-success"
          >
            ✨ Thêm
          </button>
        </div>

        <!-- Results Info -->
        <div v-if="displayedMemories.length > 0" class="mt-4 pt-4">
          <p class="text-sm font-medium">
            <span class="badge badge-primary">
              📌 Đang hiển thị <strong>{{ displayedMemories.length }}</strong> kỷ niệm
              <span v-if="searchQuery">
                • Tìm: <strong>"{{ searchQuery }}"</strong>
              </span>
            </span>
          </p>
        </div>
      </div>

      <!-- Alert Messages -->
      <div v-if="errorMessage" class="alert alert-error">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">{{ errorMessage }}</div>
      </div>

      <div v-if="successMessage" class="alert alert-success">
        <div class="alert-icon">✅</div>
        <div class="alert-content">{{ successMessage }}</div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && displayedMemories.length === 0" class="text-center py-16">
        <div style="font-size: 3rem; margin-bottom: 1rem; animation: spin 2s linear infinite;">⏳</div>
        <p class="text-secondary font-semibold">Đang tải kỷ niệm...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="displayedMemories.length === 0 && !isLoading" class="card text-center p-8">
        <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 1s infinite;">📝</div>
        <h2 class="text-2xl font-bold mb-3">Chưa có kỷ niệm nào</h2>
        <p class="text-secondary mb-6">Hãy thêm kỷ niệm đầu tiên để bắt đầu hành trình lưu giữ khoảnh khắc đặc biệt!</p>
        <button
          @click="openAddModal"
          class="btn btn-success"
        >
          ➕ Thêm kỷ niệm mới
        </button>
      </div>

      <!-- Memory Cards Grid -->
      <div v-if="displayedMemories.length > 0" class="card-grid" ref="cardContainer">
        <!-- Memory Card or Skeleton -->
        <template v-for="memory in displayedMemories" :key="memory.id">
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

      <!-- Load More Sentinel (for infinite scroll) -->
      <div v-if="hasMore() && displayedMemories.length > 0" class="flex justify-center p-8" ref="loadMoreSentinel">
        <div class="text-secondary font-semibold">⏳ {{ isLoadingMore ? 'Đang tải thêm...' : 'Scroll để tải thêm' }}</div>
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

    // Load memories list on mount + setup infinite scroll
    const { onMounted, ref } = Vue;
    let observer = null;
    const loadMoreSentinel = ref(null);
    
    onMounted(async () => {
      await composable.loadMemoriesList();
      setupInfiniteScroll();
    });

    const setupInfiniteScroll = () => {
      if (observer) {
        observer.disconnect();
      }

      // Dùng ref template thay vì querySelector
      if (!loadMoreSentinel.value) {
        console.warn('⚠️ Load more sentinel element not found');
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && composable.hasMore() && !composable.isLoadingMore.value) {
              composable.addMoreItems();
            }
          });
        },
        {
          rootMargin: '100px',
          threshold: 0.1
        }
      );

      observer.observe(loadMoreSentinel.value);
    };

    return {
      ...composable,
      loadMoreSentinel
    };
  }

};
