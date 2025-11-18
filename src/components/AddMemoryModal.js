/**
 * AddMemoryModal Component
 * Modal để thêm/chỉnh sửa kỷ niệm
 */

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    successMessage: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => ({
        title: '',
        text: '',
        eventDate: '',
        imageBase64: ''
      })
    }
  },

  emits: ['close', 'save', 'image-upload', 'image-remove'],

  template: /* html */`
    <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50 transition-all duration-300">
      <!-- Modal Content -->
      <div class="w-full max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto">
        <!-- Header with Gradient -->
        <div class="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 flex justify-between items-center rounded-t-3xl">
          <h2 class="text-2xl font-bold text-white drop-shadow-lg">
            {{ isEditing ? '✏️ Chỉnh sửa kỷ niệm' : '🎉 Thêm kỷ niệm mới' }}
          </h2>
          <button
            @click="$emit('close')"
            :disabled="isLoading"
            class="text-white hover:bg-white/20 transition p-2 text-2xl rounded-lg disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <!-- Alert Messages -->
        <div v-if="errorMessage" class="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium">
          ⚠️ {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="mx-6 mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm font-medium">
          ✅ {{ successMessage }}
        </div>

        <!-- Form -->
        <div class="p-6 space-y-5">
          <!-- Title Input -->
          <div>
            <label class="block text-sm font-bold text-gray-800 mb-2">
              📌 Tiêu đề <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="formData.title"
              placeholder="Ví dụ: Ngày sinh, Kỷ niệm gặp gỡ..."
              :disabled="isLoading"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:bg-gray-50 font-medium"
            />
          </div>

          <!-- Event Date -->
          <div>
            <label class="block text-sm font-bold text-gray-800 mb-2">
              📅 Ngày sự kiện <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              v-model="formData.eventDate"
              :disabled="isLoading"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:bg-gray-50 font-medium"
            />
            <p class="text-xs text-gray-500 mt-2 font-medium">
              💡 Chỉ cần nhập ngày-tháng, năm tự động tính theo năm hiện tại hoặc quá khứ
            </p>
          </div>

          <!-- Text Input -->
          <div>
            <label class="block text-sm font-bold text-gray-800 mb-2">
              💬 Mô tả (tùy chọn)
            </label>
            <textarea
              v-model="formData.text"
              placeholder="Nhập mô tả chi tiết về kỷ niệm của bạn..."
              :disabled="isLoading"
              rows="4"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:bg-gray-50 resize-none font-medium"
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-bold text-gray-800 mb-3">
              🖼️ Hình ảnh (tùy chọn)
            </label>

            <!-- Image Preview -->
            <div v-if="formData.imageBase64" class="mb-4 relative group">
              <img
                :src="formData.imageBase64"
                :alt="formData.title"
                class="w-full max-h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition"
              />
              <button
                type="button"
                @click="$emit('image-remove')"
                :disabled="isLoading"
                class="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 disabled:opacity-50 shadow-lg hover:scale-110 transition"
              >
                ✕
              </button>
            </div>

            <!-- File Input -->
            <div v-if="!formData.imageBase64" class="border-3 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-500 hover:bg-purple-50/30 transition cursor-pointer">
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                :disabled="isLoading"
                class="hidden"
                ref="fileInput"
              />
              <button
                type="button"
                @click="$refs.fileInput.click()"
                :disabled="isLoading"
                class="text-purple-600 hover:text-purple-700 font-bold text-lg disabled:opacity-50 transition"
              >
                🎨 Chọn ảnh
              </button>
              <p class="text-sm text-gray-500 mt-2 font-medium">hoặc kéo thả ảnh vào đây</p>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="sticky bottom-0 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-3xl">
          <button
            @click="$emit('close')"
            :disabled="isLoading"
            class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition disabled:opacity-50"
          >
            ❌ Hủy
          </button>
          <button
            @click="$emit('save')"
            :disabled="isLoading"
            class="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span v-if="!isLoading">{{ isEditing ? '💾 Cập nhật' : '✨ Thêm' }}</span>
            <span v-else>⏳ Đang lưu...</span>
          </button>
        </div>
      </div>
    </div>
  `,

  methods: {
    handleFileChange(event) {
      const file = event.target.files?.[0];
      if (file) {
        this.$emit('image-upload', file);
      }
    }
  }
};
