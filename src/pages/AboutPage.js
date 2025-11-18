/**
 * AboutPage Component
 * Component hiển thị trang giới thiệu
 */

export default {
  emits: ['navigate'],

  template: /* html */`
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">ℹ️ Giới thiệu</h2>
      
      <div class="space-y-4 text-gray-700">
        <div>
          <h3 class="text-lg font-bold text-indigo-600 mb-2">🎯 Về ứng dụng</h3>
          <p>Chatbot Utils là ứng dụng Progressive Web App (PWA) hỗ trợ quản lý các tiện ích cho chatbot. Ứng dụng giúp bạn tạo và quản lý nhắc nhở, cây gia phả, và sự kiện âm lịch dễ dàng.</p>
        </div>

        <div>
          <h3 class="text-lg font-bold text-indigo-600 mb-2">✨ Tính năng chính</h3>
          <ul class="list-disc list-inside space-y-2 ml-2">
            <li><strong>📝 Tạo nhắc nhở</strong> - Tạo nhắc nhở cho các thành viên với lặp lại (ngày, tuần, tháng)</li>
            <li><strong>👨‍👩‍👧‍👦 Quản lý cây gia phả</strong> - Nhập và hiển thị cây gia phả dạng ASCII đẹp mắt</li>
            <li><strong>📅 Sự kiện âm lịch</strong> - Quản lý sự kiện âm lịch với tính toán ngày khoảng cách động</li>
            <li><strong>⚡ Cache thông minh</strong> - Lấy dữ liệu từ cache ngay, cập nhật từ API ở background</li>
            <li><strong>📱 Responsive design</strong> - Hoạt động tốt trên máy tính, tablet, điện thoại</li>
            <li><strong>⚡ Hiệu suất cao</strong> - Loading overlay, UX mượt mà, font đúng</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold text-indigo-600 mb-2">💻 Công nghệ</h3>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>Vue 3 (Composition API, CDN)</li>
            <li>Tailwind CSS (CDN)</li>
            <li>Roboto Mono (Google Fonts)</li>
            <li>JavaScript ES6+</li>
            <li>localStorage API (cache)</li>
            <li>Fetch API (API calls)</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold text-indigo-600 mb-2">📌 Hướng dẫn sử dụng</h3>
          <ol class="list-decimal list-inside space-y-2 ml-2">
            <li><strong>Tạo nhắc nhở</strong>: Chọn "📝 Tạo nhắc nhở" → Điền thông tin → Lưu</li>
            <li><strong>Cây gia phả</strong>: Chọn "👨‍👩‍👧‍👦 Họ hàng" → Chọn người → Nhập cây → Lưu</li>
            <li><strong>Sự kiện âm lịch</strong>: Chọn "📅 Sự kiện âm lịch" → Nhập sự kiện (ngày/tháng: tên) → Lưu</li>
            <li><strong>Quay lại</strong>: Dùng nút "← Quay lại Menu" hoặc logo để quay về menu chính</li>
          </ol>
        </div>
      </div>

      <button 
        @click="$emit('navigate', 'menu')"
        class="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
      >
        ← Quay lại Menu
      </button>
    </div>
  `,

  setup() {
    return {};
  }
};
