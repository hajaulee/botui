/**
 * AboutPage Component
 * Component hiển thị trang giới thiệu
 */

export default {
  emits: ['navigate'],

  template: /* html */`
    <div class="page-container">
      <button @click="$emit('navigate', 'menu')" class="btn-back">
        ← Quay lại Menu
      </button>

      <div class="hero-header">
        <div class="hero-header-content">
          <h1>ℹ️ Giới thiệu</h1>
          <p>Tìm hiểu về ứng dụng Chatbot Utils</p>
        </div>
      </div>

      <div class="form-container">
        <div class="form-section">
          <h3 class="text-2xl font-bold mb-4">🎯 Về ứng dụng</h3>
          <p class="text-secondary">
            Chatbot Utils là ứng dụng Progressive Web App (PWA) hỗ trợ quản lý các tiện ích cho chatbot. 
            Ứng dụng giúp bạn tạo và quản lý nhắc nhở, cây gia phả, và sự kiện âm lịch dễ dàng.
          </p>
        </div>

        <div class="form-section">
          <h3 class="text-2xl font-bold mb-4">✨ Tính năng chính</h3>
          <ul class="list" style="list-style: none; margin-left: 0;">
            <li class="flex gap-3 p-3 border border-solid" style="border-color: var(--border); border-radius: var(--radius-lg); margin-bottom: 0.5rem;">
              <span>📝</span>
              <div>
                <strong>Tạo nhắc nhở</strong>
                <p class="text-sm text-secondary">Tạo nhắc nhở cho các thành viên với lặp lại (ngày, tuần, tháng)</p>
              </div>
            </li>
            <li class="flex gap-3 p-3 border border-solid" style="border-color: var(--border); border-radius: var(--radius-lg); margin-bottom: 0.5rem;">
              <span>👨‍👩‍👧‍👦</span>
              <div>
                <strong>Quản lý cây gia phả</strong>
                <p class="text-sm text-secondary">Nhập và hiển thị cây gia phả dạng ASCII đẹp mắt</p>
              </div>
            </li>
            <li class="flex gap-3 p-3 border border-solid" style="border-color: var(--border); border-radius: var(--radius-lg); margin-bottom: 0.5rem;">
              <span>📅</span>
              <div>
                <strong>Sự kiện âm lịch</strong>
                <p class="text-sm text-secondary">Quản lý sự kiện âm lịch với tính toán ngày khoảng cách động</p>
              </div>
            </li>
            <li class="flex gap-3 p-3 border border-solid" style="border-color: var(--border); border-radius: var(--radius-lg); margin-bottom: 0.5rem;">
              <span>⚡</span>
              <div>
                <strong>Cache thông minh</strong>
                <p class="text-sm text-secondary">Lấy dữ liệu từ cache ngay, cập nhật từ API ở background</p>
              </div>
            </li>
            <li class="flex gap-3 p-3 border border-solid" style="border-color: var(--border); border-radius: var(--radius-lg); margin-bottom: 0.5rem;">
              <span>📱</span>
              <div>
                <strong>Responsive design</strong>
                <p class="text-sm text-secondary">Hoạt động tốt trên máy tính, tablet, điện thoại</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="form-section">
          <h3 class="text-2xl font-bold mb-4">💻 Công nghệ</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            <div class="badge badge-primary">Vue 3</div>
            <div class="badge badge-primary">Custom CSS</div>
            <div class="badge badge-primary">Roboto Mono</div>
            <div class="badge badge-primary">JavaScript ES6+</div>
            <div class="badge badge-primary">localStorage</div>
            <div class="badge badge-primary">Fetch API</div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="text-2xl font-bold mb-4">📌 Hướng dẫn sử dụng</h3>
          <ol style="margin-left: 1.5rem;">
            <li class="mb-3"><strong>Tạo nhắc nhở</strong>: Chọn "📝 Tạo nhắc nhở" → Điền thông tin → Lưu</li>
            <li class="mb-3"><strong>Cây gia phả</strong>: Chọn "👨‍👩‍👧‍👦 Họ hàng" → Chọn người → Nhập cây → Lưu</li>
            <li class="mb-3"><strong>Sự kiện âm lịch</strong>: Chọn "📅 Sự kiện âm lịch" → Nhập sự kiện (ngày/tháng: tên) → Lưu</li>
            <li><strong>Quay lại</strong>: Dùng nút "← Quay lại Menu" để quay về menu chính</li>
          </ol>
        </div>

        <div class="btn-group full" style="margin-top: 2rem;">
          <button 
            @click="$emit('navigate', 'menu')"
            class="btn btn-primary"
          >
            ← Quay lại Menu
          </button>
        </div>
      </div>
    </div>
  `,

  setup() {
    return {};
  }
};
