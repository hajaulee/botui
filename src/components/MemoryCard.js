/**
 * MemoryCard Component
 * Hiển thị kỷ niệm dạng card Facebook
 */

export default {
  props: {
    memory: {
      type: Object,
      required: true
    }
  },

  emits: ['edit', 'delete'],

  data() {
    return {
      isExpanded: false,
      showMenu: false
    };
  },

  template: /* html */`
    <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105">
      <!-- Gradient Border Top -->
      <div class="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

      <!-- Header -->
      <div class="px-5 py-4 flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl transform group-hover:scale-125 transition duration-300">🎉</span>
            <h3 class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ memory.title }}</h3>
          </div>
          
          <!-- Date Info -->
          <div class="text-xs text-gray-500 space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-gray-400">📅</span>
              <span class="font-medium text-gray-700">{{ memory.daysInfo?.dateFormatted }}</span>
            </div>
            <div>
              <span v-if="memory.daysInfo?.isPast" class="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">{{ memory.daysInfo?.label }}</span>
              <span v-else-if="memory.daysInfo?.label === 'Hôm nay'" class="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold animate-pulse">🔴 {{ memory.daysInfo?.label }}</span>
              <span v-else-if="memory.daysInfo?.label === 'Ngày mai'" class="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">⭐ {{ memory.daysInfo?.label }}</span>
              <span v-else class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">📌 {{ memory.daysInfo?.label }}</span>
            </div>
          </div>
        </div>

        <!-- Menu Button -->
        <div class="relative">
          <button
            @click="showMenu = !showMenu"
            class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition p-2 text-xl rounded-lg"
            title="Menu"
          >
            ⋮
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-10 min-w-40 overflow-hidden"
            @click.stop
          >
            <button
              @click="() => { $emit('edit'); showMenu = false; }"
              class="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition text-sm flex items-center gap-3 border-b border-gray-100 last:border-b-0"
            >
              <span>✏️</span> Chỉnh sửa
            </button>
            <button
              @click="() => { $emit('delete'); showMenu = false; }"
              class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition text-sm flex items-center gap-3"
            >
              <span>🗑️</span> Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- Image -->
      <div v-if="memory.imageBase64" class="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img 
          :src="memory.imageBase64" 
          :alt="memory.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>

      <!-- Content -->
      <div class="px-5 py-4 space-y-3">
        <p 
          v-if="memory.text"
          :class="[
            'text-gray-600 text-sm leading-relaxed font-medium',
            { 'line-clamp-3': !isExpanded }
          ]"
        >
          {{ memory.text }}
        </p>

        <p v-else class="text-gray-400 italic text-sm">
          (Không có mô tả)
        </p>

        <!-- View More Button -->
        <button
          v-if="memory.text && memory.text.length > 200"
          @click="isExpanded = !isExpanded"
          class="text-blue-600 hover:text-blue-700 text-xs font-bold mt-2 transition hover:gap-1 flex items-center gap-0.5"
        >
          {{ isExpanded ? '← Thu gọn' : 'Xem thêm →' }}
        </button>
      </div>
    </div>
  `
};
