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
      showMenu: false,
      observed: false
    };
  },

  mounted() {
    // Setup Intersection Observer để lazy load khi card visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.observed) {
            this.observed = true;
            this.$emit('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px', // Trigger 50px trước khi thực sự visible
        threshold: 0.1
      });

      observer.observe(this.$el);
    }
  },

  template: /* html */`
    <div class="card" style="display: flex; flex-direction: column;">
      <!-- Header -->
      <div class="card-header" style="justify-content: space-between;">
        <div class="flex-1">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.5rem;">🎉</span>
            <h3 class="card-title" style="margin: 0;">{{ memory.title }}</h3>
          </div>
          
          <!-- Date Info -->
          <div style="font-size: 0.75rem; color: var(--text-tertiary); display: flex; flex-direction: column; gap: 0.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span>📅</span>
              <span style="color: var(--text-secondary); font-weight: 600;">{{ memory.daysInfo?.dateFormatted }}</span>
            </div>
            <div>
              <span v-if="memory.daysInfo?.isPast" class="badge badge-primary">{{ memory.daysInfo?.label }}</span>
              <span v-else-if="memory.daysInfo?.label === 'Hôm nay'" class="badge badge-error" style="animation: pulse 2s infinite;">🔴 {{ memory.daysInfo?.label }}</span>
              <span v-else-if="memory.daysInfo?.label === 'Ngày mai'" class="badge badge-warning">⭐ {{ memory.daysInfo?.label }}</span>
              <span v-else class="badge badge-info">📌 {{ memory.daysInfo?.label }}</span>
            </div>
          </div>
        </div>

        <!-- Menu Button -->
        <div style="position: relative;">
          <button
            @click="showMenu = !showMenu"
            class="btn btn-text"
            title="Menu"
            style="padding: 0.5rem; font-size: 1.25rem;"
          >
            ⋮
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showMenu"
            style="position: absolute; right: 0; top: 100%; background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); z-index: 10; min-width: 160px; overflow: hidden; margin-top: 0.5rem;"
            @click.stop
          >
            <button
              @click="() => { $emit('edit'); showMenu = false; }"
              style="width: 100%; text-align: left; padding: 0.75rem 1rem; color: var(--text-secondary); background: transparent; border: none; cursor: pointer; font-size: 0.875rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--border); transition: var(--transition);"
              @mouseover="e => e.target.style.backgroundColor = 'var(--bg-secondary)'"
              @mouseout="e => e.target.style.backgroundColor = 'transparent'"
            >
              <span>✏️</span> Chỉnh sửa
            </button>
            <button
              @click="() => { $emit('delete'); showMenu = false; }"
              style="width: 100%; text-align: left; padding: 0.75rem 1rem; color: var(--danger); background: transparent; border: none; cursor: pointer; font-size: 0.875rem; display: flex; align-items: center; gap: 0.75rem; transition: var(--transition);"
              @mouseover="e => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'"
              @mouseout="e => e.target.style.backgroundColor = 'transparent'"
            >
              <span>🗑️</span> Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- Image -->
      <div v-if="memory.imageBase64" style="width: 100%; height: 12rem; background: linear-gradient(to bottom right, var(--bg-secondary), var(--border)); overflow: hidden; border-radius: var(--radius-lg); margin-bottom: 1rem;">
        <img 
          :src="memory.imageBase64" 
          :alt="memory.title"
          style="width: 100%; height: 100%; object-fit: cover; transition: transform 500ms ease-out;"
          @mouseover="e => e.target.style.transform = 'scale(1.1)'"
          @mouseout="e => e.target.style.transform = 'scale(1)'"
        />
      </div>

      <!-- Content -->
      <div style="display: flex; flex-direction: column; gap: 0.75rem; flex: 1;">
        <p 
          v-if="memory.text"
          :style="{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            fontWeight: 500,
            display: isExpanded ? 'block' : '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }"
        >
          {{ memory.text }}
        </p>

        <p v-else style="color: var(--text-tertiary); font-style: italic; font-size: 0.875rem;">
          (Không có mô tả)
        </p>

        <!-- View More Button -->
        <button
          v-if="memory.text && memory.text.length > 200"
          @click="isExpanded = !isExpanded"
          class="btn btn-text"
          style="padding: 0; font-size: 0.8rem; justify-content: flex-start; margin-top: 0.5rem;"
        >
          {{ isExpanded ? '← Thu gọn' : 'Xem thêm →' }}
        </button>
      </div>
    </div>
  `
};
