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
    <div class="page-container">
      <div class="hero-header">
        <div class="hero-header-content">
          <h1>🏠 Menu Chính</h1>
          <p>Chọn chức năng bạn muốn sử dụng</p>
        </div>
      </div>

      <div class="menu-grid">
        <button 
          @click="$emit('navigate', 'createReminder')"
          class="menu-item"
        >
          <div class="menu-icon">📝</div>
          <div class="menu-title">Tạo nhắc nhở</div>
          <div class="menu-desc">Tạo nhắc nhở cho các thành viên</div>
        </button>

        <button 
          @click="$emit('navigate', 'family')"
          class="menu-item"
        >
          <div class="menu-icon">👨‍👩‍👧‍👦</div>
          <div class="menu-title">Họ hàng</div>
          <div class="menu-desc">Xem cây gia phả</div>
        </button>

        <button 
          @click="$emit('navigate', 'lunarEvents')"
          class="menu-item"
        >
          <div class="menu-icon">📅</div>
          <div class="menu-title">Sự kiện âm lịch</div>
          <div class="menu-desc">Quản lý sự kiện âm lịch quan trọng</div>
        </button>

        <button 
          @click="$emit('navigate', 'memories')"
          class="menu-item"
        >
          <div class="menu-icon">🎉</div>
          <div class="menu-title">Kỷ niệm</div>
          <div class="menu-desc">Lưu trữ những kỷ niệm đặc biệt</div>
        </button>

        <button 
          @click="$emit('navigate', 'about')"
          class="menu-item"
        >
          <div class="menu-icon">ℹ️</div>
          <div class="menu-title">Giới thiệu</div>
          <div class="menu-desc">Tìm hiểu về ứng dụng này</div>
        </button>
      </div>
    </div>
  `,

  setup() {
    return {};
  }
};
