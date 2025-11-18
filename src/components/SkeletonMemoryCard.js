/**
 * SkeletonMemoryCard Component
 * Loading skeleton khi memory chưa được load
 * Hiển thị title, date, dateInfo từ basic info
 */

export default {
  props: {
    memory: {
      type: Object,
      default: () => ({
        title: '',
        eventDate: '',
        daysInfo: null
      })
    }
  },

  template: /* html */`
    <div class="animate-pulse">
      <div class="group relative bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Gradient Border Top -->
        <div class="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

        <!-- Header -->
        <div class="px-5 py-4 space-y-3">
          <!-- Title (thực, không skeleton) -->
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🎉</span>
            <h3 class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ memory.title }}</h3>
          </div>
          
          <!-- Date Info (thực, không skeleton) -->
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

        <!-- Image skeleton -->
        <div class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>

        <!-- Content skeleton -->
        <div class="px-5 py-4 space-y-3">
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded-full"></div>
            <div class="h-4 bg-gray-200 rounded-full w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded-full w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  `
};
