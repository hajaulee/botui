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
    <div class="animate-pulse" style="width: 100%;">
      <div class="card" style="display: flex; flex-direction: column; width: 100%; overflow: hidden;">
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
        </div>

        <!-- Image skeleton -->
        <div style="width: 100%; height: 12rem; background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border) 37%, var(--bg-secondary) 63%); background-size: 200% 100%; animation: loading 1.5s infinite; border-radius: var(--radius-lg); margin-bottom: 1rem; box-sizing: border-box; overflow: hidden;"></div>

        <!-- Content skeleton -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; box-sizing: border-box; overflow: hidden;">
          <div style="height: 1rem; background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border) 37%, var(--bg-secondary) 63%); background-size: 200% 100%; animation: loading 1.5s infinite; border-radius: var(--radius-md); width: 100%;"></div>
          <div style="height: 1rem; background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border) 37%, var(--bg-secondary) 63%); background-size: 200% 100%; animation: loading 1.5s infinite; border-radius: var(--radius-md); width: 85%;"></div>
          <div style="height: 1rem; background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border) 37%, var(--bg-secondary) 63%); background-size: 200% 100%; animation: loading 1.5s infinite; border-radius: var(--radius-md); width: 70%;"></div>
        </div>
      </div>
    </div>
  `
};
