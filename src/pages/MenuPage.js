/**
 * MenuPage Component
 * Component hiển thị menu chính
 */

export default {
  props: {
    username: String
  },

  emits: ['navigate'],

  template: /* html */`
    <div class="space-y-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">Chọn chức năng</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Create Reminder Button -->
          <button 
            @click="$emit('navigate', 'createReminder')"
            class="p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md transition transform hover:scale-105 active:scale-95"
          >
            <div class="text-4xl mb-3">📝</div>
            <h3 class="text-xl font-bold">Tạo nhắc nhở</h3>
            <p class="text-sm text-blue-100 mt-2">Tạo nhắc nhở cho các thành viên</p>
          </button>

          <!-- Family Tree Button -->
          <button 
            @click="$emit('navigate', 'family')"
            class="p-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md transition transform hover:scale-105 active:scale-95"
          >
            <div class="text-4xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 class="text-xl font-bold">Họ hàng</h3>
            <p class="text-sm text-green-100 mt-2">Xem cây gia phả</p>
          </button>

          <!-- Lunar Events Button -->
          <button 
            @click="$emit('navigate', 'lunarEvents')"
            class="p-6 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md transition transform hover:scale-105 active:scale-95"
          >
            <div class="text-4xl mb-3">📅</div>
            <h3 class="text-xl font-bold">Sự kiện âm lịch</h3>
            <p class="text-sm text-orange-100 mt-2">Quản lý sự kiện âm lịch quan trọng</p>
          </button>

          <!-- About Button -->
          <button 
            @click="$emit('navigate', 'about')"
            class="p-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-md transition transform hover:scale-105 active:scale-95"
          >
            <div class="text-4xl mb-3">ℹ️</div>
            <h3 class="text-xl font-bold">Giới thiệu</h3>
            <p class="text-sm text-purple-100 mt-2">Tìm hiểu về ứng dụng này</p>
          </button>
        </div>
      </div>
    </div>
  `,

  setup() {
    return {};
  }
};
