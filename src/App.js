/**
 * App Component
 * Component chính quản lý routing
 */

import MenuPage from './pages/MenuPage.js';
import ReminderPage from './pages/ReminderPage.js';
import FamilyPage from './pages/FamilyPage.js';
import LunarEventsPage from './pages/LunarEventsPage.js';
import AboutPage from './pages/AboutPage.js';

export default {
  components: {
    MenuPage,
    ReminderPage,
    FamilyPage,
    LunarEventsPage,
    AboutPage
  },

  template: /* html */`
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Loading Overlay (Delete) -->
      <div v-if="isDeleting" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-2xl p-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-spin" style="background-image: conic-gradient(from 0deg, #3b82f6 0deg, #3b82f6 90deg, transparent 90deg); animation: spin 1s linear infinite;"></div>
            </div>
          </div>
          <p class="text-lg font-semibold text-gray-800">Đang xóa nhắc nhở...</p>
          <p class="text-gray-600 text-sm mt-2">Vui lòng chờ, không thao tác gì khác</p>
        </div>
      </div>

      <!-- Loading Overlay (Create) -->
      <div v-if="isCreating" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-2xl p-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-spin" style="background-image: conic-gradient(from 0deg, #10b981 0deg, #10b981 90deg, transparent 90deg); animation: spin 1s linear infinite;"></div>
            </div>
          </div>
          <p class="text-lg font-semibold text-gray-800">Đang tạo nhắc nhở...</p>
          <p class="text-gray-600 text-sm mt-2">Vui lòng chờ, không thao tác gì khác</p>
        </div>
      </div>

      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-indigo-600">🤖 Chatbot Utils</h1>
          <p class="text-gray-600 text-sm">Công cụ hỗ trợ quản lý chatbot</p>
          <p class="text-indigo-500 font-semibold mt-2">👋 Xin chào, {{ username }}!</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Menu Page -->
        <MenuPage 
          v-if="currentPage === 'menu'"
          :username="username"
          @navigate="goToPage"
        />

        <!-- Create Reminder Page -->
        <ReminderPage 
          v-else-if="currentPage === 'createReminder'"
          :api-id="apiId"
          :user-id="userId"
          :username="username"
          @navigate="goToPage"
        />

        <!-- Family Tree Page -->
        <FamilyPage 
          v-else-if="currentPage === 'family'"
          :api-id="apiId"
          @navigate="goToPage"
        />

        <!-- Lunar Events Page -->
        <LunarEventsPage 
          v-else-if="currentPage === 'lunarEvents'"
          :api-id="apiId"
          @navigate="goToPage"
        />

        <!-- About Page -->
        <AboutPage 
          v-else-if="currentPage === 'about'"
          @navigate="goToPage"
        />
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>© 2025 Chatbot Utils | Công cụ hỗ trợ chatbot</p>
        </div>
      </footer>
    </div>
  `,

  setup() {
    // Get config from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const apiId = urlParams.get('apiId') || localStorage.getItem('apiId');
    const userId = urlParams.get('userId') || localStorage.getItem('userId');
    const username = urlParams.get('username') || 'Bạn, Bạn không thể dùng ứng dụng này nếu không có thông tin cấu hình đúng!';
    const initialPage = urlParams.get('page') || 'menu';

    // State
    const { ref } = Vue;
    const currentPage = ref(initialPage);
    const isDeleting = ref(false);
    const isCreating = ref(false);

    const goToPage = (pageName) => {
      currentPage.value = pageName;
    };

    return {
      apiId,
      userId,
      username,
      currentPage,
      isDeleting,
      isCreating,
      goToPage
    };
  }
};
