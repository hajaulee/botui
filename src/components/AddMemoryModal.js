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
    <div v-if="show" style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); display: flex; align-items: flex-end; z-index: 50; transition: var(--transition);">
      <!-- Modal Content -->
      <div style="width: 100%; max-height: 90vh; background-color: var(--surface); border-radius: var(--radius-3xl); box-shadow: var(--shadow-xl); overflow-y: auto; display: flex; flex-direction: column;">
        <!-- Header with Gradient -->
        <div style="position: sticky; top: 0; background: linear-gradient(to right, var(--primary), var(--secondary)); padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-radius: var(--radius-3xl) var(--radius-3xl) 0 0; color: white; z-index: 10;">
          <h2 style="font-size: 1.5rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            {{ isEditing ? '✏️ Chỉnh sửa kỷ niệm' : '🎉 Thêm kỷ niệm mới' }}
          </h2>
          <button
            @click="$emit('close')"
            :disabled="isLoading"
            style="color: white; background: transparent; border: none; padding: 0.5rem; font-size: 1.5rem; border-radius: var(--radius-lg); cursor: pointer; transition: var(--transition); opacity: isLoading ? 0.5 : 1;"
            @mouseover="e => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'"
            @mouseout="e => e.target.style.backgroundColor = 'transparent'"
          >
            ✕
          </button>
        </div>

        <!-- Alert Messages -->
        <div v-if="errorMessage" class="alert alert-error" style="margin: 1rem 1.5rem 0;">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">{{ errorMessage }}</div>
        </div>

        <div v-if="successMessage" class="alert alert-success" style="margin: 1rem 1.5rem 0;">
          <div class="alert-icon">✅</div>
          <div class="alert-content">{{ successMessage }}</div>
        </div>

        <!-- Form -->
        <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Title Input -->
          <div class="form-group">
            <label class="form-label">
              📌 Tiêu đề <span style="color: var(--danger);">*</span>
            </label>
            <input
              type="text"
              v-model="formData.title"
              placeholder="Ví dụ: Ngày sinh, Kỷ niệm gặp gỡ..."
              :disabled="isLoading"
              class="w-full"
            />
          </div>

          <!-- Event Date -->
          <div class="form-group">
            <label class="form-label">
              📅 Ngày sự kiện <span style="color: var(--danger);">*</span>
            </label>
            <input
              type="date"
              v-model="formData.eventDate"
              :disabled="isLoading"
              class="w-full"
            />
            <div class="form-hint">💡 Chỉ cần nhập ngày-tháng, năm tự động tính theo năm hiện tại hoặc quá khứ</div>
          </div>

          <!-- Text Input -->
          <div class="form-group">
            <label class="form-label">💬 Mô tả (tùy chọn)</label>
            <textarea
              v-model="formData.text"
              placeholder="Nhập mô tả chi tiết về kỷ niệm của bạn..."
              :disabled="isLoading"
              class="w-full"
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div class="form-group">
            <label class="form-label">🖼️ Hình ảnh (tùy chọn)</label>

            <!-- Image Preview -->
            <div v-if="formData.imageBase64" style="margin-bottom: 1rem; position: relative;">
              <img
                :src="formData.imageBase64"
                :alt="formData.title"
                style="width: 100%; max-height: 16rem; object-fit: cover; border-radius: var(--radius-2xl); box-shadow: var(--shadow-lg); transition: var(--transition);"
              />
              <button
                type="button"
                @click="$emit('image-remove')"
                :disabled="isLoading"
                style="position: absolute; top: 0.75rem; right: 0.75rem; background-color: var(--danger); color: white; border: none; border-radius: 50%; padding: 0.75rem; cursor: pointer; box-shadow: var(--shadow-lg); transition: var(--transition); opacity: isLoading ? 0.5 : 1; font-size: 1rem;"
                @mouseover="e => {e.target.style.backgroundColor = '#dc2626'; e.target.style.transform = 'scale(1.1)';}"
                @mouseout="e => {e.target.style.backgroundColor = 'var(--danger)'; e.target.style.transform = 'scale(1)';}"
              >
                ✕
              </button>
            </div>

            <!-- File Input -->
            <div v-if="!formData.imageBase64" style="border: 3px dashed var(--border); border-radius: var(--radius-2xl); padding: 2rem; text-align: center; cursor: pointer; transition: var(--transition);" @mouseover="e => {e.style.borderColor = 'var(--primary)'; e.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';}" @mouseout="e => {e.style.borderColor = 'var(--border)'; e.style.backgroundColor = 'transparent';}">
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                :disabled="isLoading"
                style="display: none;"
                ref="fileInput"
              />
              <button
                type="button"
                @click="$refs.fileInput.click()"
                :disabled="isLoading"
                class="btn btn-text"
                style="font-size: 1.125rem; padding: 0; justify-content: center; width: 100%; opacity: isLoading ? 0.5 : 1;"
              >
                🎨 Chọn ảnh
              </button>
              <p style="font-size: 0.875rem; color: var(--text-tertiary); margin-top: 0.5rem;">hoặc kéo thả ảnh vào đây</p>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div style="position: sticky; bottom: 0; background: linear-gradient(to right, var(--bg-secondary), var(--surface)); border-top: 1px solid var(--border); padding: 1rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem; border-radius: 0 0 var(--radius-3xl) var(--radius-3xl); z-index: 10;">
          <button
            @click="$emit('close')"
            :disabled="isLoading"
            class="btn btn-secondary"
          >
            ❌ Hủy
          </button>
          <button
            @click="$emit('save')"
            :disabled="isLoading"
            class="btn btn-success"
            style="display: flex; align-items: center; gap: 0.5rem;"
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
